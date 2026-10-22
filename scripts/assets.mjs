import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
const root = resolve(process.argv[2]);
const require = createRequire(join(root, 'package.json'));
const sharp = require('sharp');
await sharp(new URL('../branding/earth-source.png', import.meta.url).pathname).resize({width: 1920, withoutEnlargement: true}).webp({quality: 83}).toFile(join(root, 'public/branding/neweven/earth.webp'));
for (const size of [192, 512]) {
  const source = join(root, 'public/branding/neweven/mark.svg');
  await sharp(source).resize(size,size).png().toFile(join(root, `public/icon-${size}x${size}.png`));
  for (const mode of ['light','dark']) {
    const inner = Math.round(size*.72);
    const pad = Math.floor((size-inner)/2);
    const mark = await sharp(source).resize(inner,inner).png().toBuffer();
    await sharp({create: {width:size,height:size,channels:4,background:'#05111f'}}).composite([{input:mark,left:pad,top:pad}]).png().toFile(join(root,`public/icon-maskable-${mode}-${size}x${size}.png`));
  }
}
await sharp(join(root,'public/branding/neweven/mark.svg')).resize(180,180).png().toFile(join(root,'public/apple-touch-icon.png'));
