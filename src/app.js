window.addEventListener("DOMContentLoaded", () => {
    init();

    // Work-around for cannot play music without user interaction.
    document.getElementById("music-start-btn").click();
});

function init() {
    const startBtn = document.getElementById("music-start-btn");
    const music = document.getElementById("background-music");

    startBtn.addEventListener("click", () => {
        music.volume = 0.2;
        music.repeat = true;
        music.play().then(() => {
            startBtn.style.display = "none";
        }).catch(() => {
            startBtn.style.display = "block";
        });
    });
}
