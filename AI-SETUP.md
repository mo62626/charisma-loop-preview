# ذكاء كاريزما عبر Cloudflare

يستدعي الموقع Worker على Cloudflare، والـWorker يستخدم Workers AI من خلال binding من غير مفتاح API لمزوّد خارجي. وفق صفحة تسعير Cloudflare، الحصة المجانية تشمل 10,000 Neurons يوميًا؛ على الخطة المجانية، الطلبات التي تتجاوز الحصة لا تُنفّذ دون الترقية.

## حدود وتجربة مجانية

- حد حماية الـWorker مضبوط على 5 طلبات في الدقيقة لكل عنوان IP تقريبًا.
- الحصة اليومية لخدمة Workers AI محدودة وقد تختلف كلفة الاستدلال بحسب حجم الطلب والنموذج.
- لا تُدخل بيانات شخصية أو أسرارًا في الطلبات. الاقتراح مبني على المنيو، وبيانات الهدر تقديرية وليست مخزونًا مباشرًا.
- إذا تعذّر الاتصال، تعرض الصفحة الاقتراح المحلي بدلًا منه.

## الإعداد

إعداد Worker في `wrangler.toml` يربط `AI` بخدمة Cloudflare Workers AI. ينشره صاحب الحساب من مجلد هذا المشروع باستخدام `npx wrangler deploy`. لا تضع مفاتيح OpenAI أو Google في ملفات الموقع أو GitHub.

المراجع: [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) و[Workers AI bindings](https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/).
