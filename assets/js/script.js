ID = Date.now().toString();
document.addEventListener("DOMContentLoaded", function () {
  sendHeartBeat();
  try {
    response = fetch("https://api.ch3n.cc/currentsong/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let duration = formatTime(data.duration);
        title.innerHTML = data.song;
        artist.innerHTML = data.artist;
        views.innerHTML = data.viewers;
        cover.src = data.cover;
        totaltime.innerHTML = duration;
      });
  } catch (error) {
    console.log(error);
  }
  const overlay = document.getElementById("overlay");

  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    getCurrentSong();
  });

  title = document.querySelector(".track-title");
  artist = document.querySelector(".track-artist");
  elapsedtime = document.getElementById("elapsedtime");
  totaltime = document.getElementById("totaltime");
  progressbar = document.querySelector(".progress-bar");
  views = document.getElementById("viewCount");
  cover = document.getElementById("cover");
  volume = document.getElementById("volume-btn");
  audio = document.getElementById("audio");
  audio.addEventListener("ended", function () {
    getCurrentSong();
  });
});

function playSong(url, timestamp) {
  audio.src = url;
  audio.currentTime = timestamp;
  audio.play();
  setInterval(() => {
    let progress = (audio.currentTime / audio.duration) * 100;
    document.querySelector(".progress-bar").style.width = progress + "%";
    document.getElementById("elapsedtime").innerHTML = formatTime(
      audio.currentTime
    );
  }, 1000);
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

function getCurrentSong() {
  try {
    response = fetch("https://api.ch3n.cc/currentsong/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let duration = formatTime(data.duration);
        title.innerHTML = data.song;
        artist.innerHTML = data.artist;
        views.innerHTML = data.viewers;
        cover.src = data.cover;
        totaltime.innerHTML = duration;
        playSong(data.url, data.timestamp);
      });
  } catch (error) {
    console.log(error);
  }
}

function mute() {
  if (audio.muted) {
    audio.muted = false;
    volume.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
  } else {
    audio.muted = true;
    volume.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
  }
}

function sendHeartBeat() {
  fetch("https://api.ch3n.cc/currentsong/heartbeat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: ID,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      views.innerHTML = data.viewers;
    });
}

setInterval(() => {
  sendHeartBeat();
}, 10000);
