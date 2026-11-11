(() => {
  const personalFields = [
    'input[autocomplete="name"]',
    'input[autocomplete="email"]',
    'input[autocomplete="tel"]',
    'input[autocomplete="username"]',
    'input[type="password"]',
    'input[name="name"]',
    'input[name="email"]'
  ].join(',');

  const notice = document.createElement('aside');
  notice.textContent = 'معاينة تجريبية فقط: لا تُدخل اسمًا أو بريدًا أو رقم هاتف أو كلمة مرور حقيقية. الحسابات غير مفعّلة ولا يوجد خادم.';
  notice.setAttribute('role', 'note');
  notice.style.cssText = 'position:sticky;top:0;z-index:9999;padding:10px 16px;background:#fff0bd;color:#171717;border-bottom:1px solid #d5bd71;text-align:center;font:700 13px/1.6 Arial,sans-serif';
  document.body.prepend(notice);

  document.querySelectorAll(personalFields).forEach(field => {
    field.value = '';
    field.disabled = true;
    field.autocomplete = 'off';
  });

  document.querySelectorAll('form').forEach(form => {
    if (!form.querySelector(personalFields)) return;
    const submit = form.querySelector('button[type="submit"],button:not([type]),input[type="submit"]');
    if (submit) submit.disabled = true;
    form.addEventListener('submit', event => event.preventDefault(), true);
  });
})();
