import sys
sq = sys.argv[1]=='sq'
H = 1080 if sq else 1350
scrTop, scrH = (150, 600) if sq else (170, 720)
sc = scrH/720
headTop = scrTop+scrH+(78 if sq else 92)
head = 'باسورد لوحتك اتخمّن في <em>3</em> محاولات<span class="d">.</span>' if sq else 'باسورد لوحتك اتخمّن<br>في <em>3</em> محاولات<span class="d">.</span>'
html=f'''<!doctype html><html dir="rtl"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Aref+Ruqaa:wght@700&family=JetBrains+Mono:wght@800&family=Inter:wght@500&family=Press+Start+2P&display=block" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body,.c{{width:1080px;height:{H}px;overflow:hidden;background:#050F1F}}
.c{{position:relative;font-family:'IBM Plex Sans Arabic'}}
.amb{{position:absolute;left:0;right:0;top:{scrTop-80}px;height:{scrH+160}px;background:radial-gradient(ellipse at center,rgba(0,204,242,.18),rgba(0,204,242,0) 65%)}}
.logo{{position:absolute;left:44px;top:{18 if sq else 20}px;width:{140 if sq else 170}px}}
.tag{{position:absolute;right:52px;top:{38 if sq else 50}px;border:2px solid #00CCF2;border-radius:40px;padding:6px 28px 10px;color:#00CCF2;font-weight:700;font-size:28px}}
.cab{{position:absolute;left:46px;right:46px;top:{scrTop-16}px;height:{scrH+64}px;border-radius:48px;background:linear-gradient(180deg,#0F2B50,#0A1F3C);box-shadow:0 30px 80px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08),0 0 60px rgba(0,204,242,.15)}}
.cab .brand{{position:absolute;left:34px;bottom:14px;font-family:'Press Start 2P';font-size:14px;color:#4E6A90;direction:ltr;letter-spacing:2px}}
.cab .led{{position:absolute;right:38px;bottom:18px;width:12px;height:12px;border-radius:50%;background:#F56A39;box-shadow:0 0 12px #F56A39}}
.scr{{position:absolute;left:62px;right:62px;top:{scrTop}px;height:{scrH}px;border-radius:36px;overflow:hidden;
 background:radial-gradient(ellipse 80% 75% at center,#103462 0%,#0A2448 50%,#04101F 100%);box-shadow:inset 0 0 90px rgba(0,0,0,.85),inset 0 0 0 2px #061428}}
.in{{position:absolute;left:0;top:0;width:956px;height:720px;transform-origin:top center;transform:scale({sc});{'left:0;' }}}
.px{{font-family:'Press Start 2P';direction:ltr}}
.hud{{position:absolute;top:34px;left:54px;right:54px;display:flex;justify-content:space-between;align-items:center;font-size:20px;color:#7FD8F0}}
.inf{{font-family:'JetBrains Mono';font-weight:800;font-size:38px;line-height:0;color:#F56A39;text-shadow:0 0 12px rgba(245,106,57,.8)}}
.hl{{color:#F56A39}}
.card{{position:absolute;left:178px;width:600px;top:84px;padding:18px 26px 22px;background:rgba(4,16,31,.78);border:3px solid #3E6FA3;border-radius:8px;box-shadow:6px 6px 0 #03101F,0 0 40px rgba(0,204,242,.12)}}
.ch{{display:flex;justify-content:space-between;align-items:center;border-bottom:2px dashed rgba(127,216,240,.25);padding-bottom:12px;margin-bottom:12px}}
.ch b{{color:#fff;font-size:30px;font-weight:700}}
.ch .px{{font-size:12px;color:#00CCF2}}
.lab{{color:#9FB3CC;font-size:20px;margin:6px 0 6px}}
.fld{{height:56px;border:3px solid #2C4F7A;border-radius:6px;background:#06152A;display:flex;align-items:center;padding:0 18px;font-size:22px;color:#C6D5EA}}
.fld.pw{{border-color:#3FE08E;box-shadow:0 0 18px rgba(63,224,142,.5);color:#3FE08E;text-shadow:0 0 8px rgba(63,224,142,.8)}}
.cur{{display:inline-block;width:14px;height:24px;background:#3FE08E;margin-left:6px;box-shadow:0 0 8px #3FE08E}}
.btn{{margin-top:16px;height:54px;border-radius:6px;background:#2FD584;box-shadow:0 5px 0 #178A55;color:#04101F;font-weight:700;font-size:26px;display:grid;place-items:center}}
.stamp{{position:absolute;left:640px;top:376px;transform:rotate(-9deg);font-size:22px !important;border:5px solid #3FE08E;color:#3FE08E;background:rgba(4,22,20,.9);font-size:26px;padding:14px 18px;line-height:1.4;text-align:center;box-shadow:0 0 30px rgba(63,224,142,.55);text-shadow:-2px 0 rgba(245,106,57,.5),2px 0 rgba(0,204,242,.5),0 0 12px rgba(63,224,142,.8)}}
.log{{position:absolute;top:486px;left:70px;right:70px;display:flex;flex-direction:column;gap:10px;font-size:21px;color:#6F84A3}}
.log div{{display:flex;justify-content:space-between;padding:14px 18px}}
.log .w span:last-child{{color:#F56A39}}
.log .ok{{color:#fff;background:rgba(63,224,142,.16);box-shadow:inset 4px 0 0 #3FE08E;text-shadow:0 0 10px rgba(63,224,142,.9)}}
.log .ok span:last-child{{color:#3FE08E}}
.log .dim{{color:#4E6A90}}
.scan{{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.045) 0 2px,transparent 2px 5px)}}
.glare{{position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.09) 0%,rgba(255,255,255,.02) 28%,rgba(255,255,255,0) 40%)}}
.vig{{position:absolute;inset:0;border-radius:36px;box-shadow:inset 0 0 140px rgba(0,0,0,.55)}}
.p{{position:absolute;background:#F56A39}}
.note{{position:absolute;font-family:'Aref Ruqaa';font-weight:700;color:#F56A39;font-size:44px;white-space:nowrap;transform:rotate(-4deg);text-shadow:0 2px 10px rgba(0,0,0,.8)}}
.h{{position:absolute;right:52px;left:52px;top:{headTop}px;color:#fff;font-weight:700;font-size:{56 if sq else 72}px;line-height:1.22}}
.h em{{font-style:normal;font-family:'Press Start 2P';font-size:{42 if sq else 54}px;color:#3FE08E;margin:0 12px;text-shadow:0 0 16px rgba(63,224,142,.75),4px 4px 0 #0B5A3A}}
.h .d{{color:#F56A39}}
.sub{{position:absolute;right:52px;top:{headTop+(84 if sq else 186)}px;color:#C6D5EA;font-size:{26 if sq else 30}px}}
.foot{{position:absolute;left:52px;right:52px;top:{H-90}px;border-top:1px solid rgba(198,213,234,.18);padding-top:18px;display:flex;justify-content:space-between;font-size:24px;color:#9FB3CC}}
.foot b{{color:#00CCF2;font-weight:700}}.foot .u{{font-family:Inter;direction:ltr}}
.grain{{position:absolute;inset:0;opacity:.1;mix-blend-mode:overlay;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}}
</style></head><body><div class="c">
<div class="amb"></div>
<img class="logo" src="logo-white.png"><div class="tag">خلّي بالك</div>
<div class="cab"><div class="brand">LOGIKA ARCADE</div><div class="led"></div></div>
<div class="scr"><div class="in">
 <div class="px hud"><span>LIVES <span class="inf">∞</span></span><span>TRIES <span class="hl">03</span></span></div>
 <div class="card">
  <div class="ch"><b>دخول لوحة التحكم</b><span class="px">ADMIN PANEL</span></div>
  <div class="lab">اسم المستخدم</div><div class="fld px">admin</div>
  <div class="lab">كلمة السر</div><div class="fld pw px">admin123<span class="cur"></span></div>
  <div class="btn">دخول</div>
 </div>
 <div class="stamp px">ACCESS<br>GRANTED</div>
 <div class="p" style="left:110px;top:150px;width:16px;height:16px"></div>
 <div class="p" style="left:90px;top:126px;width:10px;height:10px;background:#00CCF2"></div>
 <div class="p" style="right:90px;top:200px;width:14px;height:14px"></div>
 <div class="p" style="right:70px;top:174px;width:9px;height:9px;background:#00CCF2"></div>
 <div class="px log">
  <div class="w"><span>&gt; TRY 1: PASSWORD</span><span>WRONG</span></div>
  <div class="w"><span>&gt; TRY 2: 12345678</span><span>WRONG</span></div>
  <div class="ok"><span>&gt; TRY 3: ADMIN123</span><span>OK</span></div>
 </div>
 <svg style="position:absolute;left:0;top:0" width="956" height="720"><g fill="none" stroke="#F56A39" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.7))"><path d="M96 690 C 56 670, 46 640, 60 612"/><path d="M40 628 L60 606 L82 626"/></g></svg>
 <div class="note" style="left:108px;top:650px">تالت محاولة… ودخل</div>
</div><div class="scan"></div><div class="glare"></div><div class="vig"></div></div>
<div class="h">{head}</div>
<div class="sub">أي حد بيجرّب يدخل لوحتك، بيبدأ بالباسوردات السهلة دي.</div>
<div class="foot"><span>كلّمنا على <b>الواتساب</b></span><span class="u">logika-eg.pages.dev</span></div>
<div class="grain"></div></div></body></html>'''
open(sys.argv[2],'w').write(html)
