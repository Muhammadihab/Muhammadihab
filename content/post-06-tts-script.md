# بوست ٦: سكريبت الـ TTS (بأسلوبك من التسجيل)

## 1) Style instructions (حطها في خانة الـ style / prompt)

```
Read this in Egyptian Arabic (Cairo dialect). Male voice, late 20s.
Tone: a friendly developer who knows security, explaining something to a friend who owns a business.
Confident and warm, a little serious, never salesy or dramatic.
Pace: conversational and slightly quick, with short natural pauses at "…" and at line breaks.
Questions like "طب ده حصل إزاي؟" and "طب إيه الحل؟" should sound genuinely curious, with rising intonation, then answer them straight away.
Light emphasis on: رقم الأوردر، واحدة تانية خالص، عملاءك كلهم، كل مرة.
The last line "لوجيكا. متأمّن من جوّا." is calmer and slower, like a signature.
Pronounce "آي دور" like "eye-door".
```

## 2) Script (انسخه زي ما هو)

```
لو جالك الرسالة دي… يبقى تطبيقك فيه مشكلة.
وغالبًا إنت مش واخد بالك.

خلّينا نوريك.
ده متجر إلكتروني إحنا عاملينه، وسايبين فيه غلطة بنلاقيها كتير.

بُص معايا على اللينك.
الرقم اللي في آخره ده… رقم الأوردر بتاعك.

طب لو غيّرناه؟ خلّينا مثلًا تلاتة وأربعين…
الموقع فتحلنا أوردر واحدة تانية خالص.
اسمها، ورقمها، وعنوانها.

طب ده حصل إزاي؟
الموقع بيجيب الأوردر بالرقم وخلاص… مش بيسأل إذا كنت إنت صاحبه أصلًا ولا لأ.

الغلطة دي اسمها آي دور، ودي من أشهر الثغرات اللي بنقابلها.

يعني أي حد يقدر يكمّل… أربعة وأربعين، خمسة وأربعين، وهكذا…
وبكده خلاص، يوصل لبيانات عملاءك كلهم.

طب إيه الحل؟
الحل إن الموقع كل مرة يتأكد: إنت صاحب الأوردر ده ولا لأ؟
لو إنت، يفتحلك. لو مش إنت، يقفل عليك.

لو عندك تطبيق شغال، اسأل المبرمج بتاعك:
هي الثغرة دي موجودة عندنا أصلًا ولا لأ؟

ولو عايزنا نجرّبه بنفسنا… ابعتلنا على واتساب.

لوجيكا. متأمّن من جوّا.
```

## لو النطق طلع غلط
| المشكلة | جرّب |
|---|---|
| بينطق IDOR حروف أو غلط | «آيدور» لزقة، أو «آي، دور» |
| بينطق الكلام فصحى | زوّد في الـ style: `Strictly Egyptian colloquial, not Modern Standard Arabic` |
| «لوجيكا» طالعة غريبة | «لُوجيكا» بالضمة |
| سريع أوي أو بطيء أوي | غيّر `slightly quick` لـ `natural pace` أو `energetic` |

ابعتلي ملف الصوت اللي يطلع، وأنا أبني الفيديو والكابشن عليه.
