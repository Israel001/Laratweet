importScripts('/js/idb.js');
importScripts('/js/utility.js');

const CACHE_STATIC_NAME = 'static-v5';
const CACHE_DYNAMIC_NAME = 'dynamic-v6';

self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(cache => {
                console.log('[Service Worker] Precaching App Shell');
                cache.add('/offline');
                cache.add('/');
                cache.add('/js/promise.js');
                cache.add('/js/fetch.js');
                cache.add('/js/idb.js');
            })
    )
});

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker ...', event);
    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }))
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response ? response : fetch(event.request)
                    .then(res => {
                        return caches.open(CACHE_DYNAMIC_NAME)
                            .then(cache => {
                                cache.put(event.request.url, res.clone());
                                return res;
                            })
                    })
                    .catch(err => {
                        return caches.open(CACHE_STATIC_NAME)
                            .then(cache => {
                                if (event.request.headers.get('accept').includes('text/html')) {
                                    return cache.match('/offline')
                                }
                                return cache.match('/offline');
                            })
                    });
            })
    );
});

self.addEventListener('sync', event => {
    console.log('[Service Worker] Background Syncing', event);
    if (event.tag === 'sync-new-posts') {
        console.log('[Service Worker] Syncing new Posts');
        event.waitUntil(
            readAllData('sync-posts')
                .then(data => {
                    for (let dt of data) {
                        fetch('/posts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-CSRF-TOKEN': dt.token
                            },
                            body: JSON.stringify({
                                file: dt.file,
                                text: dt.text
                            })
                        }).then(response => {
                            console.log('from syncing post', response);
                            if (response.ok) {
                                deleteItemFromData('sync-posts', dt.id);
                            }
                        }).catch(err => console.log('error from syncing post', err));
                    }
                })
        );
    }
});
