const CACHE_VERSION = "biosiglab-light-v1";
const CORE_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./assets/css/basestyle.css",
    "./assets/css/style.css",
    "./assets/css/contacto.css",
    "./assets/js/offline.js",
    "./assets/js/script.js",
    "./assets/js/biometrics.js",
    "./assets/js/faceauth.js",
    "./assets/js/xlsx.full.min.js",
    "./pages/usuario.html",
    "./pages/adminlogin.html",
    "./pages/Ondas.html",
    "./pages/explorar.html",
    "./pages/protocolo.html",
    "./pages/equipo.html",
    "./pages/contactos.html",
    "./pages/prueba0.xml",
    "https://cdn.jsdelivr.net/npm/chart.js",
    "https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js",
    "https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js",
    "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js"
];

const HTML_FALLBACK = "./index.html";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => Promise.allSettled(CORE_CACHE.map((url) => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys
                .filter((key) => key !== CACHE_VERSION)
                .map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        event.respondWith(cacheFirst(request));
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(networkFirst(request, HTML_FALLBACK));
        return;
    }

    const isStatic = /\.(?:css|js|xml|png|jpg|jpeg|webp|svg|ico|json)$/i.test(url.pathname);
    event.respondWith(isStatic ? cacheFirst(request) : networkFirst(request));
});

async function cacheFirst(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response && response.status < 400) cache.put(request, response.clone());
    return response;
}

async function networkFirst(request, fallbackUrl) {
    const cache = await caches.open(CACHE_VERSION);
    try {
        const response = await fetch(request);
        if (response && response.status < 400) cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) return cached;
        if (fallbackUrl) return cache.match(fallbackUrl);
        throw error;
    }
}
