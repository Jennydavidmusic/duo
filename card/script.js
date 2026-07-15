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


document.querySelectorAll(".short-card").forEach((card) => {
  const button = card.querySelector(".short-launch");
  const player = card.querySelector(".short-player");
  const videoId = card.dataset.videoId;

  if (!button || !player || !videoId) return;

  button.addEventListener("click", () => {
    document.querySelectorAll(".short-player iframe").forEach((frame) => {
      if (!player.contains(frame)) {
        frame.remove();
      }
    });

    document.querySelectorAll(".short-card").forEach((otherCard) => {
      if (otherCard !== card) {
        const otherButton = otherCard.querySelector(".short-launch");
        const otherPlayer = otherCard.querySelector(".short-player");
        if (otherButton && otherPlayer) {
          otherButton.hidden = false;
          otherPlayer.hidden = true;
          otherPlayer.innerHTML = "";
        }
      }
    });

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = "Jenny and David YouTube Short";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    player.innerHTML = "";
    player.appendChild(iframe);
    player.hidden = false;
    button.hidden = true;
  });
});
