(() => {
  const nutrition = Array.isArray(window.CHARISMA_NUTRITION) ? window.CHARISMA_NUTRITION : [];
  const pageByPath = {
    'index.html': 'menu',
    'account.html': 'account',
    'order-tracking.html': 'tracking',
    'support.html': 'support',
    'impact-redeem.html': 'impact'
  };
  const page = pageByPath[location.pathname.split('/').pop()] || 'menu';
  let chosenItems = [];

  function addStyles() {
    if (document.getElementById('charismaAssistantStyles')) return;
    const style = document.createElement('style');
    style.id = 'charismaAssistantStyles';
    style.textContent = `
      .kcal-tool{margin:14px 0;padding:14px;border:1px solid rgba(23,23,23,.14);border-radius:16px;background:linear-gradient(145deg,#fff1bc 0%,#fff8e6 62%,#e8f3e8 100%);color:#171717}
      .kcal-tool h3{margin:0 0 5px;font-family:inherit;font-size:15px;font-weight:900;line-height:1.5}
      .kcal-note{margin:0 0 10px;color:#625b52;font-size:11px;line-height:1.7}
      .kcal-controls{display:grid;grid-template-columns:minmax(0,1fr) 100px auto;gap:7px;align-items:end}
      .kcal-controls label{display:grid;gap:4px;font-size:11px;font-weight:800}
      .kcal-controls select,.kcal-controls input{width:100%;min-width:0;padding:9px;border:1px solid rgba(23,23,23,.24);border-radius:9px;background:#fff;color:#171717;font:inherit}
      .kcal-controls button,.kcal-remove{padding:9px 11px;border:0;border-radius:9px;background:#ffc928;color:#171717;font:inherit;font-weight:900;cursor:pointer}
      .kcal-controls button:active,.kcal-remove:active{transform:scale(.98)}
      .kcal-items{display:grid;gap:6px;margin:10px 0 0;padding:0;list-style:none}
      .kcal-items li{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:6px;padding:8px 0;border-bottom:1px solid rgba(23,23,23,.1);font-size:11px}
      .kcal-source{color:#2f7d58;font-size:10px;font-weight:800}
      .kcal-remove{padding:5px 8px;background:#fff;border:1px solid rgba(23,23,23,.2)}
      .kcal-total{margin:10px 0 0;font-weight:900;font-size:13px}
      .kcal-result{min-height:20px;margin:6px 0 0;color:#625b52;font-size:11px}
      .charisma-assistant-prompts{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
      .charisma-assistant-prompts button{padding:7px 10px;border:1px solid rgba(47,125,88,.35);border-radius:999px;background:#e8f3e8;color:#171717;font:800 11px Cairo,Arial,sans-serif;cursor:pointer}
      .charisma-assistant-prompts button:active{transform:scale(.98)}
      .charisma-assistant-launcher{position:fixed;inset:auto 18px 18px auto;z-index:1000;min-height:52px;padding:12px 17px;border:2px solid #171717;border-radius:18px;background:#ffc928;color:#171717;box-shadow:5px 5px 0 #171717;font:900 15px Cairo,Arial,sans-serif;cursor:pointer}
      .charisma-assistant-launcher:focus-visible,.charisma-assistant button:focus-visible,.charisma-assistant input:focus-visible,.charisma-assistant select:focus-visible{outline:3px solid #2f7d58;outline-offset:3px}
      .charisma-assistant{position:fixed;inset:auto 18px 82px auto;z-index:1001;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;width:min(410px,calc(100vw - 28px));height:min(720px,calc(100dvh - 110px));border:2px solid #171717;border-radius:20px;background:#fffdf8;color:#171717;box-shadow:8px 8px 0 #ef3d2f;font-family:Cairo,Arial,sans-serif}
      .charisma-assistant[hidden]{display:none}
      .charisma-assistant-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;background:linear-gradient(110deg,#171717 0%,#34302a 72%,#2f7d58 100%);color:#fffdf8}
      .charisma-assistant-head h2{margin:0;font-size:16px}
      .charisma-assistant-head p{margin:2px 0 0;color:#e5dfd4;font-size:11px}
      .charisma-assistant-close{width:36px;height:36px;border:1px solid #777;border-radius:10px;background:transparent;color:#fff;font-size:22px;cursor:pointer}
      .charisma-assistant-body{overflow:auto;padding:13px}
      .charisma-assistant-transcript{display:grid;gap:8px}
      .charisma-assistant-message{max-width:92%;padding:9px 11px;border-radius:13px;background:#f0ece4;font-size:12px;line-height:1.7;white-space:pre-wrap}
      .charisma-assistant-message.user{justify-self:start;background:#e8f3e8}
      .charisma-assistant-message.assistant{justify-self:end}
      .charisma-assistant-status{min-height:22px;margin-top:8px;color:#625b52;font-size:11px}
      .charisma-assistant-status button{margin-inline-start:8px;padding:5px 8px;border:1px solid #71695f;border-radius:8px;background:transparent;color:#171717;font:inherit;font-weight:800}
      .charisma-assistant-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:11px;border-top:1px solid rgba(23,23,23,.14)}
      .charisma-assistant-form label{grid-column:1/-1;font-size:11px;font-weight:900}
      .charisma-assistant-form input{min-width:0;padding:10px;border:1px solid rgba(23,23,23,.25);border-radius:10px;background:#fff;color:#171717;font:inherit}
      .charisma-assistant-form button{padding:9px 13px;border:0;border-radius:10px;background:#ef3d2f;color:#fff;font:inherit;font-weight:900;cursor:pointer}
      .charisma-assistant-privacy{margin:0 13px 10px;color:#625b52;font-size:10px;line-height:1.6}
      @media(max-width:480px){.charisma-assistant-launcher{inset:auto 12px 12px auto}.charisma-assistant{inset:auto 8px 72px 8px;width:auto;height:min(690px,calc(100dvh - 92px));}.kcal-controls{grid-template-columns:minmax(0,1fr) 68px}.kcal-controls button{grid-column:1/-1}}
      @media(prefers-reduced-motion:reduce){.kcal-controls button,.kcal-remove{transition:none}}
    `;
    document.head.append(style);
  }

  function makeCalorieTool() {
    const section = document.createElement('section');
    section.className = 'kcal-tool';
    section.setAttribute('aria-labelledby', 'kcalToolTitle');
    section.innerHTML = `
      <h3 id="kcalToolTitle">احسبها بالمكونات والكمية</h3>
      <p class="kcal-note">اختار كل مكوّن، واكتب وزنه بالجرام. الحساب يستخدم السعرات لكل 100 جم من بيانات USDA للأطعمة العامة، وليس وصفة المطعم.</p>
      <div class="kcal-controls">
        <label>المكوّن
          <select class="kcal-item"><option value="">اختار مكوّنًا</option></select>
        </label>
        <label>الكمية بالجرام
          <input class="kcal-quantity" type="number" min="1" max="2000" value="100" inputmode="decimal">
        </label>
        <button class="kcal-add" type="button">أضف</button>
      </div>
      <ul class="kcal-items" aria-label="الأصناف المختارة"></ul>
      <p class="kcal-total" aria-live="polite"></p>
      <p class="kcal-result" role="status" aria-live="polite"></p>
      <a class="kcal-source" href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer">مصدر القيم: USDA FoodData Central</a>
    `;
    const select = section.querySelector('.kcal-item');
    nutrition.forEach(item => {
      if (!item || !Number.isInteger(item.id) || !Number.isFinite(item.kcalPer100g) || !Number.isInteger(item.fdcId)) return;
      const option = document.createElement('option');
      option.value = String(item.id);
      option.textContent = `${item.name} (${item.kcalPer100g} سعرة لكل 100 جم)`;
      select.append(option);
    });
    const list = section.querySelector('.kcal-items');
    const total = section.querySelector('.kcal-total');
    const status = section.querySelector('.kcal-result');

    function render() {
      list.replaceChildren();
      let totalCalories = 0;
      chosenItems.forEach((entry, index) => {
        const calories = Math.round(entry.item.kcalPer100g * entry.quantity / 100);
        totalCalories += calories;
        const row = document.createElement('li');
        const label = document.createElement('span');
        label.textContent = `${entry.item.name}، ${entry.quantity} جم، ${calories} سعرة تقريبًا`;
        const source = document.createElement('a');
        source.className = 'kcal-source';
        source.href = `https://fdc.nal.usda.gov/food-details/${entry.item.fdcId}/nutrients`;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.textContent = 'المصدر';
        const remove = document.createElement('button');
        remove.className = 'kcal-remove';
        remove.type = 'button';
        remove.textContent = 'إزالة';
        remove.setAttribute('aria-label', `إزالة ${entry.item.name}`);
        remove.addEventListener('click', () => {
          chosenItems.splice(index, 1);
          render();
        });
        row.append(label, source, remove);
        list.append(row);
      });
      total.textContent = chosenItems.length ? `الإجمالي التقديري للمكونات: ${totalCalories.toLocaleString('ar-EG')} سعرة حرارية` : 'أضف مكوّنًا وحدد كميته بالجرام لعرض الإجمالي.';
    }

    section.querySelector('.kcal-add').addEventListener('click', () => {
      const item = nutrition.find(entry => String(entry.id) === select.value);
      const quantity = Number(section.querySelector('.kcal-quantity').value);
      if (!item) {
        status.textContent = 'اختار مكوّنًا أولًا.';
        select.focus();
        return;
      }
      if (!Number.isFinite(quantity) || quantity < 1 || quantity > 2000) {
        status.textContent = 'أدخل كمية بالجرام من 1 إلى 2000.';
        section.querySelector('.kcal-quantity').focus();
        return;
      }
      chosenItems.push({ item, quantity });
      status.textContent = '';
      render();
    });
    render();
    return section;
  }

  function hasPrivateDetails(text) {
    const normalized = text.replace(/[٠-٩۰-۹]/g, digit => {
      const code = digit.charCodeAt(0);
      return String.fromCharCode(48 + code - (code >= 1776 ? 1776 : 1632));
    });
    return /\b[\w.+-]+@[\w.-]+\.[A-Z]{2,}\b/i.test(normalized) ||
      /(?:\+?\d)(?:[\s().-]*\d){8,}/.test(normalized) ||
      /\b\d{6,}\b/.test(normalized) ||
      /\b(?:CHR|SUP)-\d{4,}\b/i.test(normalized) ||
      /\b(?:my name is|my email is|my phone(?: number)? is|my address is|my password is)\b/i.test(normalized) ||
      /\b(?=[A-Z0-9]{6}\b)(?=[A-Z0-9]*[A-Z])(?=[A-Z0-9]*\d)[A-Z0-9]{6}\b/i.test(normalized) ||
      /اسمي\s+[\p{L}]{2,}|(?:بريدي(?: الإلكتروني)?|رقم هاتفي|عنواني|كلمة مروري)\s*(?:هو|هي|:|=)/u.test(normalized);
  }

  function installCalculatorOnHome() {
    const body = document.querySelector('#chatPanel .chat-body');
    if (!body) return;
    if (!body.querySelector('.charisma-assistant-prompts')) {
      const prompts = makeSuggestedQuestions();
      const transcript = body.querySelector('.chat-transcript');
      body.insertBefore(prompts, transcript);
      wireSuggestedQuestions(prompts, document.getElementById('chatInput'), document.getElementById('chatForm'));
    }
    if (!body.querySelector('.kcal-tool')) body.insertBefore(makeCalorieTool(), body.querySelector('.chat-privacy'));
  }

  function makeSuggestedQuestions() {
    const prompts = document.createElement('div');
    prompts.className = 'charisma-assistant-prompts';
    prompts.setAttribute('aria-label', 'أسئلة سريعة');
    [
      ['رشّح لي وجبة مناسبة', 'رشح لي وجبة مناسبة من المنيو.'],
      ['اختيار بأثر أعلى', 'ساعدني أختار صنفًا بنقاط أثر أعلى، ووضح أن البيانات تجريبية.'],
      ['المكافآت', 'اشرح لي المكافآت المعروضة في الموقع.']
    ].forEach(([label, question]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.dataset.assistantQuestion = question;
      prompts.append(button);
    });
    return prompts;
  }

  function wireSuggestedQuestions(container, input, form) {
    container.querySelectorAll('[data-assistant-question]').forEach(button => {
      button.addEventListener('click', () => {
        input.value = button.dataset.assistantQuestion;
        form.requestSubmit();
      });
    });
  }

  function installAssistant() {
    if (document.getElementById('chatLauncher')) {
      installCalculatorOnHome();
      return;
    }
    const launcher = document.createElement('button');
    launcher.className = 'charisma-assistant-launcher';
    launcher.type = 'button';
    launcher.textContent = 'اسأل كاريزما';
    launcher.setAttribute('aria-controls', 'charismaAssistantPanel');
    launcher.setAttribute('aria-expanded', 'false');
    document.body.append(launcher);

    const panel = document.createElement('section');
    panel.className = 'charisma-assistant';
    panel.id = 'charismaAssistantPanel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'مساعد كاريزما');
    panel.hidden = true;
    panel.innerHTML = `
      <header class="charisma-assistant-head">
        <div><h2>اسأل كاريزما</h2><p>بائعك الذكي للمنيو والأثر</p></div>
        <button class="charisma-assistant-close" type="button" aria-label="إغلاق المحادثة">×</button>
      </header>
      <div class="charisma-assistant-body">
        <p class="kcal-note">احكيلي بتدور على إيه، وأساعدك تختار من معلومات الموقع. السؤال يُرسل إلى Cloudflare Workers AI، فلا ترسل بيانات شخصية أو أكواد.</p>
        <div class="charisma-assistant-prompts" aria-label="أسئلة سريعة">
          <button type="button" data-assistant-question="رشح لي وجبة مناسبة من المنيو.">رشّح لي وجبة</button>
          <button type="button" data-assistant-question="ساعدني أختار صنفًا بنقاط أثر أعلى، ووضح أن البيانات تجريبية.">اختيار بأثر أعلى</button>
          <button type="button" data-assistant-question="اشرح لي المكافآت المعروضة في الموقع.">المكافآت</button>
        </div>
        <div class="charisma-assistant-transcript" role="log" aria-live="polite" aria-relevant="additions text">
          <div class="charisma-assistant-message assistant" dir="auto">أقدر أساعدك تختار من المنيو وأشرح الأثر والمكافآت. للسعرات اختار المكونات واكتب كميتها بالجرام.</div>
        </div>
        <div class="charisma-assistant-status" role="status" aria-live="polite"></div>
      </div>
      <p class="charisma-assistant-privacy">المحادثة لا تحفظ بعد مغادرة الصفحة. نرسل سؤالك الحالي فقط.</p>
      <form class="charisma-assistant-form">
        <label for="charismaAssistantInput">سؤالك</label>
        <input id="charismaAssistantInput" maxlength="400" autocomplete="off" required>
        <button type="submit">إرسال</button>
      </form>
    `;
    panel.querySelector('.charisma-assistant-body').insertBefore(makeCalorieTool(), panel.querySelector('.charisma-assistant-status'));
    document.body.append(panel);

    const input = panel.querySelector('#charismaAssistantInput');
    const form = panel.querySelector('.charisma-assistant-form');
    const transcript = panel.querySelector('.charisma-assistant-transcript');
    const status = panel.querySelector('.charisma-assistant-status');
    const sendButton = form.querySelector('button');
    let pendingQuestion = '';
    let busy = false;

    function setOpen(open) {
      panel.hidden = !open;
      launcher.setAttribute('aria-expanded', String(open));
      if (open) input.focus();
      else launcher.focus();
    }

    function appendMessage(role, text) {
      const message = document.createElement('div');
      message.className = `charisma-assistant-message ${role}`;
      message.dir = 'auto';
      message.textContent = text;
      transcript.append(message);
      while (transcript.children.length > 9) transcript.children[1].remove();
      const body = panel.querySelector('.charisma-assistant-body');
      body.scrollTop = body.scrollHeight;
    }

    async function sendQuestion(question) {
      const endpoint = window.CHARISMA_AI_CONFIG && window.CHARISMA_AI_CONFIG.chatEndpoint;
      if (!endpoint || busy) {
        status.textContent = 'المساعد غير متاح حاليًا. جرّب لاحقًا.';
        return;
      }
      busy = true;
      input.disabled = true;
      sendButton.disabled = true;
      status.textContent = 'جارٍ إعداد الإجابة...';
      status.setAttribute('aria-busy', 'true');
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, messages: [{ role: 'user', content: question }] })
        });
        if (!response.ok) {
          if (response.status === 429) throw new Error('وصلت لحد الاستخدام المؤقت. انتظر قليلًا ثم أعد المحاولة.');
          if (response.status === 400) throw new Error('لم نرسل الرسالة لحماية خصوصيتك. احذف أي بيانات أو أكواد شخصية.');
          throw new Error('تعذر الاتصال بالمساعد الآن.');
        }
        const result = await response.json();
        if (typeof result.answer !== 'string' || !result.answer.trim() || hasPrivateDetails(result.answer)) {
          throw new Error('لم تصل إجابة آمنة للاستخدام.');
        }
        appendMessage('assistant', result.answer.trim());
        pendingQuestion = '';
        status.textContent = 'تمت الإجابة من معلومات الموقع التجريبية.';
      } catch (error) {
        status.replaceChildren();
        status.append(document.createTextNode(error instanceof Error ? error.message : 'تعذر الاتصال بالمساعد الآن.'));
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.textContent = 'إعادة المحاولة';
        retry.addEventListener('click', () => sendQuestion(pendingQuestion));
        status.append(retry);
      } finally {
        busy = false;
        input.disabled = false;
        sendButton.disabled = false;
        status.setAttribute('aria-busy', 'false');
        if (pendingQuestion) input.value = pendingQuestion;
        else input.focus();
      }
    }

    launcher.addEventListener('click', () => setOpen(panel.hidden));
    panel.querySelector('.charisma-assistant-close').addEventListener('click', () => setOpen(false));
    wireSuggestedQuestions(panel.querySelector('.charisma-assistant-prompts'), input, form);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) setOpen(false);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (busy) return;
      const question = input.value.trim();
      if (!question) return;
      if (question.length > 400 || hasPrivateDetails(question)) {
        status.textContent = 'لا ترسل بيانات شخصية أو أرقام هواتف أو أكواد. لم نرسل سؤالك.';
        return;
      }
      pendingQuestion = question;
      appendMessage('user', question);
      input.value = '';
      status.textContent = '';
      sendQuestion(question);
    });
  }

  addStyles();
  installAssistant();
})();
