let socket = io();

let bpm = 0;
let circleID = 0;
let circleLoop = null;
const beat_sound = new Audio("./beat.mp3")
beat_sound.currentTime = 0;

const first = document.getElementById("first");
const second = document.getElementById("second");
const third = document.getElementById("third");
const secretContainer = document.getElementById("secret-container");
const sixtyNine = document.getElementById("sixty-nine");

let x = 200;
let y = 0;

let width = window.innerWidth || document.documentElement.clientWidth ||
  document.body.clientWidth;
let height = window.innerHeight || document.documentElement.clientHeight ||
  document.body.clientHeight


first.addEventListener("click", () => {
  changeSpeed("first");
})

second.addEventListener("click", () => {
  changeSpeed("second");
})

third.addEventListener("click", () => {
  changeSpeed("third");
})

sixtyNine.addEventListener("click", () => {
  changeSpeed("69");
})

secretContainer.addEventListener("mouseover", () => {
  sixtyNine.style.display = "block";

  glideButtonToLocation();
})


function changeSpeed(id) {

  if (id == "first" && (bpm - 10 >= 0)) {
    bpm -= 10;
  } else if (id == "first" && (bpm - 10 <= 0)) {
    bpm = 0;
  } else if (id == "third") {
    bpm = 0;
  } else if (id == "second") {
    bpm += 10;
  } else if (id == "69") {
    bpm = 69;
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

function randomizeSpecialButtonLocation() {
  // x = 200;
  x = Math.floor(Math.random() * (width - 100) + 50)
  while (x > (width/2 - 200) && x < (width/2 + 200)) {
    x = Math.floor(Math.random() * (width - 100) + 50)
  }
  y = Math.floor(Math.random() * (700 - 50) + 50)
  console.log(x, y);
  secretContainer.style.left = `${x}px`;
  secretContainer.style.top = `${y}px`;
}

function glideButtonToLocation() {
  let negWidth = -1 * (width/2);
  let negHeight = -1 * 500;
  if (x < width/2) {
    negWidth *= -1;
    negWidth -= x;
  } else {
    negWidth += x;
    negWidth *= -1;
  }
  if (y < 500) {
    negHeight *= -1;
    negHeight -= y;
  } else {
    negHeight += y;
    negHeight *= -1;
  }

  anime({
    targets: "#sixty-nine",
    translateX: (negWidth - 50),
    translateY: (negHeight - 10),
    // scale: [1, 1.5, 1],
    rotate: '1turn',
    // maybe find way to make it fucking EXPAND and then go back to normal...
    duration: 1000,
    easing: "easeOutQuad"
  });
}

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

randomizeSpecialButtonLocation();
// function unsquishCircle() {
//   anime({
//     targets: "#center-beat-circle",
//     scale: [.75, 1],
//     duration: 500,
//     easing: "linear"
//   });
// }
