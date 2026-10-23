const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:6480,height:1350},deviceScaleFactor:+(process.argv[4]||1)});
await p.goto('file://'+process.argv[2],{waitUntil:'networkidle',timeout:60000});await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:process.argv[3]});await b.close();})();
