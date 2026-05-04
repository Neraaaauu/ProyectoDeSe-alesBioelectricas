(() => {
    const root = location.pathname.includes("/pages/") ? "../" : "";
    const swUrl = root + "service-worker.js";
    const manifestUrl = root + "manifest.json";

    function ensureManifest() {
        if (document.querySelector('link[rel="manifest"]')) return;
        const link = document.createElement("link");
        link.rel = "manifest";
        link.href = manifestUrl;
        document.head.appendChild(link);
    }

    function ensureBanner() {
        let banner = document.getElementById("offlineStatusBanner");
        if (banner) return banner;

        banner = document.createElement("div");
        banner.id = "offlineStatusBanner";
        banner.setAttribute("role", "status");
        banner.style.cssText = [
            "position:fixed",
            "left:50%",
            "bottom:18px",
            "transform:translateX(-50%)",
            "z-index:10000",
            "max-width:min(92vw,520px)",
            "padding:10px 16px",
            "border-radius:999px",
            "font-family:Outfit,system-ui,sans-serif",
            "font-size:.88rem",
            "font-weight:700",
            "box-shadow:0 12px 32px rgba(0,0,0,.18)",
            "display:none",
            "text-align:center"
        ].join(";");
        document.body.appendChild(banner);
        return banner;
    }

    function setBanner() {
        const banner = ensureBanner();
        if (navigator.onLine) {
            banner.textContent = "Conexion restaurada. Modo completo disponible.";
            banner.style.background = "#e8f7ef";
            banner.style.color = "#17613c";
            banner.style.border = "1px solid rgba(23,97,60,.18)";
            banner.style.display = "block";
            window.setTimeout(() => {
                if (navigator.onLine) banner.style.display = "none";
            }, 2600);
            return;
        }

        banner.textContent = "Modo sin conexion: usando paginas y XML guardados en este navegador.";
        banner.style.background = "#fff4d6";
        banner.style.color = "#7a4b00";
        banner.style.border = "1px solid rgba(122,75,0,.18)";
        banner.style.display = "block";
    }

    async function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) return;
        if (!["http:", "https:"].includes(location.protocol)) return;

        try {
            const registration = await navigator.serviceWorker.register(swUrl, { scope: root || "./" });
            if (registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
        } catch (error) {
            console.warn("No se pudo activar el modo ligero offline:", error);
        }
    }

    window.addEventListener("online", setBanner);
    window.addEventListener("offline", setBanner);
    document.addEventListener("DOMContentLoaded", () => {
        ensureManifest();
        registerServiceWorker();
        if (!navigator.onLine) setBanner();
    });
})();
