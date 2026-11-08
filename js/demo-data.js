// Demo data used until Supabase is connected. Shape matches supabase/schema.sql.
(function () {
  const end = new Date(); end.setHours(23, 59, 59, 0);
  const cats = [
    { id: 'c1', slug: 'natural-soaps', group_key: 'natural', name_en: 'Natural Soaps', name_ar: 'صابون طبيعي' },
    { id: 'c2', slug: 'natural-oils', group_key: 'natural', name_en: 'Natural Oils', name_ar: 'زيوت طبيعية' },
    { id: 'c3', slug: 'carpets', group_key: 'handmade', name_en: 'Handmade Carpets', name_ar: 'سجاد يدوي' },
    { id: 'c4', slug: 'pottery', group_key: 'handmade', name_en: 'Pottery', name_ar: 'فخار' }
  ];
  const prods = [
    { id: 'p1', slug: 'olive-laurel-soap', category_id: 'c1', name_en: 'Olive & Laurel Soap', name_ar: 'صابونة الزيتون والغار', desc_en: 'Cold-pressed olive oil soap, cured for eight weeks. Gentle on skin.', desc_ar: 'صابون زيت زيتون معصور على البارد، معتق ثمانية أسابيع. لطيف على البشرة.', price_egp: 180, featured: true },
    { id: 'p2', slug: 'honey-oat-soap', category_id: 'c1', name_en: 'Siwa Honey & Oat Soap', name_ar: 'صابونة عسل سيوة والشوفان', desc_en: 'Handcut bar with raw honey and oats for soft, nourished skin.', desc_ar: 'قالب مقطع يدوياً بعسل خام وشوفان لبشرة ناعمة ومغذاة.', price_egp: 210, featured: false },
    { id: 'p3', slug: 'black-seed-oil', category_id: 'c2', name_en: 'Black Seed Oil 100ml', name_ar: 'زيت حبة البركة ١٠٠ مل', desc_en: 'Cold-pressed Egyptian black seed oil in a dark glass bottle.', desc_ar: 'زيت حبة البركة المصري المعصور على البارد في زجاجة داكنة.', price_egp: 320, featured: true },
    { id: 'p4', slug: 'argan-jojoba-oil', category_id: 'c2', name_en: 'Jojoba Face Oil 50ml', name_ar: 'زيت الجوجوبا للوجه ٥٠ مل', desc_en: 'Pure jojoba from Sinai, light and fast absorbing.', desc_ar: 'جوجوبا نقية من سيناء، خفيفة وسريعة الامتصاص.', price_egp: 390, featured: false },
    { id: 'p5', slug: 'akhmim-wool-rug', category_id: 'c3', name_en: 'Hand-Knotted Wool Rug', name_ar: 'سجادة صوف معقودة يدوياً', desc_en: 'Pure wool rug hand-knotted by artisans. 160 x 230 cm.', desc_ar: 'سجادة من الصوف الخالص معقودة يدوياً بأيدي حرفيين. ١٦٠ × ٢٣٠ سم.', price_egp: 24500, featured: true },
    { id: 'p6', slug: 'kilim-runner', category_id: 'c3', name_en: 'Kilim Runner', name_ar: 'كليم ممر', desc_en: 'Flat-woven kilim runner in natural dyes. 70 x 250 cm.', desc_ar: 'كليم منسوج مسطح بأصباغ طبيعية. ٧٠ × ٢٥٠ سم.', price_egp: 9800, featured: false },
    { id: 'p7', slug: 'fayoum-vase', category_id: 'c4', name_en: 'Fayoum Clay Vase', name_ar: 'مزهرية فخار الفيوم', desc_en: 'Wheel-thrown vase with a matte glaze, made in Tunis Village.', desc_ar: 'مزهرية مشكلة على عجلة الفخار بطلاء مطفي، من قرية تونس.', price_egp: 1450, featured: true },
    { id: 'p8', slug: 'hand-painted-bowl', category_id: 'c4', name_en: 'Hand-Painted Bowl', name_ar: 'وعاء مرسوم يدوياً', desc_en: 'Serving bowl painted by hand, each piece is unique.', desc_ar: 'وعاء تقديم مرسوم يدوياً وكل قطعة فريدة.', price_egp: 780, featured: false }
  ];
  window.PLAY_DEMO = {
    categories: cats,
    products: prods.map(p => Object.assign({ image_url: null, is_active: true }, p)),
    offers: [
      { id: 'o1', product_id: 'p3', discount_percent: 20, ends_at: end.toISOString(), is_active: true },
      { id: 'o2', product_id: 'p1', discount_percent: 15, ends_at: end.toISOString(), is_active: true }
    ],
    packages: [
      { id: 'k1', slug: 'welcome-box', kind: 'gift', name_en: 'Welcome Gift Box', name_ar: 'صندوق الهدية الترحيبي', desc_en: 'Two soaps, one oil and a small clay dish in a handmade box.', desc_ar: 'صابونتان وزيت وطبق فخار صغير في صندوق يدوي.', min_qty: 1, price_from_egp: 950, image_url: null },
      { id: 'k2', slug: 'executive-set', kind: 'corporate', name_en: 'Executive Giveaway Set', name_ar: 'طقم هدايا الشركات', desc_en: 'Curated set for clients and partners, with your logo on the packaging.', desc_ar: 'طقم مختار للعملاء والشركاء مع شعارك على التغليف.', min_qty: 25, price_from_egp: 780, image_url: null },
      { id: 'k3', slug: 'event-favors', kind: 'corporate', name_en: 'Event Favors', name_ar: 'تذكارات المناسبات', desc_en: 'Small handmade favors for conferences, weddings and launches.', desc_ar: 'تذكارات يدوية صغيرة للمؤتمرات والأفراح والإطلاقات.', min_qty: 100, price_from_egp: 120, image_url: null }
    ]
  };
})();
