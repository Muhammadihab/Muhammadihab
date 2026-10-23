W=1080;H=1350;N=6
ICON={
'user':'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
'chart':'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
'calc':'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2"/>',
'box':'<path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/>',
'crm':'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M17 4a3.5 3.5 0 0 1 0 7M19 14c2 .8 3 2.8 3 6"/>',
'bill':'<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
'hr':'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>',
'eta':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/>',
'phone':'<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
'bank':'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
'ai':'<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
'globe':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
'pie':'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 2.5A9 9 0 0 1 21.5 9H15z"/>',
'lock':'<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
'wa':'<path d="M3 21l1.6-5A9 9 0 1 1 8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z"/>',
}
def ic(n,s=34,c='#fff',w=2): return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">{ICON[n]}</svg>'

def toggle(on,heavy=False):
    col='#F56A39' if heavy else '#2FD584'
    if on: return f'<div class="tg on" style="background:{col};box-shadow:0 0 18px {col}88"><i></i></div>'
    return '<div class="tg"><i></i></div>'

def row(icon,title,sub,on=True,heavy=False,badge='',off_strike=False,locked=False):
    cls='row'+(' off' if not on else '')+(' strike' if off_strike else '')+(' heavy' if heavy and on else '')+(' locked' if locked else '')
    b=f'<span class="badge {"hb" if heavy else ""}">{badge}</span>' if badge else ''
    ic_col = '#F56A39' if heavy and on else ('#00CCF2' if on else '#4E6A90')
    right = '<div class="lk">'+ic('lock',26,'#2FD584',2.4)+'<span>دايمًا شغّال</span></div>' if locked else toggle(on,heavy)
    return f'<div class="{cls}"><div class="ri" style="border-color:{ic_col}55;box-shadow:0 0 20px {ic_col}33">{ic(icon,34,ic_col)}</div><div class="rt"><b>{title}{b}</b><span>{sub}</span></div>{right}</div>'

def meter(pct,ghost=None,q=False):
    g=f'<div class="ghost" style="width:{ghost}%"></div>' if ghost else ''
    mark = '<div class="qm">؟</div>' if q else f'<div class="knob" style="right:calc({pct}% - 14px)"></div>'
    return f'''<div class="meter"><div class="ml"><span>تكلفة النظام</span><span class="mono">{"--" if q else f"{pct:02d}%"}</span></div>
<div class="track">{g}<div class="fill" style="width:{0 if q else pct}%"></div>{mark}</div>
<div class="ends"><span>بسيط</span><span>تقيل</span></div></div>'''

def gauge(pct,center,size=300):
    import math
    r=size/2-22; c=size/2
    def pt(a): return c+r*math.cos(math.radians(a)), c+r*math.sin(math.radians(a))
    a0,a1=135,405; aend=a0+(a1-a0)*pct/100
    x0,y0=pt(a0);x1,y1=pt(a1);xe,ye=pt(aend)
    big=1 if (aend-a0)>180 else 0
    ticks=''.join(f'<line x1="{c+(r-30)*math.cos(math.radians(a0+i*27))}" y1="{c+(r-30)*math.sin(math.radians(a0+i*27))}" x2="{c+(r-18)*math.cos(math.radians(a0+i*27))}" y2="{c+(r-18)*math.sin(math.radians(a0+i*27))}" stroke="#4E6A90" stroke-width="3" stroke-linecap="round"/>' for i in range(11))
    arc=f'<path d="M{x0} {y0} A{r} {r} 0 {big} 1 {xe} {ye}" stroke="url(#gg)" stroke-width="18" fill="none" stroke-linecap="round" filter="url(#gl)"/>' if pct>0 else ''
    return f'''<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#00CCF2"/><stop offset=".6" stop-color="#2FD584"/><stop offset="1" stop-color="#F56A39"/></linearGradient><filter id="gl"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<path d="M{x0} {y0} A{r} {r} 0 1 1 {x1} {y1}" stroke="#13304F" stroke-width="18" fill="none" stroke-linecap="round"/>{ticks}{arc}
<text x="{c}" y="{c+24}" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="{size*0.3}" fill="#fff">{center}</text></svg>'''


def hero(pct,delta=None,ghost=None,q=False,hot=False,size=300):
    import math
    r=size/2-26; c=size/2
    def pt(a,rr=r): return c+rr*math.cos(math.radians(a)), c+rr*math.sin(math.radians(a))
    a0,a1=135,405
    def arc(p0,p1,stroke,w,extra=''):
        s=a0+(a1-a0)*p0/100; e=a0+(a1-a0)*p1/100
        x0,y0=pt(s);x1,y1=pt(e); big=1 if e-s>180 else 0
        return f'<path d="M{x0:.1f} {y0:.1f} A{r} {r} 0 {big} 1 {x1:.1f} {y1:.1f}" stroke="{stroke}" stroke-width="{w}" fill="none" stroke-linecap="round" {extra}/>'
    ticks=''
    for i in range(41):
        a=a0+i*(270/40); L=16 if i%10==0 else 8
        x0,y0=pt(a,r-24);x1,y1=pt(a,r-24-L)
        ticks+=f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{'#6F84A3' if i%10==0 else '#2B4A72'}" stroke-width="{3 if i%10==0 else 2}" stroke-linecap="round"/>'
    body=arc(0,100,'#10284A',22)
    if ghost: body+=arc(pct,ghost,'url(#hatch)',22)
    if pct>0 and not q: body+=arc(0,pct,'url(#hg)',22,'filter="url(#hgl)"')
    na=a0+(a1-a0)*(pct/100 if not q else .5)
    nx,ny=pt(na,r-50)
    needle='' if q else f'<line x1="{c}" y1="{c}" x2="{nx:.1f}" y2="{ny:.1f}" stroke="#fff" stroke-width="5" stroke-linecap="round" filter="url(#hgl)"/><circle cx="{c}" cy="{c}" r="13" fill="#071A33" stroke="#fff" stroke-width="4"/>'
    center = f'<text x="{c}" y="{c+size*0.13}" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="{size*0.36}" fill="#00CCF2" filter="url(#hgl)">؟</text>' if q else f'<text x="{c}" y="{c+r*0.62}" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="{size*0.13}" fill="{'#F56A39' if hot else '#fff'}">{pct}%</text>'
    svg=f'''<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}"><defs><linearGradient id="hg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="{size}" y2="0"><stop offset="0" stop-color="#00CCF2"/><stop offset=".55" stop-color="#2FD584"/><stop offset="1" stop-color="#F56A39"/></linearGradient>
<pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="rgba(245,106,57,.15)"/><rect width="4" height="10" fill="rgba(245,106,57,.7)"/></pattern>
<filter id="hgl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<circle cx="{c}" cy="{c}" r="{r+20}" fill="rgba(8,24,48,.55)" stroke="rgba(160,210,255,.12)"/>{body}{ticks}{needle}{center}</svg>'''
    d=''
    if delta: d=f'<div class="delta {'hot' if hot else ''}">{delta}</div>'
    return f'<div class="hero"><div class="glowring {'hot' if hot else ''}"></div>{svg}<div class="hl">تكلفة النظام</div>{d}</div>'

def stepper(active):
    names=['الأساس','الموديولات','الإضافات','التنضيف','الحساب']
    out='<div class="stepper">'
    for i,n in enumerate(names):
        st='done' if active is not None and i<active else ('act' if i==active else '')
        out+=f'<div class="st {st}"><i>{'✓' if st=='done' else i+1}</i><span>{n}</span></div>'
        if i<4: out+=f'<div class="sl {'done' if active is not None and i<active else ''}"></div>'
    return out+'</div>'

pages=[]
# 1 cover
pages.append(dict(top='<div class="tag">لصاحب الفكرة</div>',
 head='<h1 class="cover">النظام بيتكلف<br>كام <span class="br">{</span>بجد<span class="br">}</span>؟</h1><p>السعر مش رقم ثابت. ده مجموع اختيارات،<br>تعالى نركّبه سوا.</p>',
 body=f'''<div class="panel tilt" style="top:625px;height:440px">
 <div class="ph"><span class="dots"><i></i><i></i><i></i></span><b>ركّب نظامك</b><span class="mono pill">CRM · ERP</span></div>
 <div class="cov"><div class="gwrap">{gauge(0,'؟',300)}<div class="gcap">عدّاد التكلفة</div></div>
 <div class="mini">{row('crm','العملاء والمتابعات','CRM',False)}{row('box','المخازن','ERP',False)}{row('bill','الفواتير والحسابات','ERP',False)}</div></div></div>''',
 meter=stepper(None), swipe=True))
# 2 roles
roles=[('مدير','user','كل حاجة'),('مبيعات','crm','العملاء'),('محاسب','calc','الفلوس'),('مخازن','box','البضاعة')]
rc=''.join(f'<div class="role"><div class="av">{ic(i,44,"#00CCF2")}</div><b>{n}</b><span>{s}</span><div class="chk">✓</div></div>' for n,i,s in roles)
pages.append(dict(top='<div class="pg mono">02 / 06</div>',
 head='<div class="step">١ · الأساس</div><h1>مين هيستخدم<br>النظام؟</h1><p>كل نوع موظف ليه شاشاته وصلاحياته.<br>كل ما الأنواع تزيد، الشغل بيزيد.</p>',
 body=f'<div class="panel" style="top:620px;height:400px"><div class="ph"><span class="dots"><i></i><i></i><i></i></span><b>أنواع المستخدمين</b><span class="mono pill">4 ROLES</span></div><div class="roles">{rc}</div></div>',
 meter=hero(25,'<bdi dir=ltr>+25%</bdi>')+stepper(0)))
# 3 modules
pages.append(dict(top='<div class="pg mono">03 / 06</div>',
 head='<div class="step">٢ · الموديولات</div><h1>كل موديول<br>= شغل زيادة.</h1>',
 body=f'<div class="panel" style="top:532px;height:548px"><div class="ph"><span class="dots"><i></i><i></i><i></i></span><b>الموديولات</b><span class="mono pill">3 / 4</span></div><div class="list">{row("crm","العملاء والمتابعات","CRM · مين اشترى ومين محتاج مكالمة")}{row("box","المخازن","ERP · الداخل والخارج والناقص")}{row("bill","الفواتير والحسابات","ERP · فواتير ومصروفات وأرباح")}{row("hr","الموظفين والمرتبات","HR · ممكن يستنى",False)}</div></div>',
 meter=hero(50,'<bdi dir=ltr>+25%</bdi>')+stepper(1)))
# 4 heavy
pages.append(dict(top='<div class="pg mono">04 / 06</div>',
 head='<div class="step hot">٣ · الإضافات التقيلة</div><h1>دي اللي بتعلّي<br>الحساب <span class="hotw">بجد</span>.</h1><p>أي ربط مع نظام برّه، شغله أكبر من شاشة جديدة.</p>',
 body=f'<div class="panel" style="top:580px;height:480px"><div class="ph"><span class="dots"><i></i><i></i><i></i></span><b>إضافات</b><span class="mono pill hotp">HEAVY</span></div><div class="list">{row("eta","ربط الفاتورة الإلكترونية","مع منظومة الضرايب",True,True,"تقيل")}{row("phone","تطبيق موبايل للمناديب","أوردرات وزيارات من الشارع",True,True,"تقيل")}{row("bank","ربط مع البنك والدفع","تحصيل أونلاين",True,True,"تقيل")}</div></div>',
 meter=hero(85,'تقيل <bdi dir=ltr>+35%</bdi>',hot=True)+stepper(2)))
# 5 remove
pages.append(dict(top='<div class="pg mono">05 / 06</div>',
 head='<div class="step">٤ · شيل اللي مش محتاجه</div><h1>صغّر النظام،<br><span class="br">{</span>متصغّرش<span class="br">}</span> الأمان.</h1><p>أول نسخة تشتغل بيها، والباقي يتزوّد بعدين.</p>',
 body=f'<div class="panel" style="top:580px;height:480px"><div class="ph"><span class="dots"><i></i><i></i><i></i></span><b>أول نسخة</b><span class="mono pill">MVP</span></div><div class="list">{row("ai","مساعد ذكاء اصطناعي","بعدين",False,off_strike=True)}{row("pie","داشبورد بـ50 رسمة","5 كفاية",False,off_strike=True)}{row("lock","الأمان والصلاحيات","ده مايتشالش",True,locked=True)}</div></div>'
  +'''<svg class="ann" style="position:absolute;left:0;top:0;z-index:5" width="1080" height="1350"><g fill="none" stroke="#F56A39" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))"><path d="M250 520 C 320 505, 350 430, 336 356"/><path d="M318 374 L336 350 L356 372"/></g></svg><div class="note" style="left:28px;top:498px">وفّرت هنا</div>''',
 meter=hero(55,'وفّرت <bdi dir=ltr>−30%</bdi>',ghost=85)+stepper(3)))
# 6 CTA
pages.append(dict(top='<div class="pg mono">06 / 06</div>',
 head='<h1>عدّادك<br>بيقف فين؟</h1><p>ابعتلنا فكرتك في سطرين،<br>ونقولك النظام هيحتاج إيه وهيتكلف كام.</p>',
 body=f'''<div class="cta"><div class="bub"><div class="bh">{ic('wa',24,'#2FD584')}<span>فكرتك في سطرين</span></div><p>عندي شركة توزيع، وعاوز أتابع المناديب والمخزن والفواتير من مكان واحد.<i class="cur"></i></p><span class="tm mono">10:24 ✓✓</span></div><div class="wa">{ic('wa',44,'#04101F',2.2)}<span>ابعت فكرتك على الواتساب</span></div><div class="site mono">logika-eg.pages.dev</div></div>
 ''',
 meter=hero(0,q=True)+stepper(4)))

css=open('style.css').read()
html=f'<!doctype html><html dir="rtl"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Aref+Ruqaa:wght@700&family=JetBrains+Mono:wght@500;700&family=Inter:wght@500&display=block" rel="stylesheet"><style>{css}</style></head><body><div class="pano">'
# panorama background layers
html+='<div class="blob" style="left:-200px;top:-200px;background:#00CCF2"></div><div class="blob" style="left:880px;top:900px;background:#2FD584"></div><div class="blob" style="left:2000px;top:-150px;background:#0B6BCB"></div><div class="blob" style="left:3060px;top:850px;background:#F56A39;opacity:.22"></div><div class="blob" style="left:4200px;top:-200px;background:#00CCF2"></div><div class="blob" style="left:5300px;top:800px;background:#2FD584"></div>'
html+='<div class="dotgrid"></div><div class="floor"></div>'
# circuit line across panorama
import random
pts=[]
html+=f'<svg class="wire" width="{W*N}" height="{H}"><defs><linearGradient id="wg" x1="0" x2="1"><stop offset="0" stop-color="#00CCF2"/><stop offset=".55" stop-color="#2FD584"/><stop offset=".7" stop-color="#F56A39"/><stop offset="1" stop-color="#00CCF2"/></linearGradient></defs>'
d=f'M0 1105 '
for p in range(N):
    x=p*W
    d+=f'L{x+40} 1105 L{x+70} 1090 L{x+1010} 1090 L{x+1040} 1105 L{x+1080} 1105 '
html+=f'<path d="{d}" stroke="url(#wg)" stroke-width="2.5" fill="none" opacity=".55"/>'
for p in range(N):
    html+=f'<circle cx="{p*W+1080}" cy="1105" r="7" fill="#081830" stroke="#00CCF2" stroke-width="3"/>'
html+='</svg>'
for i,pg in enumerate(pages):
    html+=f'<section class="page" style="left:{i*W}px">'
    html+='<img class="logo" src="logo-white.png">'+pg['top']
    html+=f'<div class="head">{pg["head"]}</div>{pg["body"]}{pg["meter"]}'
    if pg.get('swipe'): html+='<div class="swipe">اسحب <span>←</span></div>'
    html+='<div class="px" style="left:96px;top:420px"></div><div class="px s" style="left:74px;top:396px"></div><div class="px s" style="left:120px;top:448px;background:#F56A39;width:8px;height:8px"></div>' if i==0 else ''
    html+='</section>'
html+='<div class="grain"></div></div></body></html>'
open('p8.html','w').write(html)
