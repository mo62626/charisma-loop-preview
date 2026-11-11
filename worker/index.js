const menu = [
  { id: 1, name: 'كاريزما كلاسيك', description: 'برجر لحمة، جبنة، خس، طماطم وصوص كاريزما.', price: 95, impact: 14, waste: 180, category: 'family' },
  { id: 2, name: 'دبل كاريزما', description: 'قطعتين لحمة مع جبنة شيدر وصوص مدخن.', price: 135, impact: 18, waste: 240, category: 'friends' },
  { id: 3, name: 'كرانشي تشيكن', description: 'فراخ مقرمشة، خس، مخلل وصوص حار.', price: 88, impact: 16, waste: 210, category: 'young' },
  { id: 4, name: 'راب كاريزما', description: 'تشيكن، جبنة، بطاطس وصوص خاص في عيش طازة.', price: 78, impact: 21, waste: 260, category: 'friends' },
  { id: 5, name: 'فرايز تشيدر', description: 'بطاطس مقرمشة مع تشيدر وصوص كاريزما.', price: 52, impact: 11, waste: 140, category: 'kids' },
  { id: 6, name: 'ليمون بالنعناع', description: 'ليمون فريش ونعناع في عبوة قابلة لإعادة الاستخدام.', price: 38, impact: 9, waste: 90, category: 'light' }
];

const intentLabels = {
  taste: 'وجبة شهية ومناسبة لمن يحب الطعم',
  save: 'أفضل قيمة وسعر مناسب',
  rescue: 'تقليل هدر الطعام والاستفادة من الأثر',
  light: 'اختيار أخف أثرًا وتغليفًا'
};

function jsonResponse(body, status, origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Vary': 'Origin'
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = env.ALLOWED_ORIGIN;
    const url = new URL(request.url);

    if (!allowedOrigin || origin !== allowedOrigin) {
      return jsonResponse({ error: 'Origin not allowed.' }, 403);
    }

    if (url.pathname !== '/recommend') {
      return jsonResponse({ error: 'Not found.' }, 404, origin);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin'
        }
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405, origin);
    }

    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > 1024) {
      return jsonResponse({ error: 'Request is too large.' }, 413, origin);
    }

    let payload;
    try {
      const reader = request.body.getReader();
      const decoder = new TextDecoder();
      let body = '';
      let totalBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > 1024) {
          await reader.cancel();
          return jsonResponse({ error: 'Request is too large.' }, 413, origin);
        }
        body += decoder.decode(value, { stream: true });
      }
      body += decoder.decode();
      payload = JSON.parse(body);
    } catch {
      return jsonResponse({ error: 'Invalid JSON.' }, 400, origin);
    }

    if (!payload || !Object.hasOwn(intentLabels, payload.intent)) {
      return jsonResponse({ error: 'Invalid intent.' }, 400, origin);
    }

    if (!env.GEMINI_API_KEY) {
      return jsonResponse({ error: 'AI service is not configured.' }, 503, origin);
    }

    const clientIp = request.headers.get('CF-Connecting-IP');
    if (!clientIp || !env.AI_LIMITER) {
      return jsonResponse({ error: 'Rate limiter is not configured.' }, 503, origin);
    }

    const { success } = await env.AI_LIMITER.limit({ key: clientIp });
    if (!success) {
      return jsonResponse({ error: 'Too many requests. Please try again later.' }, 429, origin);
    }

    const itemList = menu.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      impact: item.impact,
      category: item.category
    }));

    let providerResponse;
    try {
      providerResponse = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: 'أنت مساعد لمنيو مطعم. اختر صنفًا واحدًا فقط من القائمة المرفقة، ولا تخترع صنفًا أو سعرًا أو معلومة. أعد JSON فقط يحتوي itemId وtitle وreason. اجعل العنوان والسبب بالعربية، والسبب قصيرًا وصادقًا ولا تدّعِ معلومات عن المخزون غير الموجودة.'
              }]
            },
            contents: [{
              role: 'user',
              parts: [{
                text: JSON.stringify({
                  goal: intentLabels[payload.intent],
                  menu: itemList
                })
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 180,
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  itemId: { type: 'INTEGER' },
                  title: { type: 'STRING' },
                  reason: { type: 'STRING' }
                },
                required: ['itemId', 'title', 'reason']
              }
            }
          }),
          signal: AbortSignal.timeout(15000)
        }
      );
    } catch {
      return jsonResponse({ error: 'AI provider is temporarily unavailable.' }, 502, origin);
    }

    if (!providerResponse.ok) {
      return jsonResponse({ error: 'AI provider rejected the request.' }, 502, origin);
    }

    let providerData;
    try {
      providerData = await providerResponse.json();
    } catch {
      return jsonResponse({ error: 'AI provider returned an invalid response.' }, 502, origin);
    }

    const responseText = providerData.candidates?.[0]?.content?.parts?.[0]?.text;
    let suggestion;
    try {
      suggestion = JSON.parse(responseText);
    } catch {
      return jsonResponse({ error: 'AI provider returned an invalid suggestion.' }, 502, origin);
    }

    const item = menu.find(candidate => candidate.id === suggestion.itemId);
    if (!item || typeof suggestion.title !== 'string' || typeof suggestion.reason !== 'string') {
      return jsonResponse({ error: 'AI provider returned an unusable suggestion.' }, 502, origin);
    }

    return jsonResponse({
      recommendation: {
        itemId: item.id,
        title: suggestion.title.slice(0, 80),
        reason: suggestion.reason.slice(0, 240),
        item
      }
    }, 200, origin);
  }
};
