# بوست ٦ — IDOR Explainer Reel

**Format:** Vertical 9:16 · 1080×1920 · 30fps · **45s**
**Style:** Advanced UI/UX Explainer Reel
**Audience:** Web developers
**Goal:** Explain IDOR, its impact, and how to prevent it with server-side access control. Defensive and educational only.
**Voice:** Logika, Egyptian Arabic. Technical terms stay in English. Don't mention the client company name.

---

## 0. Global Style Sheet (applies to every scene)

### Glassmorphism window (every code / URL / data element)
| Property | Value |
|---|---|
| Fill | `rgba(255,255,255,0.10)` |
| Backdrop blur | 24–32px (Gaussian blur of the layers behind it) |
| Border | 1px `rgba(255,255,255,0.25)`, with a lighter top-left edge for a glass highlight |
| Corner radius | 28px for windows, 999px for badges |
| Drop shadow | `0 24px 60px rgba(0,0,0,0.35)`, soft and offset downward |
| Window chrome | 3 traffic-light dots (top-left) and a tab title in 22px mono |
| Code font | JetBrains Mono, 30–34px, syntax-highlighted |

### Floating 3D icons
Lock 🔒, Database 🛢️, Shield 🛡️, User avatar 👤, Key 🔑. Use glossy, low-poly or clay-style renders, each with a slow idle loop: ±8px Y-float over 3s and ±6° rotation. Each icon casts a soft shadow onto the background.

### Animation curves
- **Exponential scale-in:** 0% → 100% over 12 frames, ease `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out).
- **Bounce reveal:** scale 0 → 112% → 96% → 100% over 18 frames.
- **Exit:** 100% → 0% plus 20px blur over 8 frames, ease-in.
- **Cursor:** macOS-style pointer, smooth bezier path, and a 0.9× squash on each click plus a ripple ring.

### Keyword badges
- A semi-transparent pill (`rgba(20,20,30,0.55)`, 20px blur, 1px glowing border in the accent color).
- Text: 44–56px bold. Use English for technical terms and IBM Plex Sans Arabic for Arabic.
- Sync: the badge hits 100% scale **on the first syllable** of the spoken word. Pre-roll the animation 4 frames before the word.
- Position: upper third, above the face. Never overlap the speaker's eyes.

### Color palette
| Role | Color |
|---|---|
| Background | Deep navy gradient `#0B0F1F → #151B3A` + subtle grid |
| Danger / vulnerable | `#FF4D6D` (red-pink glow) |
| Secure / fixed | `#2EE59D` (mint green glow) |
| Highlight / neutral accent | `#7C5CFF` (Logika violet) |

### Progress bar (gamification)
- 6px tall, full width minus a 64px margin each side, at **y = 1560px**. That keeps it above the Reels/TikTok caption and UI safe zone.
- A glass track with a gradient fill (red → violet → green) that moves from "danger" toward "secure" as the video progresses.
- 3 checkpoints with tiny labels: **Problem (0:13) · Impact (0:28) · Fix (0:42)**. Each checkpoint pops with a bounce and a soft "ding" when the fill reaches it.
- At 0:42 the bar fills completely and flashes green with a "✓ Secured" micro-badge.

### Safe zones
Keep key content between y = 250px and y = 1500px. Code windows are LTR, Arabic captions are RTL, and both are center-aligned.

### Editing rhythm
- Jump-cut every silence longer than 4 frames. No breaths left in.
- **Slow zoom-in** of 100% → 108% over the length of each talking-head shot.
- **Punch-in** cut to 135% on the key technical terms marked ⚡ in the script.
- Every punch-in gets a 2-frame whoosh SFX and a 1-frame white flash at 15% opacity.

---

## 1. Scene-by-Scene Script

> ⚡ = punch-in on face · 🏷️ = keyword badge · 🖱️ = cursor action

---

### Scene 1 — Hook · `0:00 – 0:03`
**VO:**
> «غيّرت رقم واحد في الـURL… وشفت بيانات يوزر تاني.»

**Visuals:**
- Frame 0: a hard open on a glass **browser window** already on screen with URL `api.app.com/profile?user_id=1`. No fade-in.
- 🖱️ The cursor flicks to the `1` and double-clicks it, and the digit highlights in violet.
- The `1` slot-machine-rolls to `2` with a vertical number scroll over 6 frames.
- The profile card under the URL **glitches** with an RGB split and swaps to a different avatar and name. The data stays blurred and fictional.
- A small red glass toast bounces in at the top: `⚠ Not your data`.

**Edit:** The speaker appears in the bottom half, already at a 115% crop. Cut on the word «تاني» to the full UI.
**Progress bar:** Starts at 0%, with a red fill appearing.
**SFX:** Keyboard click, glitch stutter, low bass hit.

---

### Scene 2 — The Setup · `0:03 – 0:08`
**VO:**
> «الـAPI بتاعك بيرجّع بروفايل اليوزر بالـuser_id. شغّال تمام… صح؟»

**Visuals:**
- A split layout. The top 55% holds the glass window that animates a **request → response** flow:
  - `GET /api/profile?user_id=1` slides in from the left (expo-out).
  - A floating **3D database icon** bounces in to the right of it.
  - The response JSON card scales in exponentially: `{ "name": "User 1", "phone": "•••", "address": "•••" }`
- 🏷️ **`user_id`** badge (violet) pops above the window on the word «user_id».
- On «صح؟» a tiny glass `✓ 200 OK` chip bounces in, which reads as false confidence.

**Edit:** Slow zoom on the speaker. On «صح؟» the speaker raises an eyebrow, with a quick 4-frame freeze.

---

### Scene 3 — The Flaw · `0:08 – 0:13`
**VO:**
> «بس لو حد غيّرها لـ 2… والسيرفر رجّع الداتا من غير ما يسأل: "دي بتاعة مين؟"»

**Visuals:**
- 🖱️ The cursor **intercepts the request**: it grabs the outgoing request packet (a small glass pill traveling along a dotted line) mid-flight and drags it up.
- The packet expands into a mini glass editor window, and `user_id=1` → `user_id=2` changes with a strikethrough on the `1`.
- The cursor releases, the packet continues to the server, and the 3D database icon **opens like a drawer** and hands back a red-glowing JSON card for "User 2".
- On «دي بتاعة مين؟» a big glass **question-mark bubble** bounces in above the server icon, and the server icon shrugs (tilts ±10°).

**Edit:** A fast cut to the speaker on «من غير ما يسأل», and a hand gesture on the quote.
**Progress bar:** Reaches the **Problem** checkpoint at 0:13, which pops with a ding.

---

### Scene 4 — Name It · `0:13 – 0:18`
**VO:**
> «ده اسمه ⚡**IDOR** — ⚡Insecure Direct ⚡**Object Reference**.»

**Visuals:**
- ⚡ Punch-in to 135% on «IDOR». A huge 🏷️ **`IDOR`** badge (red glow) bounce-reveals at center, and its letters stagger in at 2 frames each.
- The full name builds out word-by-word underneath as 3 smaller glass badges that snap in sync with the VO: `Insecure` · `Direct` · `Object Reference`
- ⚡ Second punch-in on «Object Reference». That badge pulses, and a thin line connects it back to `user_id=2` in a ghosted URL bar behind it, which visually ties the term to the example.

**Edit:** Punch-in, hold 10 frames, then punch back out. These are the only two punch-ins in a row, which gives this scene its rhythm.
**SFX:** A deep "thoom" for IDOR, then 3 quick ticks for the badges.

---

### Scene 5 — Root Cause · `0:18 – 0:23`
**VO:**
> «السيرفر اتأكد إنك مسجّل دخول — ⚡**Authentication** — بس ما اتأكدش إن الحاجة دي بتاعتك — ⚡**Authorization**.»

**Visuals:**
- Two glass cards sit side by side:
  - Left: 🔑 3D key icon + 🏷️ **`Authentication`**. A **green ✓** stamps in with a bounce. Label: «إنت مين؟»
  - Right: 🔒 3D lock icon + 🏷️ **`Authorization`**. A **red ✗** stamps in with a bounce and a screen shake (4px, 6 frames). Label: «ده بتاعك؟»
- The 3D lock icon is **open**, with its shackle swinging loose in an idle loop.

**Edit:** ⚡ Punch-in on «Authentication» and again on «Authorization». The second one is harder (140%).
**SFX:** A positive blip for ✓, an error buzz for ✗.

---

### Scene 6 — Impact · `0:23 – 0:28`
**VO:**
> «والنتيجة؟ 🏷️**Data Leak**. تليفونات، عناوين، فواتير… لكل اليوزرز.»

**Visuals:**
- 🏷️ A **`Data Leak`** badge (red, pulsing glow) bounces in at center.
- The 3D database icon cracks open, and glass **data cards** (📱 phone, 📍 address, 🧾 invoice) **cascade out** in an exponential burst, fanning into a grid. Each card is blurred or redacted, and they pop in sync with each spoken noun.
- On «لكل اليوزرز» the grid zooms out fast to reveal **hundreds** of cards tiling the screen, with a counter in a glass chip ticking up quickly: `Records exposed: 1 → 48,210`.

**Edit:** The speaker appears only in a small glass circle bubble (PiP) in the corner, and the visuals dominate.
**Progress bar:** Reaches the **Impact** checkpoint at 0:28. The bar is red at its peak.
**SFX:** A rising riser tone that cuts to silence on the transition.

---

### Scene 7 — Fix #1: Don't Trust the Client · `0:28 – 0:34`
**VO:**
> «الحل؟ ما تثقش في الـID اللي جاي من الـclient… هات هوية اليوزر من الـ⚡**session**.»

**Visuals:**
- A hard cut to silence, then a **color shift**: the background gradient sweeps from red-navy to mint-navy and announces the fix section.
- A glass code window (`profile.controller.js`) scales in exponentially:

```js
// ❌ Vulnerable
const id = req.query.user_id;

// ✅ Secure
const id = req.user.id; // from the verified session
const user = await User.findById(id);
```

- The `❌` line flashes red, then gets a **strikethrough wipe**. The `✅` line types on at 3 chars/frame and glows green.
- 🖱️ The cursor clicks `req.user.id`, and a glass tooltip bounces up: `Identity from server, not URL`.
- 🏷️ The **`Secure API`** badge (green) pops on «session».

**Edit:** ⚡ Punch-in on «session».
**SFX:** A whoosh for the color shift, typing ticks, a success chime.

---

### Scene 8 — Fix #2: Check Ownership Every Time · `0:34 – 0:39`
**VO:**
> «ولأي object تاني: اعمل ⚡**Access Control** check على السيرفر… في كل request.»

**Visuals:**
- A second glass window slides up from the bottom and stacks over the first, which slightly blurs and recedes:

```js
const order = await Order.findOne({
  id: req.params.id,
  ownerId: req.user.id   // ← ownership check
});
if (!order) return res.sendStatus(404);
```

- The `ownerId: req.user.id` line gets a green highlighter sweep.
- The **3D lock icon from Scene 5 snaps shut** with a bounce and a metallic click, and a 3D **shield** icon floats up behind it.
- Replay of the Scene 3 attack: the mini URL bar shows `?id=2` → the request hits the shield and bounces back with a red glass chip: `404 Not Found`.
- 🏷️ The **`Access Control`** badge (green) pops on the spoken term.

**Edit:** ⚡ Punch-in on «Access Control». Slow zoom during «في كل request».

---

### Scene 9 — Pro Tip · `0:39 – 0:42`
**VO:**
> «والـUUID بيصعّب التخمين… بس مش بديل عن الـcheck.»

**Visuals:**
- A small glass card: `id=2` morphs into `id=9f3c…a71e` (the characters scramble, then settle).
- A 🏷️ **`UUID ≠ Authorization`** badge bounce-reveals, with a violet glow on the `≠`.
- A quick ✓/✗ pair: «Harder to guess ✓» / «Replaces the check ✗».

**Edit:** One fast jump cut to the speaker wagging a finger on «مش بديل».

---

### Scene 10 — Payoff + CTA · `0:42 – 0:45`
**VO:**
> «كده الـAPI بتاعك Secure. ابعتها لزميلك… وتابع Logika.»

**Visuals:**
- **The progress bar hits 100%**, flashes green, and the `✓ Secured` micro-badge bounces up from it.
- All the 3D icons (lock 🔒 closed, shield 🛡️, database 🛢️) orbit once around the speaker's head and settle into a row.
- The Logika logo `{LOGIKA}` scales in exponentially inside a glass pill at center, and the curly braces snap in from the sides with a bounce.
- A small glass "Send" ✈️ icon pulses beside «ابعتها لزميلك».

**Edit:** Slow zoom to 110% on the speaker, ending on a smile. A hard cut to black on the last frame, so the reel loops cleanly back to Scene 1.
**SFX:** A success chord and a final whoosh.

---

## 2. Full VO (for the teleprompter)

> غيّرت رقم واحد في الـURL… وشفت بيانات يوزر تاني.
> الـAPI بتاعك بيرجّع بروفايل اليوزر بالـuser_id. شغّال تمام… صح؟
> بس لو حد غيّرها لـ 2… والسيرفر رجّع الداتا من غير ما يسأل: "دي بتاعة مين؟"
> ده اسمه IDOR — Insecure Direct Object Reference.
> السيرفر اتأكد إنك مسجّل دخول — Authentication — بس ما اتأكدش إن الحاجة دي بتاعتك — Authorization.
> والنتيجة؟ Data Leak. تليفونات، عناوين، فواتير… لكل اليوزرز.
> الحل؟ ما تثقش في الـID اللي جاي من الـclient… هات هوية اليوزر من الـsession.
> ولأي object تاني: اعمل Access Control check على السيرفر… في كل request.
> والـUUID بيصعّب التخمين… بس مش بديل عن الـcheck.
> كده الـAPI بتاعك Secure. ابعتها لزميلك… وتابع Logika.

**About 105 words, which runs about 42–44s at reel pace with no pauses.**

---

## 3. Badge Sync Cue Sheet (for the motion designer)

| Time | Spoken word | Badge | Color | Animation |
|---|---|---|---|---|
| 0:05 | user_id | `user_id` | Violet | Bounce |
| 0:14 | IDOR | `IDOR` | Red | Bounce + letter stagger |
| 0:15–0:17 | Insecure / Direct / Object Reference | 3 sub-badges | White | Snap-in per word |
| 0:19 | Authentication | `Authentication ✓` | Green | Bounce |
| 0:21 | Authorization | `Authorization ✗` | Red | Bounce + shake |
| 0:24 | Data Leak | `Data Leak` | Red pulse | Bounce |
| 0:32 | session | `Secure API` | Green | Expo scale |
| 0:36 | Access Control | `Access Control` | Green | Bounce |
| 0:40 | UUID | `UUID ≠ Authorization` | Violet | Bounce |
| 0:43 | — | `✓ Secured` | Green | Bounce from bar |

---

## 4. Caption (post text)

> غيّر رقم في الـURL… وشوف بيانات حد تاني؟ 👀
> ده IDOR، وده من أكتر الثغرات اللي بنلاقيها في الـAPIs.
> القاعدة بسيطة: Authentication بيقولك "إنت مين"، و Authorization بيقولك "ده بتاعك ولا لأ". الاتنين لازم يتعملوا على السيرفر، في كل request.
> احفظ الفيديو وابعته لأي dev في التيم 🔒

`#Logika #WebSecurity #IDOR #BackendDev #API #SecureCoding #OWASP`
