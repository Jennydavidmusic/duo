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
  const stage = card.querySelector(".short-stage");
  const cover = card.querySelector(".short-cover");
  const videoId = card.dataset.videoId;

  if (!stage || !cover || !videoId) return;

  cover.addEventListener("click", () => {
    document.querySelectorAll(".short-card").forEach((otherCard) => {
      if (otherCard === card) return;

      const otherStage = otherCard.querySelector(".short-stage");
      const savedCover = otherCard._savedCover;

      if (otherStage && savedCover && otherStage.querySelector("iframe")) {
        otherStage.innerHTML = "";
        otherStage.appendChild(savedCover);
      }
    });

    const savedCover = cover;
    const iframe = document.createElement("iframe");

    iframe.src =
      `https://www.youtube-nocookie.com/embed/${videoId}` +
      `?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

    iframe.title = "Jenny and David live video";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    stage.innerHTML = "";
    stage.appendChild(iframe);

    card._savedCover = savedCover;
  });
});
