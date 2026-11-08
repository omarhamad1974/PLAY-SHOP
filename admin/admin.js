// PLAY admin: Supabase login (auth only) + data saved as JSON/images committed to GitHub.
(function () {
  const C = window.PLAY_CONFIG;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slugify = s => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  const show = id => ['loginView', 'setupView', 'appView'].forEach(v => $(v).classList.toggle('hidden', v !== id));

  // ---------- GitHub helpers ----------
  const tok = () => { try { return localStorage.getItem('play_gh_token') || ''; } catch (e) { return ''; } };
  const b64enc = str => { const b = new TextEncoder().encode(str); let s = ''; b.forEach(x => s += String.fromCharCode(x)); return btoa(s); };
  const b64dec = b64 => { const s = atob(b64.replace(/\n/g, '')); return new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt(0))); };
  async function gh(method, path, body) {
    const url = `https://api.github.com/repos/${C.GITHUB_OWNER}/${C.GITHUB_REPO}/contents/${path}` + (method === 'GET' ? `?ref=${encodeURIComponent(C.GITHUB_BRANCH)}&t=${Date.now()}` : '');
    const r = await fetch(url, { method, headers: { Authorization: 'Bearer ' + tok(), Accept: 'application/vnd.github+json' }, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 404 && method === 'GET') return null;
    if (!r.ok) { let m = r.status; try { m = (await r.json()).message || m; } catch (e) {} throw new Error('GitHub: ' + m); }
    return r.json();
  }

  // ---------- Data ----------
  const db = { categories: { items: [] }, products: { items: [] }, offers: { items: [] }, packages: { items: [] } };
  async function loadAll() {
    if (!C.GITHUB_OWNER || !C.GITHUB_REPO) throw new Error('Set GITHUB_OWNER and GITHUB_REPO in js/config.js');
    if (!tok()) throw new Error('Add your GitHub token first');
    for (const k of Object.keys(db)) {
      const f = await gh('GET', `data/${k}.json`);
      db[k] = f ? { items: JSON.parse(b64dec(f.content)), sha: f.sha } : { items: [], sha: undefined };
    }
  }
  async function saveData(k, msg) {
    const res = await gh('PUT', `data/${k}.json`, { message: msg, branch: C.GITHUB_BRANCH, sha: db[k].sha, content: b64enc(JSON.stringify(db[k].items, null, 2) + '\n') });
    db[k].sha = res.content.sha;
  }
  function cropToBase64(file, w, h) {
    return new Promise((resolve, reject) => {
      const img = new Image(), u = URL.createObjectURL(file);
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const r = Math.max(w / img.width, h / img.height), dw = img.width * r, dh = img.height * r;
        c.getContext('2d').drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh); // cover crop
        URL.revokeObjectURL(u);
        resolve(c.toDataURL('image/jpeg', 0.85).split(',')[1]);
      };
      img.onerror = () => reject(new Error('Could not read the image'));
      img.src = u;
    });
  }
  async function uploadImage(file, name, w, h) {
    const content = await cropToBase64(file, w, h);
    const path = `assets/products/${slugify(name) || 'item'}-${Date.now().toString(36)}.jpg`;
    await gh('PUT', path, { message: 'Add image ' + path, branch: C.GITHUB_BRANCH, content });
    return path;
  }

  // ---------- Entities ----------
  const catOpts = () => db.categories.items.map(c => [c.id, c.name_en]);
  const prodOpts = () => db.products.items.map(p => [p.id, p.name_en]);
  const prodName = id => (db.products.items.find(p => p.id === id) || {}).name_en || '?';
  const catName = id => (db.categories.items.find(c => c.id === id) || {}).name_en || '';
  const fmtDate = iso => { const d = new Date(iso); return isNaN(d) ? '' : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const ENT = {
    products: {
      title: 'Products', idp: 'p', slugFrom: 'name_en', img: [1000, 1250],
      cols: [['image_url', '', v => v ? `<img src="../${esc(v)}" class="w-10 h-12 object-cover">` : ''], ['name_en', 'Name'], ['category_id', 'Category', catName], ['price_egp', 'Price (EGP)'], ['is_active', 'Active', v => v === false ? 'No' : 'Yes']],
      fields: [['name_en', 'Name (EN)', 'text', 1], ['name_ar', 'Name (AR)', 'text'], ['category_id', 'Category', 'select', 0, catOpts], ['price_egp', 'Price (EGP)', 'number', 1],
        ['desc_en', 'Description (EN)', 'textarea', 0, null, 2], ['desc_ar', 'Description (AR)', 'textarea', 0, null, 2], ['image_url', 'Image (auto-cropped 4:5)', 'image', 0, null, 2],
        ['featured', 'Featured on home page', 'check'], ['is_active', 'Active (visible in shop)', 'check']],
      defaults: { is_active: true, featured: false }
    },
    categories: {
      title: 'Categories', idp: 'c', slugFrom: 'name_en',
      cols: [['name_en', 'Name'], ['name_ar', 'Arabic'], ['group_key', 'Group']],
      fields: [['name_en', 'Name (EN)', 'text', 1], ['name_ar', 'Name (AR)', 'text', 1], ['group_key', 'Group', 'select', 1, () => [['natural', 'Natural'], ['handmade', 'Handmade']]]],
      defaults: { group_key: 'natural' }
    },
    offers: {
      title: 'Offers of the Day', idp: 'o',
      cols: [['product_id', 'Product', prodName], ['discount_percent', 'Discount %'], ['ends_at', 'Ends', fmtDate], ['is_active', 'Active', v => v === false ? 'No' : 'Yes']],
      fields: [['product_id', 'Product', 'select', 1, prodOpts], ['discount_percent', 'Discount %', 'number', 1], ['ends_at', 'Last day of the offer', 'date', 1], ['is_active', 'Active', 'check']],
      defaults: { is_active: true, discount_percent: 15 }
    },
    packages: {
      title: 'Gift & Corporate Packages', idp: 'k', slugFrom: 'name_en', img: [1200, 900],
      cols: [['image_url', '', v => v ? `<img src="../${esc(v)}" class="w-12 h-9 object-cover">` : ''], ['name_en', 'Name'], ['kind', 'Type'], ['price_from_egp', 'From (EGP)'], ['min_qty', 'Min qty']],
      fields: [['name_en', 'Name (EN)', 'text', 1], ['name_ar', 'Name (AR)', 'text'], ['kind', 'Type', 'select', 1, () => [['gift', 'Gift'], ['corporate', 'Corporate']]], ['price_from_egp', 'Price from (EGP)', 'number'],
        ['min_qty', 'Minimum quantity', 'number'], ['is_active', 'Active', 'check'], ['desc_en', 'Description (EN)', 'textarea', 0, null, 2], ['desc_ar', 'Description (AR)', 'textarea', 0, null, 2], ['image_url', 'Image (auto-cropped 4:3)', 'image', 0, null, 2]],
      defaults: { kind: 'gift', min_qty: 1, is_active: true }
    }
  };
  // Inbox tabs (orders and quote requests) come from Supabase, shown first
  const ENT_INBOX = { orders: { title: 'Orders', inbox: true }, requests: { title: 'Quote Requests', inbox: true } };
  Object.assign(ENT_INBOX, ENT);
  Object.keys(ENT).forEach(k => delete ENT[k]); Object.assign(ENT, ENT_INBOX);
  let cur = 'orders', editing = null, pendingFile = null, sb = null;
  const inboxData = { orders: [], requests: [] };
  const TABLE = { orders: 'orders', requests: 'package_requests' };
  const STATUSES = ['new', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled'];
  const refOf = it => 'PLAY-' + String(it.id).replace(/-/g, '').slice(0, 6).toUpperCase();
  const fmtDT = iso => { const d = new Date(iso); return isNaN(d) ? '' : fmtDate(iso) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const waLink = phone => { let d = String(phone || '').replace(/\D/g, ''); if (d.startsWith('00')) d = d.slice(2); else if (d.startsWith('01') && d.length === 11) d = '2' + d; return 'https://wa.me/' + d; };
  const newCount = k => inboxData[k].filter(x => x.status === 'new').length;

  async function loadInbox() {
    if (!sb) return;
    for (const k of ['orders', 'requests']) {
      const { data, error } = await sb.from(TABLE[k]).select('*').order('created_at', { ascending: false }).limit(300);
      if (error) { setStatus('Orders: ' + error.message + ' (run supabase/orders.sql and add yourself to admins)', true); return; }
      inboxData[k] = data;
    }
  }
  function renderInbox() {
    const k = cur, items = inboxData[k];
    const cols = k === 'orders' ? ['Date', 'Ref', 'Customer', 'Phone', 'Total (EGP)', 'Status'] : ['Date', 'Ref', 'Contact', 'Company', 'Package', 'Qty', 'Status'];
    $('thead').innerHTML = '<tr>' + cols.map(c => `<th>${c}</th>`).join('') + '<th></th></tr>';
    $('tbody').innerHTML = items.map((it, i) => {
      const sel = `<select class="field" style="width:auto" data-st="${i}">${STATUSES.map(s => `<option ${s === it.status ? 'selected' : ''}>${s}</option>`).join('')}</select>`;
      const cells = k === 'orders'
        ? [fmtDT(it.created_at), refOf(it), esc(it.customer_name), esc(it.phone), esc(it.total_egp)]
        : [fmtDT(it.created_at), refOf(it), esc(it.contact_name), esc(it.company), esc(it.package_name), esc(it.quantity)];
      const detail = k === 'orders'
        ? `<b>Items</b><br>${(it.items || []).map(x => `${esc(x.qty)} x ${esc(x.name)} (EGP ${esc(x.price)})`).join('<br>')}<br><br>${esc(it.address)}, ${esc(it.city)}, ${esc(it.country)}<br>${esc(it.email)}<br>${esc(it.notes)}<br>Currency viewed: ${esc(it.currency)}`
        : `${esc(it.email)}<br>${esc(it.notes)}`;
      return `<tr class="${it.status === 'new' ? 'bg-amber-50' : ''}">${cells.map(c => `<td>${c}</td>`).join('')}<td>${sel}</td><td class="text-end whitespace-nowrap"><button data-view="${i}" class="link-u text-xs me-3">Details</button><a href="${waLink(it.phone)}" target="_blank" rel="noopener" class="link-u text-xs me-3">WhatsApp</a><button data-rm="${i}" class="text-xs text-clay link-u">Delete</button></td></tr>` +
        `<tr id="d${i}" class="hidden"><td colspan="${cols.length + 1}" class="bg-sand text-xs leading-relaxed">${detail}</td></tr>`;
    }).join('');
    $('emptyMsg').classList.toggle('hidden', items.length > 0);
    document.querySelectorAll('[data-st]').forEach(s => s.onchange = () => setInboxStatus(+s.dataset.st, s.value));
    document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => $('d' + b.dataset.view).classList.toggle('hidden'));
    document.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => delInbox(+b.dataset.rm));
  }
  async function setInboxStatus(i, status) {
    const it = inboxData[cur][i];
    const { error } = await sb.from(TABLE[cur]).update({ status }).eq('id', it.id);
    if (error) { setStatus(error.message, true); return; }
    it.status = status; setStatus('Status updated.'); renderTabs();
  }
  async function delInbox(i) {
    const it = inboxData[cur][i];
    if (!confirm('Delete ' + refOf(it) + '?')) return;
    const { error } = await sb.from(TABLE[cur]).delete().eq('id', it.id);
    if (error) return setStatus(error.message, true);
    inboxData[cur].splice(i, 1); render(); setStatus('Deleted.');
  }
  function exportCsv() {
    const k = cur, rows = inboxData[k];
    const head = k === 'orders'
      ? ['Date', 'Ref', 'Customer', 'Phone', 'Email', 'Address', 'City', 'Country', 'Total EGP', 'Status', 'Items']
      : ['Date', 'Ref', 'Contact', 'Company', 'Phone', 'Email', 'Package', 'Qty', 'Status', 'Notes'];
    const line = it => k === 'orders'
      ? [it.created_at, refOf(it), it.customer_name, it.phone, it.email, it.address, it.city, it.country, it.total_egp, it.status, (it.items || []).map(x => `${x.qty} x ${x.name}`).join('; ')]
      : [it.created_at, refOf(it), it.contact_name, it.company, it.phone, it.email, it.package_name, it.quantity, it.status, it.notes];
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const csv = '\ufeff' + [head, ...rows.map(line)].map(r => r.map(q).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `play-${k}-${fmtDate(new Date().toISOString())}.csv`; a.click();
  }

  // ---------- Rendering ----------
  function renderTabs() {
    const html = Object.keys(ENT).map(k => `<button class="tab whitespace-nowrap ${k === cur ? 'on' : ''}" data-tab="${k}">${ENT[k].title}${ENT[k].inbox && newCount(k) ? ` <span class="bg-clay text-white text-[10px] rounded-full px-1.5">${newCount(k)}</span>` : ''}</button>`).join('');
    $('tabs').innerHTML = html; $('tabsM').innerHTML = html;
    document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { cur = b.dataset.tab; render(); });
  }
  function render() {
    renderTabs();
    const e = ENT[cur];
    $('addBtn').classList.toggle('hidden', !!e.inbox); $('refreshBtn').classList.toggle('hidden', !e.inbox); $('csvBtn').classList.toggle('hidden', !e.inbox);
    $('entTitle').textContent = e.title;
    if (e.inbox) return renderInbox();
    const items = db[cur].items;
    $('entTitle').textContent = e.title;
    $('thead').innerHTML = '<tr>' + e.cols.map(c => `<th>${c[1]}</th>`).join('') + '<th></th></tr>';
    $('tbody').innerHTML = items.map((it, i) => '<tr>' + e.cols.map(c => `<td>${c[2] ? c[2](it[c[0]]) : esc(it[c[0]])}</td>`).join('') +
      `<td class="text-end whitespace-nowrap"><button class="link-u text-xs me-3" data-edit="${i}">Edit</button><button class="text-xs text-clay link-u" data-del="${i}">Delete</button></td></tr>`).join('');
    $('emptyMsg').classList.toggle('hidden', items.length > 0);
    document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openForm(+b.dataset.edit));
    document.querySelectorAll('[data-del]').forEach(b => b.onclick = () => del(+b.dataset.del));
  }
  function openForm(i) {
    const e = ENT[cur]; editing = i == null ? null : i; pendingFile = null;
    const it = i == null ? Object.assign({}, e.defaults) : db[cur].items[i];
    $('modalTitle').textContent = (i == null ? 'Add ' : 'Edit ') + e.title.replace(/s$/, '');
    $('formMsg').textContent = '';
    $('formFields').innerHTML = e.fields.map(([k, label, type, req, opts, span]) => {
      const cls = span === 2 ? 'col-span-2' : '';
      const v = it[k];
      let input;
      if (type === 'textarea') input = `<textarea id="f_${k}" rows="3" class="field">${esc(v)}</textarea>`;
      else if (type === 'select') input = `<select id="f_${k}" class="field">${opts().map(([val, lab]) => `<option value="${esc(val)}" ${val === v ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
      else if (type === 'check') input = `<label class="flex items-center gap-2 text-sm pt-5"><input type="checkbox" id="f_${k}" ${v ? 'checked' : ''}> ${label}</label>`;
      else if (type === 'date') input = `<input id="f_${k}" type="date" class="field" value="${esc(fmtDate(v))}">`;
      else if (type === 'image') input = `<div class="flex items-center gap-3"><div id="prev_${k}">${v ? `<img src="../${esc(v)}" class="h-16">` : ''}</div><input id="f_${k}" type="file" accept="image/*" class="text-xs"></div>`;
      else input = `<input id="f_${k}" type="${type}" ${type === 'number' ? 'step="any"' : ''} class="field" value="${esc(v)}" ${req ? 'required' : ''}>`;
      return `<div class="${cls}">${type === 'check' ? '' : `<label class="f">${label}${req ? ' *' : ''}</label>`}${input}</div>`;
    }).join('');
    const imgf = e.fields.find(f => f[2] === 'image');
    if (imgf) $('f_' + imgf[0]).onchange = ev => { pendingFile = ev.target.files[0] || null; if (pendingFile) $('prev_' + imgf[0]).innerHTML = `<img src="${URL.createObjectURL(pendingFile)}" class="h-16">`; };
    $('modal').classList.remove('hidden');
  }
  const closeForm = () => $('modal').classList.add('hidden');
  const setStatus = (m, bad) => { $('status').textContent = m; $('status').style.color = bad ? '#a8643f' : ''; };

  async function submitForm(ev) {
    ev.preventDefault();
    const e = ENT[cur], list = db[cur].items;
    const old = editing == null ? {} : list[editing];
    const obj = Object.assign({}, old);
    for (const [k, , type] of e.fields) {
      const el = $('f_' + k);
      if (type === 'check') obj[k] = el.checked;
      else if (type === 'number') obj[k] = el.value === '' ? null : parseFloat(el.value);
      else if (type === 'date') { if (el.value) { const [y, m, d] = el.value.split('-').map(Number); obj[k] = new Date(y, m - 1, d, 23, 59, 0).toISOString(); } }
      else if (type !== 'image') obj[k] = el.value.trim();
    }
    if (!obj.id) obj.id = uid(e.idp);
    if (e.slugFrom) {
      if (!obj.slug) obj.slug = slugify(obj[e.slugFrom]) || obj.id;
      if (list.some((x, i) => x.slug === obj.slug && i !== editing)) obj.slug += '-' + Date.now().toString(36).slice(-3);
    }
    if (cur === 'offers' && !obj.starts_at) obj.starts_at = new Date().toISOString();
    if (cur === 'offers' && !obj.ends_at) { $('formMsg').textContent = 'Choose the last day of the offer.'; return; }
    $('saveBtn').disabled = true; $('formMsg').textContent = 'Saving to GitHub...';
    try {
      if (pendingFile && e.img) obj.image_url = await uploadImage(pendingFile, obj.slug || obj.id, e.img[0], e.img[1]);
      if (editing == null) list.unshift(obj); else list[editing] = obj;
      await saveData(cur, `${editing == null ? 'Add' : 'Update'} ${cur}: ${obj.name_en || obj.id}`);
      closeForm(); render(); setStatus('Saved. The live site updates in about a minute.');
    } catch (err) {
      $('formMsg').textContent = err.message;
      await loadAll().catch(() => {}); render(); // resync after a conflict
    } finally { $('saveBtn').disabled = false; }
  }
  async function del(i) {
    const it = db[cur].items[i];
    if (!confirm('Delete "' + (it.name_en || it.id) + '"?')) return;
    try {
      db[cur].items.splice(i, 1);
      await saveData(cur, `Delete ${cur}: ${it.name_en || it.id}`);
      if (cur === 'products') { // remove offers pointing to this product
        const before = db.offers.items.length;
        db.offers.items = db.offers.items.filter(o => o.product_id !== it.id);
        if (db.offers.items.length !== before) await saveData('offers', 'Remove offers of deleted product');
      }
      render(); setStatus('Deleted. The live site updates in about a minute.');
    } catch (err) { setStatus(err.message, true); await loadAll().catch(() => {}); render(); }
  }

  // ---------- Boot ----------
  async function startApp() {
    show('appView');
    $('repoName').textContent = C.GITHUB_OWNER && C.GITHUB_REPO ? `${C.GITHUB_OWNER}/${C.GITHUB_REPO}` : '(set in js/config.js)';
    render();
    try { setStatus('Loading data from GitHub...'); await loadAll(); setStatus(''); render(); }
    catch (err) { setStatus(err.message, true); $('settings').classList.remove('hidden'); }
    await loadInbox(); render();
  }
  function init() {
    if (!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase)) return show('setupView');
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
    $('loginForm').onsubmit = async ev => {
      ev.preventDefault(); $('loginMsg').textContent = 'Signing in...';
      const { error } = await sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
      if (error) $('loginMsg').textContent = error.message; else { $('loginMsg').textContent = ''; startApp(); }
    };
    $('logoutBtn').onclick = async () => { await sb.auth.signOut(); show('loginView'); };
    $('settingsBtn').onclick = () => $('settings').classList.toggle('hidden');
    $('saveToken').onclick = async () => { try { localStorage.setItem('play_gh_token', $('token').value.trim()); } catch (e) {} $('token').value = ''; await startApp(); };
    $('addBtn').onclick = () => openForm(null);
    $('refreshBtn').onclick = async () => { await loadInbox(); render(); setStatus('Refreshed.'); };
    $('csvBtn').onclick = exportCsv;
    $('cancelBtn').onclick = closeForm;
    $('editForm').onsubmit = submitForm;
    sb.auth.getSession().then(({ data }) => data.session ? startApp() : show('loginView'));
  }
  init();
})();
