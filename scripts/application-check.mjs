import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(new URL('../.work/webmail/package.json',import.meta.url));
const {chromium} = require('@playwright/test');
const output = new URL('../artifacts/',import.meta.url);
await mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
const base = process.env.NEWEVEN_DEMO_URL || 'http://localhost:4174';
const results=[];
const problems=[];
try {
 for (const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror',e=>problems.push(`${device}: ${e.message}`));
  await page.route('**/*',route=>new URL(route.request().url()).origin!==new URL(base).origin ? route.abort() : route.continue());
  await page.goto(`${base}/en/login/`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:/demo/i}).first().click();
  await page.waitForURL(/\/en\/?(mail\/?.*)?(\?.*)?$/);
  await page.waitForFunction(()=>document.body.innerText.includes('Inbox'));
  for (const surface of ['mail','calendar','contacts','files','settings']) {
   if (surface!=='mail') await page.goto(`${base}/en/${surface}/`,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.body.dataset.themeSkin==='builtin-neweven');
   const state=await page.evaluate(()=>({
    skin:document.body.dataset.themeSkin,
    dark:document.documentElement.classList.contains('dark'),
    background:getComputedStyle(document.body).getPropertyValue('--color-background').trim(),
    overflow:document.documentElement.scrollWidth>window.innerWidth,
    loginVisible:!!document.querySelector('#password'),
   }));
   if (state.background!=='#06111f' || !state.dark || state.overflow || state.loginVisible) throw new Error(`${device} ${surface}: ${JSON.stringify(state)}`);
   await page.screenshot({path:new URL(`app-${surface}-${device}.png`,output).pathname,fullPage:true});
   results.push({device,surface,...state});
  }
  await context.close();
 }
 await writeFile(new URL('application-check.json',output),JSON.stringify({syntheticDemo:true,results,problems},null,2)+'\n');
 if (problems.length) throw new Error(problems.join('\n'));
 console.log(`Passed ${results.length} theme checks in the actual Bulwark application, with synthetic demo data.`);
} finally {await browser.close();}
