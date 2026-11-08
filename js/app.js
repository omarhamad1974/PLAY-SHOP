// Shared app logic: i18n, currency, cart, header/footer, product card.
(function () {
  const C = window.PLAY_CONFIG;
  const P = (window.PLAY = {});
  const store = {
    get: (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  P.lang = store.get('play_lang', 'en');
  P.cur = store.get('play_cur', 'EGP');

  const T = {
    en: {
      shop: 'Shop', natural: 'Natural', handmade: 'Handmade', gifts: 'Gifts & Corporate', offers: 'Offers',
      cart: 'Cart', all: 'All', hero_eyebrow: 'Egyptian craft, thoughtfully made',
      hero_title: 'Pure materials.<br>Honest craft.', hero_cta: 'Shop the collection',
      shop_by: 'Shop by category', offer_day: 'Offer of the Day', ends_in: 'Ends in', featured: 'Featured',
      gifts_title: 'Gifts & corporate packages', gifts_text: 'Curated boxes and giveaways for your clients, team and events, with your branding.',
      gifts_cta: 'Explore packages', add: 'Add to cart', added: 'Added to cart', qty: 'Quantity', off: 'off',
      sort: 'Sort', newest: 'Newest', price_low: 'Price: low to high', price_high: 'Price: high to low',
      no_items: 'Nothing here yet.', back: 'Back to shop', from: 'From', min_order: 'Minimum order',
      request_quote: 'Request a quote', company: 'Company (optional)', name: 'Full name', email: 'Email', phone: 'Phone / WhatsApp',
      notes: 'Notes', quantity: 'Quantity', send: 'Send request', sent: 'Thank you, we will contact you shortly.',
      gift_pkg: 'Gift packages', corp_pkg: 'Corporate & giveaways', pkg_title: 'Gifts & Corporate',
      pkg_text: 'Beautifully packed Egyptian products for every occasion, from a single gift to hundreds of giveaways.',
      your_cart: 'Your cart', empty_cart: 'Your cart is empty.', total: 'Total', remove: 'Remove',
      checkout: 'Delivery details', address: 'Address', city: 'City', country: 'Country', place_order: 'Place order',
      order_done: 'Order received. We will contact you to confirm payment and delivery.',
      payment: 'Payment', pay_manual: 'InstaPay / Vodafone Cash / Bank transfer', wa_order: 'Or order on WhatsApp',
      footer_text: 'Egyptian natural and handmade products.',
      shop_all: 'Shop all', required: 'Please fill the required fields.', error: 'Something went wrong, please try again.',
      order_ref: 'Order reference', order_thanks: 'Thank you, your order is received',
      order_next: 'We will contact you to confirm. To speed things up, send your payment receipt on WhatsApp and quote your reference.',
      send_receipt: 'Send receipt on WhatsApp', continue: 'Continue shopping', back_cart: 'Back to cart',
      almost: 'Almost done', save_failed: 'We could not save your order online. Please send it on WhatsApp to complete it.',
      wa_complete: 'Please send your order on WhatsApp to complete it.', wait: 'Please wait a few seconds before sending again.',
      req_thanks: 'Request received', req_next: 'Our team will contact you shortly.', wa_chat: 'Chat on WhatsApp', wa_send: 'Send on WhatsApp'
    },
    ar: {
      shop: 'تسوق', natural: 'طبيعي', handmade: 'يدوي', gifts: 'الهدايا والشركات', offers: 'العروض',
      cart: 'السلة', all: 'الكل', hero_eyebrow: 'حرفة مصرية بعناية',
      hero_title: 'خامات نقية.<br>صنعة صادقة.', hero_cta: 'تسوق المجموعة',
      shop_by: 'تسوق حسب الفئة', offer_day: 'عرض اليوم', ends_in: 'ينتهي خلال', featured: 'مختارات',
      gifts_title: 'باقات الهدايا والشركات', gifts_text: 'صناديق وهدايا منتقاة لعملائك وفريقك ومناسباتك مع علامتك التجارية.',
      gifts_cta: 'استعرض الباقات', add: 'أضف إلى السلة', added: 'تمت الإضافة إلى السلة', qty: 'الكمية', off: 'خصم',
      sort: 'ترتيب', newest: 'الأحدث', price_low: 'السعر: من الأقل', price_high: 'السعر: من الأعلى',
      no_items: 'لا توجد منتجات بعد.', back: 'العودة للمتجر', from: 'ابتداءً من', min_order: 'الحد الأدنى للطلب',
      request_quote: 'اطلب عرض سعر', company: 'الشركة (اختياري)', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف / واتساب',
      notes: 'ملاحظات', quantity: 'الكمية', send: 'إرسال الطلب', sent: 'شكراً لك، سنتواصل معك قريباً.',
      gift_pkg: 'باقات الهدايا', corp_pkg: 'هدايا الشركات والمناسبات', pkg_title: 'الهدايا والشركات',
      pkg_text: 'منتجات مصرية مغلفة بأناقة لكل مناسبة، من هدية واحدة إلى مئات الهدايا.',
      your_cart: 'سلتك', empty_cart: 'سلتك فارغة.', total: 'الإجمالي', remove: 'حذف',
      checkout: 'بيانات التوصيل', address: 'العنوان', city: 'المدينة', country: 'الدولة', place_order: 'تأكيد الطلب',
      order_done: 'تم استلام طلبك. سنتواصل معك لتأكيد الدفع والتوصيل.',
      payment: 'الدفع', pay_manual: 'إنستاباي / فودافون كاش / تحويل بنكي', wa_order: 'أو اطلب عبر واتساب',
      footer_text: 'منتجات مصرية طبيعية ويدوية.',
      shop_all: 'تسوق الكل', required: 'يرجى ملء الحقول المطلوبة.', error: 'حدث خطأ، حاول مرة أخرى.',
      order_ref: 'رقم الطلب', order_thanks: 'شكراً لك، تم استلام طلبك',
      order_next: 'سنتواصل معك للتأكيد. لتسريع الأمر أرسل إيصال الدفع عبر واتساب مع ذكر رقم الطلب.',
      send_receipt: 'أرسل الإيصال عبر واتساب', continue: 'متابعة التسوق', back_cart: 'العودة إلى السلة',
      almost: 'أوشكنا على الانتهاء', save_failed: 'تعذر حفظ طلبك عبر الإنترنت. يرجى إرساله عبر واتساب لإتمامه.',
      wa_complete: 'يرجى إرسال طلبك عبر واتساب لإتمامه.', wait: 'يرجى الانتظار بضع ثوانٍ قبل الإرسال مرة أخرى.',
      req_thanks: 'تم استلام طلبك', req_next: 'سيتواصل معك فريقنا قريباً.', wa_chat: 'تحدث معنا على واتساب', wa_send: 'أرسل عبر واتساب'
    }
  };
  P.t = k => (T[P.lang] && T[P.lang][k]) || T.en[k] || k;
  P.pick = (o, f) => (o && (o[f + '_' + P.lang] || o[f + '_en'])) || '';
  P.money = egp => P.cur === 'USD'
    ? '$' + (egp * C.USD_RATE).toFixed(egp * C.USD_RATE < 10 ? 2 : 0)
    : (P.lang === 'ar' ? Math.round(egp).toLocaleString('ar-EG') + ' ج.م' : 'EGP ' + Math.round(egp).toLocaleString('en-US'));
  P.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---- price with offer
  P.offerFor = (p, offers) => (offers || []).find(o => o.product_id === p.id);
  P.finalPrice = (p, offers) => {
    const o = P.offerFor(p, offers);
    return o ? Math.round(p.price_egp * (100 - o.discount_percent) / 100) : p.price_egp;
  };

  // ---- cart
  P.cartGet = () => { try { return JSON.parse(store.get('play_cart', '[]')); } catch (e) { return []; } };
  P.cartSet = c => { store.set('play_cart', JSON.stringify(c)); P.renderCount(); };
  P.cartAdd = (item, qty) => {
    const c = P.cartGet(); const ex = c.find(i => i.id === item.id);
    if (ex) ex.qty += qty; else c.push(Object.assign({ qty }, item));
    P.cartSet(c); P.toast(P.t('added'));
  };
  P.renderCount = () => {
    const n = P.cartGet().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = n; el.style.display = n ? 'inline-flex' : 'none'; });
  };
  P.toast = msg => {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg;
    document.body.appendChild(d); setTimeout(() => d.remove(), 2600);
  };

  // ---- product card
  P.card = (p, offers) => {
    const o = P.offerFor(p, offers); const fp = P.finalPrice(p, offers);
    const img = p.image_url
      ? `<img src="${P.esc(p.image_url)}" alt="${P.esc(P.pick(p, 'name'))}" loading="lazy">`
      : `<div class="ph w-full h-full">${P.esc(P.pick(p, 'name'))}</div>`;
    return `<a href="product.html?slug=${encodeURIComponent(p.slug)}" class="card block">
      <div class="card-img relative">${img}${o ? `<span class="badge">-${o.discount_percent}%</span>` : ''}</div>
      <div class="pt-4 text-center">
        <h3 class="font-serif text-xl">${P.esc(P.pick(p, 'name'))}</h3>
        <p class="text-sm mt-1">${o ? `<span class="text-stone line-through me-2">${P.money(p.price_egp)}</span>` : ''}<span>${P.money(fp)}</span></p>
      </div></a>`;
  };

  // ---- saving orders / requests (Supabase insert-only, no login)
  P.sbClient = () => {
    if (P._sb === undefined) {
      P._sb = (C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase)
        ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
    }
    return P._sb;
  };
  P.save = async (table, row) => {
    const sb = P.sbClient(); if (!sb) return { skipped: true };
    try { const { error } = await sb.from(table).insert(row); return { error }; } catch (e) { return { error: e }; }
  };
  P.uuid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  P.ref = id => 'PLAY-' + String(id).replace(/-/g, '').slice(0, 6).toUpperCase();
  P.throttle = () => { const last = +store.get('play_last_submit', '0'); if (Date.now() - last < 15000) return false; store.set('play_last_submit', String(Date.now())); return true; };

  // ---- layout
  function header() {
    const l = P.lang;
    return `<div class="bg-ink text-white text-center text-[11px] tracking-widest py-2">${l === 'ar' ? 'شحن لجميع أنحاء مصر والعالم' : 'SHIPPING ACROSS EGYPT & WORLDWIDE'}</div>
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div class="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <button class="md:hidden text-2xl" id="menuBtn" aria-label="menu">&#9776;</button>
        <nav class="hidden md:flex gap-7 text-sm flex-1">
          <a href="products.html">${P.t('shop')}</a>
          <a href="products.html?group=natural">${P.t('natural')}</a>
          <a href="products.html?group=handmade">${P.t('handmade')}</a>
          <a href="packages.html">${P.t('gifts')}</a>
          <a href="products.html?offers=1" class="text-clay">${P.t('offers')}</a>
        </nav>
        <a href="index.html" class="font-serif text-3xl tracking-[0.35em] md:absolute md:left-1/2 md:-translate-x-1/2 ${l === 'ar' ? '' : 'ps-[0.35em]'}">PLAY</a>
        <div class="flex items-center gap-4 text-sm flex-1 justify-end">
          <button id="curBtn" class="text-xs border border-line px-2 py-1">${P.cur === 'EGP' ? 'USD $' : 'EGP'}</button>
          <button id="langBtn" class="text-xs border border-line px-2 py-1">${l === 'ar' ? 'EN' : 'عربي'}</button>
          <a href="cart.html" class="flex items-center gap-1">${P.t('cart')} <span data-cart-count class="bg-ink text-white text-[10px] rounded-full w-5 h-5 items-center justify-center" style="display:none"></span></a>
        </div>
      </div>
      <nav id="mobileNav" class="hidden md:hidden border-t border-line px-5 py-4 flex-col gap-3 text-sm">
        <a href="products.html">${P.t('shop')}</a><a href="products.html?group=natural">${P.t('natural')}</a>
        <a href="products.html?group=handmade">${P.t('handmade')}</a><a href="packages.html">${P.t('gifts')}</a>
        <a href="products.html?offers=1" class="text-clay">${P.t('offers')}</a>
      </nav>
    </header>`;
  }
  function footer() {
    return `<footer class="border-t border-line mt-24 bg-sand">
      <div class="max-w-7xl mx-auto px-5 py-14 grid md:grid-cols-3 gap-10 text-sm">
        <div><div class="font-serif text-2xl tracking-[0.3em] mb-3">PLAY</div><p class="text-stone">${P.t('footer_text')}</p></div>
        <div class="flex flex-col gap-2"><a href="products.html">${P.t('shop')}</a><a href="packages.html">${P.t('gifts')}</a><a href="products.html?offers=1">${P.t('offers')}</a></div>
        <div class="flex flex-col gap-2"><a href="https://wa.me/${C.WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a><span class="text-stone">${P.pick({ a_en: 'Cairo, Egypt', a_ar: 'القاهرة، مصر' }, 'a')}</span></div>
      </div>
      <div class="text-center text-xs text-stone pb-8">&copy; ${new Date().getFullYear()} PLAY</div>
    </footer>`;
  }
  P.mount = () => {
    document.documentElement.lang = P.lang;
    document.documentElement.dir = P.lang === 'ar' ? 'rtl' : 'ltr';
    const h = document.getElementById('app-header'), f = document.getElementById('app-footer');
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = P.t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = P.t(el.dataset.i18nPh); });
    P.renderCount();
    const mb = document.getElementById('menuBtn'), mn = document.getElementById('mobileNav');
    if (mb) mb.onclick = () => { mn.classList.toggle('hidden'); mn.classList.toggle('flex'); };
    document.getElementById('langBtn').onclick = () => { P.lang = P.lang === 'ar' ? 'en' : 'ar'; store.set('play_lang', P.lang); P.refresh(); };
    document.getElementById('curBtn').onclick = () => { P.cur = P.cur === 'EGP' ? 'USD' : 'EGP'; store.set('play_cur', P.cur); P.refresh(); };
  };
  // Pages register a render function; it runs on load and after language/currency changes.
  P.page = fn => { P._render = fn; P.refresh(); };
  P.refresh = async () => { P.mount(); if (P._render) await P._render(); };
  P.param = k => new URLSearchParams(location.search).get(k);
  P.whatsapp = text => `https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent(text)}`;
})();
