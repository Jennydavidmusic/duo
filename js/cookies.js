(function () {
  const KEY = "jd_cookie_consent"; // "accepted" | "rejected"

  function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function lsSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }

  function cookieGet(name){
    const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function cookieSet(name, value, days){
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + d.toUTCString() + "; path=/; SameSite=Lax";
  }

  function getConsent(){
    return lsGet(KEY) || cookieGet(KEY);
  }
  function setConsent(v){
    lsSet(KEY, v);
    cookieSet(KEY, v, 365);
  }

  function injectBanner(){
    if(document.getElementById("cookieBanner")) return;

    const banner = document.createElement("div");
    banner.id = "cookieBanner";
    banner.className = "cookie-banner";
    banner.setAttribute("role","dialog");
    banner.setAttribute("aria-live","polite");
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text">
          We use cookies only to enable embedded media (YouTube/Instagram). You can accept or refuse non-essential cookies.
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

  function showBanner(){ const b=document.getElementById("cookieBanner"); if(b) b.classList.add("show"); }
  function hideBanner(){ const b=document.getElementById("cookieBanner"); if(b) b.classList.remove("show"); }

  function replaceWithIframe(ph, src){
    const cls = ph.getAttribute("data-embed-class") || "";
    const w = ph.getAttribute("data-embed-width");
    const h = ph.getAttribute("data-embed-height");

    const iframe = document.createElement("iframe");
    if(cls) iframe.className = cls;
    iframe.setAttribute("src", src);
    iframe.setAttribute("frameborder","0");
    iframe.setAttribute("allowfullscreen","");
    iframe.setAttribute("loading","lazy");

    if(w) iframe.setAttribute("width", w);
    if(h) iframe.setAttribute("height", h);

    // If no explicit size, make it responsive-ish
    if(!w) iframe.style.width = "100%";
    if(!h) iframe.style.height = "315px";

    // Standard permissions
    iframe.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");

    ph.replaceWith(iframe);
  }

  function loadYouTubeEmbeds(){
    document.querySelectorAll("[data-yt-id]").forEach(ph => {
      const id = ph.getAttribute("data-yt-id");
      if(!id) return;
      replaceWithIframe(ph, "https://www.youtube.com/embed/" + id);
    });
  }

  function loadInstagramEmbeds(){
    document.querySelectorAll("[data-ig-src]").forEach(ph => {
      const src = ph.getAttribute("data-ig-src");
      if(!src) return;
      replaceWithIframe(ph, src);
    });
  }

  function loadAllEmbeds(){
    loadYouTubeEmbeds();
    loadInstagramEmbeds();
  }

  function acceptAndLoad(){
    setConsent("accepted");
    hideBanner();
    loadAllEmbeds();
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectBanner();

    const consent = getConsent();
    if(consent === "accepted"){
      loadAllEmbeds();
    } else if(!consent){
      showBanner();
    }

    document.addEventListener("click", (e) => {
      const t = e.target;

      if(t && t.id === "cookieAccept") acceptAndLoad();

      if(t && t.id === "cookieReject"){
        setConsent("rejected");
        hideBanner();
      }

      // Click on any placeholder button loads immediately (and accepts)
      if(t && t.classList && t.classList.contains("embed-accept")){
        acceptAndLoad();
      }
    });
  });
})();