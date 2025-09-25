console.log('sw started');

self.addEventListener('fetch', function(event) {
    const url = event.request.url;
    
    console.log('SW intercepted:', url);
    
    if (url.includes('/connect/service/auth0')) {
        console.log('OAUTH CALLBACK INTERCEPTED:', url);
        
        if (url.includes('code=')) {
            console.log('SUCCESS - CODE IN SERVICE WORKER:', url);
            
            event.waitUntil(
                self.clients.matchAll().then(function(clients) {
                    clients.forEach(function(client) {
                        client.postMessage({
                            type: 'OAUTH_SUCCESS',
                            url: url,
                            code: url.match(/code=([^&]+)/)?.[1]
                        });
                    });
                })
            );
        }
    }
    
    event.respondWith(fetch(event.request));
});
