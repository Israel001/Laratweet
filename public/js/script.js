let deferredPrompt;


if (!window.Promise) {
    window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => {
            console.log('Service worker registered!');
        });
} else {
    console.log('Service worker is not allowed');
}

window.addEventListener('beforeinstallprompt', event => {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});
