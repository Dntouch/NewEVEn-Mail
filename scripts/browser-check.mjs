import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(new URL('../.work/webmail/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const output = new URL('../artifacts/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({headless: true, ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {})});
const base = process.env.NEWEVEN_PREVIEW_URL || 'http://localhost:4173/webmail-test';
const problems = [];
const result = [];
try {
 for (const [label,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small-mobile',320,740]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', e => problems.push(`${label}: ${e.message}`));
  // Do not contact a real mail server. This check covers the actual compiled UI only.
  await page.route('**/*', route => {
   const url = new URL(route.request().url());
   if (url.origin !== new URL(base).origin) return route.abort();
   if (['/api/','/auth/','/.well-known/','/jmap'].some(prefix=>url.pathname.startsWith(prefix)))
    return route.fulfill({status:404,body:'{}',contentType:'application/json'});
   return route.continue();
  });
  await page.goto(`${base}/de/login/`,{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'Willkommen bei NewEVEn Mail'}).waitFor();
  await page.locator('#username').fill('preview@example.invalid');
  await page.locator('#password').fill('preview-only');
  const password = page.locator('#password');
  if (await password.getAttribute('type') !== 'password') throw new Error('Password must start masked');
  const visibility = password.locator('..').getByRole('button');
  await visibility.click();
  if (await password.getAttribute('type') !== 'text') throw new Error('Password reveal failed');
  await visibility.click();
  await page.locator('#username').clear();
  await page.locator('#password').clear();
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) problems.push(`${label}: horizontal overflow`);
  const assets = await page.locator('.neweven-brand img').evaluate(img=>img.complete && img.naturalWidth>0);
  if (!assets) problems.push(`${label}: missing logo`);
  await page.screenshot({path:new URL(`login-${label}.png`,output).pathname,fullPage:true});
  await page.getByRole('button',{name:'Ich habe einen 2FA-Code'}).click();
  const otp = page.locator('input[autocomplete="one-time-code"]');
  await otp.waitFor({state:'visible'});
  await otp.fill('12a34');
  if (await otp.inputValue() !== '1234') throw new Error('TOTP numeric filtering failed');
  await otp.fill('123456');
  await page.getByRole('combobox',{name:'Sprache'}).selectOption('en');
  await page.getByRole('heading',{name:'Welcome to NewEVEn Mail'}).waitFor();
  if (!page.url().includes('/webmail-test/en/login') && base.endsWith('/webmail-test')) problems.push(`${label}: language escaped mount`);
  result.push({viewport:label,width,height,overflow,logoLoaded:assets,languageSwitch:true,passwordReveal:true,totp:true});
  await context.close();
 }
 await writeFile(new URL('browser-check.json',output),JSON.stringify({results:result,problems},null,2)+'\n');
 if (problems.length) throw new Error(problems.join('\n'));
 console.log(JSON.stringify(result,null,2));
} finally { await browser.close(); }
