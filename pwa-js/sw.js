//skip-waiting activate a new service worker
const staticCacheName = 'site-static-v4'; //cache name
const dynamicCacheName = "site-dynamic-v5";

//static resources
const assets = [
    //all of these different requests
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    "/pages/fallback.html" //offline page
];

//cache size limit function 0> fetch event de size ı tanımla
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

//install service worker
self.addEventListener("install", evt => {
    // console.log("service worker has been installed")
    evt.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                console.log("cashing shell assets");
                cache.addAll(assets);
            })
    )
});

//activate service worker
//activated automatically
self.addEventListener("activate", evt => {
    //console.log("service worker has been acitaved")
    //waitUntil expect promise
    //key=cache
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys); //different cache names //keys=cacheNames
            return Promise.all(keys
                //dynamic cache silinmemesi için key !== dynamicCacheName eklenir çünkü dynamic cache de offline.html var !!
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                //mapping new array
                .map(key => caches.delete(key)) //delete old cache (site-static)
            )
        })
    )
});

//fetch events
//service worker can listen for and react to that event
//our serviceworker will be handling cashed assets and at some
//**if the request is inside our cache - return assets from the cache(install) that response
self.addEventListener("fetch", evt => {
    //if we dont have it in the cache => return cacheRes(offline experience)  => offline olduğu durumda index.html gelir ama about.html ve contact.html e ulaşılamaz çünkü assets de yalnızca index.html tanımlı
    //console.log("fetch event", evt)
    if (evt.request.url.indexOf("firestore.googleapis.com") === -1) {
        evt.respondWith(
            caches.match(evt.request)
                .then(cacheRes => {
                    return cacheRes || fetch(evt.request)
                        //dynamic caching - offline olduğu durumda about.html ve contact.html sayfalarına geçiş yapmayı sağlar
                        .then(fetchRes => {
                            return caches.open(dynamicCacheName)
                                .then(cache => {
                                    //cache.put(key ,value)
                                    cache.put(evt.request.url, fetchRes.clone());
                                    //limiting cashes size
                                    limitCacheSize(dynamicCacheName, 15)
                                    return fetchRes;
                                })
                        });
                }).catch(() => {
                    //conditional fallback
                    if (evt.request.url.indexOf(".html") > -1) {
                        return caches.match("/pages/fallback.html");
                    }
                })
        )
    }
});

//**serviceworker only works only over HTTP connections and localhost exceptions