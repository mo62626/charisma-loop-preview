# تشغيل اقتراحات Gemini

يبقى الموقع منشورًا من GitHub Pages. يستدعي المتصفح Cloudflare Worker، والـWorker وحده يحتفظ بمفتاح Gemini.

## 1. تفعيل GitHub Pages

من مستودع `mo62626/charisma-loop-preview` افتح **Settings → Pages**، واختر **GitHub Actions** في **Build and deployment → Source** قبل أول نشر. بعد دفع ملفات الإعداد هذه، راقب تشغيل workflow باسم **Deploy static preview to GitHub Pages**. رابط الموقع المتوقع:

`https://mo62626.github.io/charisma-loop-preview/`

## 2. إنشاء مفتاح Gemini

أنشئ مفتاحًا من Google AI Studio، وراجع حدود الاستخدام والتسعير في حسابك قبل استخدامه. لا ترسل المفتاح في المحادثات، ولا تضعه في ملفات الموقع أو GitHub.

## 3. نشر Cloudflare Worker

من مجلد المستودع شغّل هذه الأوامر في الطرفية بعد تثبيت Node.js:

```powershell
npx wrangler login
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

عند طلب `GEMINI_API_KEY` الصق المفتاح في الطرفية؛ لا يظهر ضمن الملفات. الإعداد `wrangler.toml` يقصر المتصفح على أصل GitHub Pages ويحدّ الطلبات إلى 5 في الدقيقة لكل عنوان IP تقريبًا. حدود Cloudflare تقريبية وليست سقفًا صارمًا. استخدام Gemini قد يخضع لحدود أو تكلفة حسب حساب Google؛ راجعها قبل تفعيل المفتاح. إذا كان اسم `charisma-loop-ai` مستخدمًا في حساب Cloudflare، غيّر `name` في `wrangler.toml` قبل النشر.

بعد النشر سيعرض Wrangler عنوان Worker ينتهي بـ `workers.dev`. انسخ العنوان وأضف `/recommend` في نهايته.

## 4. توصيل الموقع بالـWorker

افتح `ai-config.js`، وضع عنوان Worker في `endpoint` فقط، مثل:

```js
endpoint: 'https://اسم-worker.اسم-حسابك.workers.dev/recommend'
```

هذا العنوان ليس سرًا. بعد ذلك احفظ الملف وادفع التغيير إلى GitHub؛ سيعيد Pages النشر تلقائيًا. لا تضع مفتاح Gemini في هذا الملف.

إذا لم تُضبط وصلة Worker، يستمر الموقع باقتراحاته المحلية التجريبية. عند نجاح الاتصال يتغير الاقتراح حسب الهدف المختار، ويجري التحقق من رقم الصنف قبل إظهاره.

## إيقاف الخدمة

احذف Worker من لوحة Cloudflare لإيقاف نقطة الاتصال، واحذف مفتاح Gemini من إعدادات أسرار Worker أو ألغِه من Google AI Studio. يمكن أيضًا تفريغ `endpoint` في `ai-config.js` ودفع التغيير لإيقاف استدعاءات الذكاء الاصطناعي من الموقع.
