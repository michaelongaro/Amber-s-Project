let socket = io();

let bpm = 0;
let circleID = 0;
let circleLoop = null;
const beat_sound = new Audio("./beat.mp3")
beat_sound.currentTime = 0;

const first = document.getElementById("first");
const second = document.getElementById("second");
const third = document.getElementById("third");

first.addEventListener("click", () => {
  changeSpeed("first");
})

second.addEventListener("click", () => {
  changeSpeed("second");
})

third.addEventListener("click", () => {
  changeSpeed("third");
})

function changeSpeed(id) {
  if (bpm < 0) return

  if (id == "first" && (bpm - 1 >= 0)) {
    bpm -= 10;
  } else if (id == "third") {
    bpm = 0;
  } else if (id == "second") {
    bpm += 10;
  }

  document.getElementById('bpm').innerHTML = bpm;
  socket.emit('button press', bpm);

  if (bpm === 0) {
    destroyCircleLoop()
    socket.emit("pause circles");
    return
  }

  createAndMoveCircle();
  socket.emit('create circle');
}

socket.on('render press', (new_val) => {
  let bpm_elem = document.getElementById('bpm');
  bpm = new_val;
  bpm_elem.innerHTML = new_val;
});

socket.on('render circle', () => {
  createAndMoveCircle();
});

socket.on('pause movement', () => {
  destroyCircleLoop();
});


function createAndMoveCircle() {
  if (circleLoop) {
    destroyCircleLoop();
  }

  circleLoop = setInterval(() => {
    circleID += 1;

    const circle = document.createElement("div");
    circle.className = "beat-circle";
    circle.id = `circle${circleID}`

    document.body.appendChild(circle);

    translateCircle(circleID);

    setTimeout(() => {
      squishCircle();
      beat_sound.play();
      beat_sound.currentTime = 0;
    }, 950);
    
  }, (60 / bpm) * 1000);
}

function destroyCircleLoop() {
  clearInterval(circleLoop);
  circleLoop = null;
}

function translateCircle(circle_no) {
  anime({
    targets: `#circle${circle_no}`,
    translateX: [0, -1 * (window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth)],
    duration: 2000,
    easing: "linear"
  });
}

function squishCircle() {
  anime({
    targets: "#center-beat-circle",
    scale: [.4, 1],
    duration: 300,
    easing: "linear"
  });
}

// function unsquishCircle() {
//   anime({
//     targets: "#center-beat-circle",
//     scale: [.75, 1],
//     duration: 500,
//     easing: "linear"
//   });
// }
