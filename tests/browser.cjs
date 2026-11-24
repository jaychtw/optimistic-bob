const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 try {
 const page = await browser.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
   const start=OscillatorNode.prototype.start;
   window.tones=0;
   OscillatorNode.prototype.start=function(...args){window.tones++;return start.apply(this,args)};
 });
 let calls=0;
 await page.route('**/ob3000Respond', route=>{calls++;return route.fulfill({status:429,body:''})});
 await page.goto('http://127.0.0.1:8765');
 for(const [lang,messages] of [['en',['I washed the mug','Solve 2+2','I want to die']],['zh',['我洗了杯子','幫我計算 2+2','我不想活了']]]){
   await page.click('#'+lang);
   await page.reload();
   assert.equal(await page.locator('html').getAttribute('lang'),lang==='en'?'en':'zh-TW');
   assert.equal(await page.locator('body').getAttribute('class'),'idle');
   for(const [i,message] of messages.entries()){
     const before=calls;
     await page.fill('#message',message); await page.click('#submit');
     if(i<2) await page.waitForSelector('body.processing');
     await page.waitForSelector('body.'+['hype','malfunction','safety'][i]);
     assert.equal(calls-before,i<2?1:0);
   }
 }
 assert.ok(await page.evaluate(()=>window.tones>0));assert.deepEqual(errors,[]);
 console.log('Both languages passed. Native Web Audio oscillator playback started.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
