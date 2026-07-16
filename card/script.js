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
(() => {

const video = document.getElementById("mainVideo");
const playButton = document.getElementById("mainPlayButton");
const box = document.querySelector(".main-video");

if(!video || !playButton || !box) return;


// clic directement sur la vidéo
video.addEventListener("click", () => {

  if(video.paused){
    video.play();
    box.classList.remove("show-play");
  } else {
    video.pause();
    box.classList.add("show-play");
  }

});


// bouton ▶ après pause
playButton.addEventListener("click", () => {

  video.muted = false;
  video.play();

  box.classList.remove("show-play");

});


// afficher le bouton seulement quand elle est arrêtée
video.addEventListener("pause", () => {

  if(!video.ended){
    box.classList.add("show-play");
  }

});


// cacher quand elle repart
video.addEventListener("play", () => {
  box.classList.remove("show-play");
});

})();
