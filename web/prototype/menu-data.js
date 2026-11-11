window.CHARISMA_MENU = [
  { id: 1, name: 'كاريزما كلاسيك', description: 'برجر لحمة، جبنة، خس، طماطم وصوص كاريزما.', price: 95, impact: 14, waste: 180, category: 'family', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80' },
  { id: 2, name: 'دبل كاريزما', description: 'قطعتين لحمة مع جبنة شيدر وصوص مدخن.', price: 135, impact: 18, waste: 240, category: 'friends', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80' },
  { id: 3, name: 'كرانشي تشيكن', description: 'فراخ مقرمشة، خس، مخلل وصوص حار.', price: 88, impact: 16, waste: 210, category: 'young', image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=700&q=80' },
  { id: 4, name: 'راب كاريزما', description: 'تشيكن، جبنة، بطاطس وصوص خاص في عيش طازة.', price: 78, impact: 21, waste: 260, category: 'friends', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80' },
  { id: 5, name: 'فرايز تشيدر', description: 'بطاطس مقرمشة مع تشيدر وصوص كاريزما.', price: 52, impact: 11, waste: 140, category: 'kids', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80' },
  { id: 6, name: 'ليمون بالنعناع', description: 'ليمون فريش ونعناع في عبوة قابلة لإعادة الاستخدام.', price: 38, impact: 9, waste: 90, category: 'light', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80' }
];

window.CHARISMA_INTENTS = {
  taste: ['دبل كاريزما من غير تردد', 'اختيارك ده قريب من طلباتك السابقة، ومكوناته متاحة حاليًا.', 2],
  save: ['راب كاريزما على القد', 'أحسن قيمة في المنيو النهارده، ومعاه نقطة أثر زيادة عشان مكوناته متاحة.', 4],
  rescue: ['راب كاريزما ينقذ اليوم', 'المطبخ عنده مكونات مناسبة للراب دلوقتي. طلبك يساعدنا نستخدمها قبل ما تهدر.', 4],
  light: ['ليمون بالنعناع بعبوة راجعة', 'اختيار خفيف في التغليف، والعبوة تقدر ترجعها في طلبك الجاي.', 6]
};

// The menu editor stores a browser-local override so the owner can update
// prices and items without editing this file.
try {
  const savedMenu = JSON.parse(localStorage.getItem('charisma-menu-data') || 'null');
  if (Array.isArray(savedMenu) && savedMenu.length) {
    window.CHARISMA_MENU = savedMenu;
  }
} catch (error) {
  console.warn('تعذر تحميل تعديلات المنيو المحفوظة.', error);
}
