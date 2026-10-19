/* =====================================================================
   مكتبة لوجيكا · عناصر «برو»: 3D حقيقي بإضاءة وانعكاسات وتوهّج وموشن بلور.
   كل فريم بيترسم كذا مرة في لحظات قريبة من بعض ويتدمج (موشن بلور زي الكاميرا).
   pro.html?id=pro-01&mb=8   ->   window.renderAt(t), window.META
   ===================================================================== */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1080, H = 1920, FPS = 30;
const C = { navy: 0x0A2444, cyan: 0x00CCF2, cyan2: 0x3FD6F5 };
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), P = (t, a, b) => cl((t - a) / (b - a)), L = (a, b, x) => a + (b - a) * x;
const eo = x => 1 - Math.pow(1 - x, 3), eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, ei = x => x * x * x;
const spring = (x, k = 9) => x <= 0 ? 0 : 1 - Math.exp(-k * x) * Math.cos(k * 1.3 * x);
const rnd = n => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
const AR = '"IBM Plex Sans Arabic",PlexL,sans-serif', NUM = 'Sora,SoraL,PlexL,sans-serif';

const q = new URLSearchParams(location.search), ID = q.get('id') || 'pro-01', K = Math.max(1, +(q.get('mb') || 8));
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.setClearColor(0x000000, 0);
const out = document.getElementById('out').getContext('2d'), ov = document.getElementById('ov');
const env = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), .04).texture;

/* ---------- shared pieces ---------- */
function canvasTex(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return { c, x: c.getContext('2d'), t }; }
function studioBg() { const { c, x, t } = canvasTex(540, 960), g = x.createRadialGradient(270, 400, 40, 270, 480, 700);
  g.addColorStop(0, '#16467C'); g.addColorStop(.45, '#0B2A4E'); g.addColorStop(1, '#030A16'); x.fillStyle = g; x.fillRect(0, 0, 540, 960); return t; }
function rrShape(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0); s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI); s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5); return s; }
function flatRR(w, h, r) { const g = new THREE.ShapeGeometry(rrShape(w, h, r), 24), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + .5, p.getY(i) / h + .5); return g; }
function rrBox(w, h, d, r, bev = .012) { const g = new THREE.ExtrudeGeometry(rrShape(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 6, curveSegments: 24 }); g.center(); return g; }
// the Logika brace as a 3D tube (same curve as the brand book), 1 unit tall, centred
function braceCurve() { const s = 1 / 640, v = (x, y) => new THREE.Vector3((x - 92) * s, (320 - y) * s, 0), p = new THREE.CurvePath();
  const C3 = (a, b, c, d) => p.add(new THREE.CubicBezierCurve3(v(...a), v(...b), v(...c), v(...d))), L3 = (a, b) => p.add(new THREE.LineCurve3(v(...a), v(...b)));
  C3([150, 0], [96, 0], [80, 24], [80, 80]); L3([80, 80], [80, 240]); C3([80, 240], [80, 290], [64, 312], [34, 320]); C3([34, 320], [64, 328], [80, 350], [80, 400]); L3([80, 400], [80, 560]); C3([80, 560], [80, 616], [96, 640], [150, 640]); return p; }
const braceGeo = r => new THREE.TubeGeometry(braceCurve(), 260, r, 20, false);
const capGeo = r => new THREE.SphereGeometry(r, 20, 12);
function brace(r, mat) { const g = new THREE.Group(), m = new THREE.Mesh(braceGeo(r), mat); g.add(m); const c = braceCurve();
  [0, 1].forEach(e => { const s = new THREE.Mesh(capGeo(r), mat); s.position.copy(c.getPoint(e)); g.add(s); }); return g; }
const neon = (i = 1) => new THREE.MeshPhysicalMaterial({ color: C.cyan2, emissive: C.cyan, emissiveIntensity: i, metalness: .1, roughness: .12, clearcoat: 1, envMapIntensity: 1.2 });
function sprite() { const { c, x } = canvasTex(64, 64), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.3, 'rgba(160,240,255,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); }
function dust(n, spread, z0, z1) { const g = new THREE.BufferGeometry(), a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = (rnd(i) - .5) * spread; a[i * 3 + 1] = (rnd(i * 2) - .5) * spread * 1.8; a[i * 3 + 2] = L(z0, z1, rnd(i * 3)); }
  g.setAttribute('position', new THREE.BufferAttribute(a, 3)); const m = new THREE.PointsMaterial({ map: sprite(), size: .05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0x7FE6FF, opacity: .8 });
  const pts = new THREE.Points(g, m); pts.userData.base = a.slice(); return pts; }
function driftDust(pts, t) { const a = pts.geometry.attributes.position.array, b = pts.userData.base; for (let i = 0; i < a.length; i += 3) { a[i] = b[i] + Math.sin(t * .5 + i) * .05; a[i + 1] = b[i + 1] + t * .06 * (1 + rnd(i) ); } pts.geometry.attributes.position.needsUpdate = true; }
// final look: chromatic edges, vignette, fine grain
const Finish = { uniforms: { tDiffuse: { value: null }, seed: { value: 0 }, ca: { value: .006 } }, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `uniform sampler2D tDiffuse;uniform float seed,ca;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+seed)*43758.5453);}
  void main(){vec2 c=vUv-.5;float d=length(c*vec2(.5625,1.));vec2 o=c*ca*d*2.;vec4 col=texture2D(tDiffuse,vUv);col.r=texture2D(tDiffuse,vUv+o).r;col.b=texture2D(tDiffuse,vUv-o).b;
  col.rgb*=1.-smoothstep(.25,.75,d)*.5;col.rgb+=(h(vUv*vec2(1080.,1920.))-.5)*.04;gl_FragColor=vec4(col.rgb,1.);}` };
function look(scene, camera, bloom = [.7, .55, .82]) { const c = new EffectComposer(renderer); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(scene, camera));
  const b = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), ...bloom); c.addPass(b); c.addPass(new OutputPass()); const f = new ShaderPass(Finish); c.addPass(f); return { c, b, f }; }
function overlayText(html, css) { const d = document.createElement('div'); d.style.cssText = 'position:absolute;left:0;right:0;text-align:center;' + css; d.innerHTML = html; ov.appendChild(d); return d; }

/* ---------- pro-01 · موبايل 3D ---------- */
function pro01() {
  const scene = new THREE.Scene(); scene.background = studioBg(); scene.environment = env;
  const cam = new THREE.PerspectiveCamera(30, W / H, .1, 100);
  scene.add(new THREE.HemisphereLight(0xBFE9FF, 0x0A2444, .5)); const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(C.cyan2, 3.5); rim.position.set(-3, 1, -2); scene.add(rim); const rim2 = new THREE.DirectionalLight(0x7FB8FF, 2); rim2.position.set(3, -1, -2); scene.add(rim2);
  const phone = new THREE.Group(); scene.add(phone);
  const frame = new THREE.MeshPhysicalMaterial({ color: 0x2B3546, metalness: 1, roughness: .26, envMapIntensity: 1.4, clearcoat: .6 });
  phone.add(new THREE.Mesh(rrBox(.74, 1.54, .05, .11, .015), frame));
  const back = new THREE.Mesh(flatRR(.72, 1.52, .1), new THREE.MeshPhysicalMaterial({ color: 0x0E1A2B, metalness: .3, roughness: .35, clearcoat: 1, clearcoatRoughness: .1 })); back.position.z = -.0405; back.rotation.y = Math.PI; phone.add(back);
  const camBump = new THREE.Mesh(rrBox(.24, .24, .02, .06, .008), frame); camBump.position.set(.19, .55, -.055); phone.add(camBump);
  [[.09, .62], [-.03, .62], [.09, .5]].forEach(([x, y]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .02, 32), new THREE.MeshPhysicalMaterial({ color: 0x05080D, metalness: .5, roughness: .05, clearcoat: 1 })); l.rotation.x = Math.PI / 2; l.position.set(x + .1, y - .02, -.07); phone.add(l); });
  const S = canvasTex(700, 1500), screen = new THREE.Mesh(flatRR(.70, 1.50, .09), new THREE.MeshBasicMaterial({ map: S.t, color: 0xC4CCD6, toneMapped: false })); screen.position.z = .0405; phone.add(screen);
  const notch = new THREE.Mesh(flatRR(.2, .055, .027), new THREE.MeshBasicMaterial({ color: 0x000000 })); notch.position.set(0, .69, .0412); phone.add(notch);
  const shT = canvasTex(256, 512); { const g = shT.x.createLinearGradient(0, 0, 256, 512); g.addColorStop(.35, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.55)'); g.addColorStop(.65, 'rgba(255,255,255,0)'); shT.x.fillStyle = g; shT.x.fillRect(0, 0, 256, 512); }
  shT.t.wrapS = THREE.ClampToEdgeWrapping; const sheen = new THREE.Mesh(flatRR(.70, 1.50, .09), new THREE.MeshBasicMaterial({ map: shT.t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); sheen.position.z = .0415; phone.add(sheen);
  // pop-out notification that leaves the screen toward the viewer
  const N = canvasTex(620, 200), card = new THREE.Mesh(flatRR(.62, .2, .045), new THREE.MeshBasicMaterial({ map: N.t, color: 0xD2D8E0, transparent: true, toneMapped: false })); phone.add(card);
  { const x = N.x; x.fillStyle = '#FFFFFF'; x.beginPath(); x.roundRect(0, 0, 620, 200, 44); x.fill(); x.strokeStyle = '#00CCF2'; x.lineWidth = 6; x.beginPath(); x.roundRect(3, 3, 614, 194, 42); x.stroke();
    x.fillStyle = '#0A2444'; x.beginPath(); x.roundRect(472, 40, 120, 120, 30); x.fill(); x.fillStyle = '#3FD6F5'; x.font = `700 58px ${NUM}`; x.textAlign = 'center'; x.fillText('{ }', 532, 120);
    x.direction = 'rtl'; x.textAlign = 'right'; x.fillStyle = '#0A2444'; x.font = `700 44px ${AR}`; x.fillText('عميل جديد', 448, 88); x.fillStyle = '#5A6F8C'; x.font = `400 34px ${AR}`; x.fillText('سارة ع. سألت على شقة ٣ أوض', 448, 145); N.t.needsUpdate = true; }
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .5), new THREE.MeshBasicMaterial({ map: (() => { const { c, x } = canvasTex(256, 64), g = x.createRadialGradient(128, 32, 0, 128, 32, 128); g.addColorStop(0, 'rgba(0,0,0,.7)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 64); return new THREE.CanvasTexture(c); })(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.05; scene.add(shadow);
  const bmat = new THREE.MeshPhysicalMaterial({ color: 0x0C4E66, emissive: C.cyan, emissiveIntensity: .12, metalness: .3, roughness: .3, clearcoat: 1, envMapIntensity: .5 }), bl = brace(.035, bmat), br = brace(.035, bmat); bl.scale.setScalar(2.6); br.scale.set(-2.6, 2.6, 2.6); bl.position.set(-.95, .05, -3); br.position.set(.95, .05, -3); scene.add(bl, br);
  const pts = dust(260, 4, -3, 1); scene.add(pts);
  const rows = [['أحمد م.', 'متابعة النهارده', '#E69500'], ['سارة ع.', 'جديد', '#0090C0'], ['محمود ك.', 'عرض سعر', '#0090C0'], ['منى ر.', 'اتفقنا ✓', '#1FA34A'], ['كريم س.', 'اتفقنا ✓', '#1FA34A'], ['ياسمين ف.', 'متابعة بكره', '#E69500'], ['عمر ح.', 'جديد', '#0090C0']];
  function drawScreen(t) { const x = S.x; x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#F4F7FB'; x.fillRect(0, 0, 700, 1500); x.fillStyle = '#0A2444'; x.fillRect(0, 0, 700, 300);
    x.fillStyle = '#fff'; x.font = `600 30px ${NUM}`; x.textAlign = 'left'; x.fillText('9:41', 60, 64); x.direction = 'rtl'; x.textAlign = 'right'; x.font = `700 62px ${AR}`; x.fillText('العملاء', 640, 200);
    x.fillStyle = 'rgba(255,255,255,.65)'; x.font = `400 32px ${AR}`; x.fillText('كل عميل في مكانه', 640, 255); x.textAlign = 'left'; x.direction = 'ltr'; x.fillStyle = '#3FD6F5'; x.font = `700 64px ${NUM}`; x.fillText(String(Math.round(24 * eo(P(t, .9, 1.8)))), 60, 205);
    rows.forEach(([n, s, c], i) => { const a = P(t, .95 + i * .1, 1.35 + i * .1), y = 330 + i * 160; if (a <= 0) return; x.save(); x.globalAlpha = a; x.translate((1 - eo(a)) * 120, 0);
      const hot = i === 1 && t > 2.35; x.fillStyle = hot ? `rgba(0,204,242,${.18 + .1 * Math.sin(t * 6)})` : '#FFFFFF'; x.beginPath(); x.roundRect(24, y, 652, 140, 28); x.fill();
      x.fillStyle = '#DDE8F3'; x.beginPath(); x.arc(600, y + 70, 42, 0, 7); x.fill(); x.fillStyle = '#0A2444'; x.font = `700 38px ${AR}`; x.textAlign = 'center'; x.direction = 'rtl'; x.fillText(n[0], 600, y + 84);
      x.textAlign = 'right'; x.font = `700 38px ${AR}`; x.fillText(n, 532, y + 82); x.font = `600 28px ${AR}`; const w = x.measureText(s).width + 40; x.fillStyle = c + '22'; x.beginPath(); x.roundRect(52, y + 46, w, 50, 25); x.fill(); x.fillStyle = c; x.textAlign = 'center'; x.fillText(s, 52 + w / 2, y + 81); x.restore(); });
    S.t.needsUpdate = true; }
  const cap = overlayText('', `top:1700px;font:700 76px ${AR};color:#fff;text-shadow:0 6px 30px rgba(0,0,0,.6)`); const words = 'كل عملاءك في مكان واحد'.split(' ').map(w => { const s = document.createElement('span'); s.textContent = w; s.style.cssText = 'display:inline-block;margin:0 12px'; cap.appendChild(s); return s; });
  const look1 = look(scene, cam, [.5, .5, .9]);
  function update(t) { const s = eo(P(t, 0, 1.5)), k = spring(P(t, 0, 1.4), 5);
    phone.position.y = L(-2.8, 0, k) + Math.sin(t * 1.4) * .025 * P(t, 1.3, 2); phone.rotation.set(L(.55, .06, s) + Math.sin(t * .9) * .02, L(-Math.PI * 2.25, -.3, s) + Math.sin(t * .7) * .07 * P(t, 1.4, 2.4), L(-.35, .03, s));
    cam.position.set(Math.sin(t * .35) * .15, .05, L(4.7, 4.05, eio(P(t, 0, 4.5)))); cam.lookAt(0, 0, 0);
    drawScreen(t); const c = spring(P(t, 2.3, 2.95), 7); card.position.set(0, .38, L(.045, .42, c)); card.scale.setScalar(L(.55, 1, c)); card.rotation.x = L(0, -.12, c); card.material.opacity = P(t, 2.3, 2.38); card.visible = t > 2.3;
    shT.t.offset.set(L(1.2, -1.2, eio(P(t, 1.35, 2.0))) + L(1.2, -1.2, eio(P(t, 3.3, 3.9))) - (t > 2.0 ? 0 : 0), 0); sheen.material.opacity = .22 * (P(t, 1.35, 1.4) * (1 - P(t, 1.95, 2.0))) + (P(t, 3.3, 3.35) * (1 - P(t, 3.85, 3.9)));
    shadow.material.opacity = L(0, 1, k) * .8; bmat.emissiveIntensity = .12 + .06 * Math.sin(t * 2); bl.rotation.y = Math.sin(t * .6) * .3; br.rotation.y = -Math.sin(t * .6) * .3; driftDust(pts, t);
    words.forEach((w, i) => { const a = P(t, 3.0 + i * .14, 3.3 + i * .14); w.style.opacity = a; w.style.transform = `translateY(${(1 - eo(a)) * 40}px)`; w.style.filter = `blur(${(1 - a) * 10}px)`; }); }
  return { dur: 4.5, blend: 'scene', update, draw: s => { look1.f.uniforms.seed.value = s; look1.c.render(); } };
}

/* ---------- pro-02 · قفل الأقواس 3D ---------- */
function pro02() {
  const scene = new THREE.Scene(); scene.background = studioBg(); scene.environment = env;
  const cam = new THREE.PerspectiveCamera(32, W / H, .1, 100);
  scene.add(new THREE.HemisphereLight(0xBFE9FF, 0x0A2444, .4)); const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(2, 3, 4); scene.add(key); const rim = new THREE.DirectionalLight(C.cyan2, 4); rim.position.set(-2, 2, -3); scene.add(rim);
  const bm = neon(.3), bl = brace(.05, bm), br = brace(.05, bm); bl.scale.setScalar(1.45); br.scale.set(-1.45, 1.45, 1.45); scene.add(bl, br);
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xE9EEF5, metalness: 1, roughness: .18, envMapIntensity: 1.6, clearcoat: 1 });
  const lock = new THREE.Group(); scene.add(lock); lock.add(new THREE.Mesh(rrBox(.5, .4, .14, .08, .02), chrome));
  const face = new THREE.Mesh(flatRR(.44, .34, .06), new THREE.MeshPhysicalMaterial({ color: C.navy, metalness: .4, roughness: .3, clearcoat: 1 })); face.position.z = .092; lock.add(face);
  const kh = new THREE.Group(); kh.position.z = .094; lock.add(kh); const khm = new THREE.MeshBasicMaterial({ color: C.cyan2, toneMapped: false });
  kh.add(new THREE.Mesh(new THREE.CircleGeometry(.04, 32), khm)); const kr = new THREE.Mesh(new THREE.PlaneGeometry(.03, .08), khm); kr.position.y = -.05; kh.add(kr);
  const shack = new THREE.Group(); lock.add(shack); const arc = new THREE.Mesh(new THREE.TorusGeometry(.15, .042, 24, 64, Math.PI), chrome); arc.position.y = .3; shack.add(arc);
  [-.15, .15].forEach(x => { const l = new THREE.Mesh(new THREE.CylinderGeometry(.042, .042, .14, 24), chrome); l.position.set(x, .23, 0); shack.add(l); });
  const ringM = () => new THREE.MeshBasicMaterial({ color: C.cyan2, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const ring1 = new THREE.Mesh(new THREE.RingGeometry(.96, 1, 128), ringM()), ring2 = new THREE.Mesh(new THREE.RingGeometry(.97, 1, 128), ringM()); scene.add(ring1, ring2);
  const sp = (() => { const n = 160, g = new THREE.BufferGeometry(), a = new Float32Array(n * 3); g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ map: sprite(), size: .05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xAEEFFF })); })(); scene.add(sp);
  const pts = dust(200, 4, -3, .5); scene.add(pts);
  const tag = overlayText('<div class="m" style="overflow:hidden;padding:10px 0"><div class="w">متأمّن من جوّا</div></div><div class="s">L O G I K A</div>', `top:1500px;font:700 92px ${AR};color:#fff;text-shadow:0 0 40px rgba(0,204,242,.6)`);
  const tw = tag.querySelector('.w'), ts = tag.querySelector('.s'); ts.style.cssText = `font:700 34px ${NUM};color:#3FD6F5;letter-spacing:10px;margin-top:6px;direction:ltr`;
  const look2 = look(scene, cam, [.45, .5, .9]);
  function update(t) { const a = eio(P(t, 0, .55)), imp = .55, sh = t > imp ? Math.exp(-(t - imp) * 9) * .035 : 0;
    bl.position.set(L(-3.4, -.56, a), 0, 0); br.position.set(L(3.4, .56, a), 0, 0); bl.rotation.y = L(Math.PI * 4, 0, a); br.rotation.y = L(-Math.PI * 4, 0, a);
    const sq = t > imp ? Math.sin(Math.PI * P(t, imp, imp + .18)) * .06 : 0; bl.position.x += sq; br.position.x -= sq;
    const lk = spring(P(t, .8, 1.45), 7); lock.position.set(0, L(2.4, -.08, lk), 0); lock.rotation.set(L(.6, 0, lk), L(-1.2, 0, eo(P(t, .8, 1.5))) + Math.sin(t * .8) * .05 * P(t, 1.6, 2.2), 0); lock.visible = t > .78;
    const snap = 1.7; shack.position.y = t < snap ? .13 : L(.13, 0, eo(P(t, snap, snap + .07))); shack.rotation.y = t < snap ? -.5 : L(-.5, 0, eo(P(t, snap, snap + .06)));
    const pulse = Math.max(t > imp ? Math.exp(-(t - imp) * 5) : 0, t > snap ? Math.exp(-(t - snap) * 4) : 0); bm.emissiveIntensity = .3 + pulse * 1.1; look2.b.strength = .45 + pulse * .5;
    [[ring1, imp], [ring2, snap]].forEach(([r, s0]) => { const x = P(t, s0, s0 + .7); r.scale.setScalar(L(.3, 3.2, eo(x))); r.material.opacity = x > 0 && x < 1 ? (1 - x) * .55 : 0; });
    const pa = sp.geometry.attributes.position.array; for (let i = 0; i < 160; i++) { const tt = t - imp, side = i % 2 ? 1 : -1, ang = (rnd(i) - .5) * 2.6 + (side > 0 ? 0 : Math.PI), v = 1.2 + rnd(i * 3) * 2.2;
      if (tt <= 0) { pa[i * 3] = 0; pa[i * 3 + 1] = -99; continue; } const d = (1 - Math.exp(-3 * tt)) / 3; pa[i * 3] = side * .4 + Math.cos(ang) * v * d; pa[i * 3 + 1] = Math.sin(ang) * v * d - .8 * tt * tt; pa[i * 3 + 2] = (rnd(i * 5) - .5) * v * d; }
    sp.geometry.attributes.position.needsUpdate = true; sp.material.opacity = 1 - P(t, imp + .3, imp + 1.2);
    const o = eio(P(t, 0, 3.4)) * .7 - .35; cam.position.set(Math.sin(o) * 4.6 + (rnd(Math.floor(t * 60)) - .5) * sh, .15 + (rnd(Math.floor(t * 60) + 7) - .5) * sh, Math.cos(o) * L(5.0, 4.5, eio(P(t, 0, 3.4)))); cam.lookAt(0, .02, 0); driftDust(pts, t);
    const g = P(t, 2.0, 2.45); tw.style.transform = `translateY(${(1 - eo(g)) * 110}%)`; ts.style.opacity = P(t, 2.3, 2.6); ts.style.letterSpacing = L(30, 10, eo(P(t, 2.3, 2.9))) + 'px'; }
  return { dur: 3.4, blend: 'scene', update, draw: s => { look2.f.uniforms.seed.value = s; look2.c.render(); } };
}

/* ---------- pro-03 · مسحة القوس 3D (انتقال شفاف) ---------- */
function pro03() {
  const scene = new THREE.Scene(); scene.environment = env; const cam = new THREE.PerspectiveCamera(30, W / H, .1, 100); cam.position.set(0, 0, 4); cam.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xBFE9FF, 0x0A2444, .8)); const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-2, 2, 4); scene.add(key);
  const g = new THREE.Group(); scene.add(g); const bm = neon(1.6), b = brace(.07, bm); b.scale.setScalar(2.8); g.add(b);
  const wallM = new THREE.MeshPhysicalMaterial({ color: C.navy, metalness: .2, roughness: .45, clearcoat: .5, envMapIntensity: .6 });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(9, 3.4, .1), wallM); wall.position.set(.16 * 2.8 + 4.5 - .02, 0, -.04); g.add(wall);
  const edge = new THREE.Mesh(new THREE.PlaneGeometry(.5, 3.4), new THREE.MeshBasicMaterial({ map: (() => { const { c, x } = canvasTex(64, 8), gr = x.createLinearGradient(0, 0, 64, 0); gr.addColorStop(0, 'rgba(0,204,242,.8)'); gr.addColorStop(1, 'rgba(0,204,242,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 8); return new THREE.CanvasTexture(c); })(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  edge.position.set(.16 * 2.8 + .25, 0, .02); g.add(edge);
  const streaks = [...Array(26)].map((_, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, .012 + rnd(i) * .02), new THREE.MeshBasicMaterial({ color: rnd(i * 3) > .4 ? C.cyan2 : 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); scene.add(m); return m; });
  streaks.forEach((m, i) => { m.userData = { y: (rnd(i * 5) - .5) * 2.2, z: (rnd(i * 7) - .5) * .8, l: .6 + rnd(i * 9) * 1.6, d: rnd(i * 11) * .25 }; });
  function update(t) { const x = eio(P(t, 0, 1)); g.position.x = L(1.0, -10.4, x); g.rotation.y = L(.35, -.15, x); g.rotation.z = L(.04, -.02, x);
    streaks.forEach(m => { const u = m.userData, p = P(t, u.d, u.d + .6); m.scale.x = u.l; m.position.set(L(2.4, -2.4, eio(p)), u.y, u.z + .3); m.material.opacity = Math.sin(Math.PI * p) * .9; }); }
  return { dur: 1.0, blend: 'alpha', update, draw: () => renderer.render(scene, cam) };
}

const E = { 'pro-01': pro01, 'pro-02': pro02, 'pro-03': pro03 }[ID]();
window.META = { id: ID, dur: E.dur, blend: E.blend };
// one output frame = K renders spread over half a frame (a 180° shutter), averaged
window.renderAt = t => { out.clearRect(0, 0, W, H);
  for (let k = 0; k < K; k++) { const tt = Math.max(0, t + (K > 1 ? (k / (K - 1) - .5) : 0) * .5 / FPS); E.update(tt); E.draw(Math.floor(t * FPS) * .37); out.globalAlpha = 1 / (k + 1); out.drawImage(renderer.domElement, 0, 0); }
  out.globalAlpha = 1; };
document.fonts.load(`700 40px PlexL`).then(() => document.fonts.ready).then(() => { renderAt(0); window.__ready = true; });
