(() => {
  const video = document.getElementById("mainVideo");
  const button = document.getElementById("soundButton");
  const icon = document.getElementById("soundIcon");
  const text = document.getElementById("soundText");

  if (!video || !button || !icon || !text) return;

  const sync = () => {
    const muted = video.muted;
    button.setAttribute("aria-pressed", String(!muted));
    icon.textContent = muted ? "🔇" : "🔊";
    text.textContent = muted ? "Play sound" : "Mute";
  };

  button.addEventListener("click", async () => {
    video.muted = !video.muted;

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.warn("Video playback could not start.", error);
      }
    }

    sync();
  });

  video.addEventListener("volumechange", sync);
  sync();
})();


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.embed-box[data-yt-id]').forEach(box => {
    box.addEventListener('click', () => {
      const ytId = box.dataset.ytId;

      const iframe = document.createElement('iframe');
      const params = new URLSearchParams({ autoplay: "1", rel: "0" });

      if (window.location.origin && window.location.origin !== "null") {
        params.set("origin", window.location.origin);
      }

      iframe.src =
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(ytId)}?${params.toString()}`;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";

      box.innerHTML = "";
      box.appendChild(iframe);
    }, { once: true });
  });
});
