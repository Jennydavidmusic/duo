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
