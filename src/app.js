window.addEventListener("DOMContentLoaded", (event) => {
    init();

    // Work-around for cannot play music without user interaction.
    document.getElementById("music-start-btn").click();
});

function init() {
    const startBtn = document.getElementById("music-start-btn");
    const music = document.getElementById("background-music");

    startBtn.addEventListener("click", () => {
        startBtn.style.display = "none";
        music.setAttribute('autoplay', 'autoplay');
        music.volume = 0.2;
        music.repeat = true;
        music.play();
    });
}
