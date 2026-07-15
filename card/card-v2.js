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


document.querySelectorAll(".interactive-button").forEach((button) => {
  const press = () => {
    button.classList.add("is-pressed");
  };

  const release = () => {
    window.setTimeout(() => {
      button.classList.remove("is-pressed");
    }, 220);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);

  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      press();
    }
  });

  button.addEventListener("keyup", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      release();
    }
  });

  button.addEventListener("click", () => {
    press();
    release();
  });
});
