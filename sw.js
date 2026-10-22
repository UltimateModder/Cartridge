// Cartridge service worker. Bump V to force clients to refresh the app shell.
const V='cartridge-v12',EJS='ejs-v1',SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==EJS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    // app files: network first so updates arrive, cache as the offline fallback
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})
      .catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./'):Response.error()))));
    return}
  if(u.hostname==='cdn.emulatorjs.org'){
    // emulator files: cache after first use so games can launch offline
    e.respondWith(caches.open(EJS).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))))}
});
