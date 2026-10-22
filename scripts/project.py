#!/usr/bin/env python3
"""Prepare a disposable, pinned upstream checkout and apply NewEVEn patches."""
from pathlib import Path
import argparse, hashlib, json, os, shutil, subprocess, tarfile
ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / '.work/webmail'
PIN = json.loads((ROOT / 'config/upstream.json').read_text())
def run(*args, cwd=ROOT, env=None):
    subprocess.run(args, cwd=cwd, env=env, check=True)
def prepare():
    actual = subprocess.check_output(['git','rev-parse','HEAD'], cwd=ROOT/'upstream', text=True).strip()
    if actual != PIN['commit']:
        raise SystemExit('Upstream commit differs from config/upstream.json; review update first.')
    # Preserve downloaded dependencies, but rebuild all sources from the pinned Git tree.
    if WORK.exists():
        for entry in WORK.iterdir():
            if entry.name == 'node_modules': continue
            if entry.is_dir() and not entry.is_symlink(): shutil.rmtree(entry)
            else: entry.unlink()
    WORK.mkdir(parents=True, exist_ok=True)
    archive = ROOT / '.work/upstream.tar'
    run('git','archive','--format=tar',f'--output={archive}',PIN['commit'],cwd=ROOT/'upstream')
    with tarfile.open(archive) as stream: stream.extractall(WORK, filter='data')
    archive.unlink()
    for patch in sorted((ROOT/'patches').glob('*.patch')):
        run('git','apply','--check',str(patch),cwd=WORK)
        run('git','apply',str(patch),cwd=WORK)
    shutil.copytree(ROOT/'overlays',WORK,dirs_exist_ok=True)
    print(f'Prepared {WORK}',flush=True)
def assets():
    run('node',str(ROOT/'scripts/assets.mjs'),str(WORK))
def source_hash():
    digest = hashlib.sha256()
    for directory in ['patches', 'overlays', 'branding', 'scripts', 'config']:
        for p in sorted((ROOT/directory).rglob('*')):
            if p.is_file() and p.suffix != '.md' and '__pycache__' not in p.parts:
                digest.update(str(p.relative_to(ROOT)).encode())
                digest.update(p.read_bytes())
    return digest.hexdigest()
def env_for(target):
    env = os.environ.copy()
    env.update(NEXT_PUBLIC_LITE_BUILD_ID='1.17.0-neweven-'+source_hash()[:12],CI='true',LITE_APP_NAME='NewEVEn Mail',LITE_LOCALES='de,en',NEXT_PUBLIC_DEFAULT_LOCALE='de',
      LITE_TARGET=target, LITE_JMAP_SERVER_URL='' if target=='stalwart' else os.environ.get('NEWEVEN_TEST_SERVER','https://neweven.ebriefbox.de'),
      LITE_ALLOW_CUSTOM_ENDPOINT='false',LITE_DEMO_MODE='false',GIT_COMMIT=PIN['commit'])
    env.pop('NEXT_PUBLIC_BASE_PATH',None)
    return env
parser=argparse.ArgumentParser()
parser.add_argument('action',choices=['prepare','install','assets','test','build','serve','demo'])
parser.add_argument('--target',choices=['static','stalwart'],default='static')
parser.add_argument('--port',type=int,default=None)
a=parser.parse_args()
if a.action=='prepare': prepare()
elif a.action=='install': run('npm','ci','--ignore-scripts',cwd=WORK)
elif a.action=='assets': assets()
elif a.action=='test':
    run('node','node_modules/vitest/vitest.mjs','run','lib/__tests__/lite-config.test.ts','lib/__tests__/lite-stalwart-runtime.test.ts','stores/__tests__/auth-store-lite.test.ts','stores/__tests__/auth-store-login-in-place-lite.test.ts','lib/__tests__/email-sanitization.test.ts','lib/__tests__/builtin-themes.test.ts','lib/__tests__/neweven-theme.test.ts',cwd=WORK)
elif a.action=='build':
    assets()
    run('npm','run','build:lite',cwd=WORK,env=env_for(a.target))
    dest=ROOT/'dist'/a.target
    if dest.exists(): shutil.rmtree(dest)
    shutil.copytree(WORK/'out',dest)
    if a.target=='stalwart': shutil.copy2(WORK/'bulwark-lite-stalwart.zip',dest.parent/'neweven-mail-1.17.0-stalwart.zip')
    evidence={'sourceHash':source_hash(),'upstream':PIN,'target':a.target,'patches':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((ROOT/'patches').glob('*.patch'))},'files':{str(p.relative_to(dest)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(dest.rglob('*')) if p.is_file()}}
    (dest.parent/f'{a.target}-checksums.json').write_text(json.dumps(evidence,indent=2)+'\n')
    print(f'Build ready: {dest}')
elif a.action=='demo':
    # Only the local copy gets synthetic demo data. Production outputs stay unchanged.
    dest=ROOT/'dist/demo'
    if dest.exists(): shutil.rmtree(dest)
    shutil.copytree(ROOT/'dist/static',dest)
    config=json.loads((dest/'config.json').read_text())
    config.update(demoMode=True,appName='NewEVEn Mail · Demo',jmapServerUrl='',allowCustomJmapEndpoint=False)
    (dest/'config.json').write_text(json.dumps(config,indent=2)+'\n')
    print('Synthetic demo only: http://localhost:4174/de/login/',flush=True)
    run('node',str(WORK/'scripts/lite/serve.mjs'),str(dest),str(a.port or 4174))
elif a.action=='serve':
    args=['node',str(WORK/'scripts/lite/serve.mjs'),str(ROOT/'dist'/a.target),str(a.port or 4173)]
    if a.target=='stalwart': args+=['--stalwart=/webmail-test']
    run(*args)
