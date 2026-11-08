// Data layer: reads /data/*.json (committed in the repo). Falls back to demo-data.js
// when the JSON cannot be fetched (for example when index.html is opened straight from disk).
(function () {
  const D = window.PLAY_DEMO;
  const nowOk = o => o.is_active && new Date(o.ends_at) > new Date() && (!o.starts_at || new Date(o.starts_at) <= new Date());
  const stamp = Math.floor(Date.now() / 60000); // refresh cache about once a minute
  const cache = {};

  function load(name, fallback) {
    if (!cache[name]) {
      cache[name] = fetch('data/' + name + '.json?v=' + stamp)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .catch(() => fallback);
    }
    return cache[name];
  }

  window.PLAY_DATA = {
    live: true,
    categories: () => load('categories', D.categories),
    async products() { return (await load('products', D.products)).filter(p => p.is_active !== false); },
    async packages() { return (await load('packages', D.packages)).filter(p => p.is_active !== false); },
    async offers() { return (await load('offers', D.offers)).filter(nowOk); }
  };
})();
