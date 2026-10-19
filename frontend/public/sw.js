/**
 * devMatch Service Worker
 * Handles background push notifications and click interactions.
 */

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || '/favicon.ico',
            badge: '/favicon.ico', // Monochromatic version of icon
            tag: data.tag || 'devmatch-notification',
            renotify: true,
            data: data.data || { url: '/' },
            actions: [
                { action: 'open', title: 'Open devMatch' },
                { action: 'close', title: 'Dismiss' }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'close') return;

    // Open the relative URL from payloads (e.g., /chat/123)
    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // If already open, focus it
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
