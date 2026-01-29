(function () {
  const KEY = "jd_cookie_consent"; // "accepted" | "rejected"

  // ---------- Storage helpers ----------
  function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function lsSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }

  function cookieGet(name){
    const safe = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const m = document.cookie.match(new RegExp("(?:^|; )" + safe + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function cookieSet(name, value, days){
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      "; expires=" + d.toUTCString() +
      "; path=/; SameSite=Lax";
  }

  function getConsent(){
    return lsGet(KEY) || cookieGet(KEY);
  }

  function setConsent(v){
    lsSet(KEY, v);
    cookieSet(KEY, v, 365);
  }

  // ---------- Banner ----------
  function injectBanner(){
    if (document.getElementById("cookieBanner")) return;

    const banner = document.createElement("div");
    banner.id = "cookieBanner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text">
          We use cookies only to enable embedded media (YouTube & Instagram).
          You can accept or refuse non-essential cookies.
          <a href="privacy.html" class="cookie-banner__link">Learn more</a>
        </p>
        <div class="cookie-banner__buttons">
          <button type="button" id="cookieAccept" class="cookie-btn cookie-btn--accept">Accept</button>
          <button type="button" id="cookieReject" class="cookie-btn cookie-btn--reject">Reject</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }

  function showBanner(){
    const b = document.getElementById("cookieBanner");
    if (b) b.classList.add("show");
  }

  function hideBanner(){
    const b = document.getElementById("cookieBanner");
    if (b) b.classList.remove("show");
  }

  // ---------- Embed loader ----------
  function replaceWithIframe(ph, src){
    const cls = ph.getAttribute("data-embed-class") || "";
    const height = ph.getAttribute("data-embed-height") || "315px";

    const iframe = document.createElement("iframe");
    if (cls) iframe.className = cls;

    iframe.src = src;
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("loading", "lazy");
    iframe.style.width = "100%";
    iframe.style.height = height;
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    );

    ph.replaceWith(iframe);
  }

  function loadYouTubeEmbeds(){
    // placeholders must have: data-yt-id="VIDEOID"
    document.querySelectorAll("[data-yt-id]").forEach(ph => {
      const id = ph.getAttribute("data-yt-id");
      if (!id) return;
      // nocookie domain is better for GDPR + often more stable
      replaceWithIframe(ph, "https://www.youtube-nocookie.com/embed/" + id);
    });
  }

  function loadInstagramEmbeds(){
    // placeholders must have: data-ig-src="https://www.instagram.com/p/.../embed"
    document.querySelectorAll("[data-ig-src]").forEach(ph => {
      const src = ph.getAttribute("data-ig-src");
      if (!src) return;
      replaceWithIframe(ph, src);
    });
  }

  function loadAllEmbeds(){
    loadYouTubeEmbeds();
    loadInstagramEmbeds();
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    injectBanner();

    const consent = getConsent();
    if (consent === "accepted") {
      loadAllEmbeds();
    } else if (!consent) {
      showBanner();
    }

    document.addEventListener("click", (e) => {
      const t = e.target;

      // Accept
      if (t && t.id === "cookieAccept") {
        setConsent("accepted");
        hideBanner();
        loadAllEmbeds();
        return;
      }

      // Reject (hard block)
      if (t && t.id === "cookieReject") {
        setConsent("rejected");
        hideBanner();
        return;
      }

      // Per-video button (must NOT bypass refusal)
      // Use <button class="embed-accept">Play</button> inside placeholders
      if (t && t.classList && t.classList.contains("embed-accept")) {
        const current = getConsent();

        // Refused -> do nothing (optionally show banner)
        if (current === "rejected") {
          showBanner();
          return;
        }

        // No choice -> show banner, do not load
        if (!current) {
          showBanner();
          return;
        }

        // Accepted -> load
        if (current === "accepted") {
          loadAllEmbeds();
          return;
        }
      }
    });
  });
})();
