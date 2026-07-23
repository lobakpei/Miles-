/* AcreMiles service worker — 同源 network-first（保資料新鮮），斷網先食 cache。
   每次改版要跟住升 CACHE 名，舊 cache 自動清。 */
var CACHE = 'acremiles-v6.79.0';
var CORE = ['./', './index.html', './share-meta.js', './data/source-registry.js', './data/cards-official.js', './data/card-channels.js', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './share/itinerary/', './share/plan/', './img/og-earn-plan.jpg', './img/og-redeem-itinerary.jpg', './img/pgW0-planner.webp', './img/thumb-pgG2.webp', './img/thumb-pgO2.webp', './img/thumb-pgW11.webp', './img/thumb-banner-follow.webp', './img/pgG1-hero.jpg', './img/pgG1-steps.jpg', './img/pgG2-cards.jpg', './img/pgG3-hero.jpg', './img/pgG8-hero.jpg', './img/pgG4-hero.jpg', './img/pgW0-hero.jpg',
  './img/pgW6-hero.jpg',
  './img/pgW13-hero.jpg',
  './img/pgW8-hero.jpg',
  './img/pgW10-hero.jpg',
  './img/pgW11-hero.jpg',
  './img/pgR1-hero.jpg',
  './img/pgR2-hero.jpg',
  './img/pgG5-hero.jpg',
  './img/pgO1-hero.jpg',
  './img/pgO2-hero.jpg',
  './img/pgG6-hero.jpg',
  './img/pgO4-hero.jpg',
  './img/pgO5-hero.jpg',
  './img/pgG7-hero.jpg',
  './img/pgG8-yq.jpg',
  './img/pgW6-mid.jpg',
  './img/pgW10-mid.jpg',
  './img/pgW13-mid.jpg', './img/pgO3-hero.jpg', './img/banner-sub.jpg', './img/banner-follow.jpg'];
self.addEventListener('install', function(e){
  /* 逐個 cache，單一檔案 404 唔會拖冧成個 SW 安裝（唔用 addAll 嘅原子性）*/
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(CORE.map(function(u){
      return c.add(u).catch(function(err){ console.warn('SW cache 跳過', u, err); });
    }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if (k !== CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function(res){
      /* 只 cache 成功回應（200），唔好將 404 存落 cache */
      if (res && res.ok){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(hit){
        if (hit) return hit;
        if (e.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
