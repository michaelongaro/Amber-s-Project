

let socket = io();

const width = window.innerWidth || document.documentElement.clientWidth ||
  document.body.clientWidth;

let bpm = 0;
let circleID = 0;
let circleLoop = null;
const beat_sound = new Audio("./beat.mp3")

const first = document.getElementById("first");
const second = document.getElementById("second");
const third = document.getElementById("third");

first.addEventListener("click", ()=> {
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

socket.on('render press', (new_val)=> {
  let bpm_elem = document.getElementById('bpm');
  bpm = new_val;
  bpm_elem.innerHTML = new_val;
});

socket.on('render circle', ()=> {
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
    // create new circle
    circleID += 1;

    const circle = document.createElement("div");
    circle.className = "beat-circle";
    circle.id = `circle${circleID}`

    document.body.appendChild(circle);

    translateCircle(circleID);
    setTimeout(()=> { 
      beat_sound.play() 
    }, ((60 / bpm) * 1000));
  }, (60 / bpm) * 1000);
}

function destroyCircleLoop() {
  clearInterval(circleLoop);
  circleLoop = null;
}


function translateCircle(circle_no) {
  anime({
    targets: `#circle${circle_no}`,
    translateX: [0, -1 * width],
    duration: 1500,
    easing: "linear"
  });
}


// let bubblyButtons = document.getElementsByClassName("bubbly-button");

// for (var i = 0; i < bubblyButtons.length; i++) {
//   bubblyButtons[i].addEventListener('click', animateButton, false);
// }



// (function() {
//   window.accurateInterval = function(time, fn) {
//     var cancel, nextAt, timeout, wrapper, _ref;
//     nextAt = new Date().getTime() + time;
//     timeout = null;
//     if (typeof time === 'function') _ref = [time, fn], fn = _ref[0], time = _ref[1];

//     wrapper = function() {
//       nextAt += time;
//       timeout = setTimeout(wrapper, nextAt - new Date().getTime());
//       return fn();
//     };
//     cancel = function() {
//       return clearTimeout(timeout);
//     };
//     timeout = setTimeout(wrapper, nextAt - new Date().getTime());
//     return {
//       cancel: cancel
//     };
//   };
// }).call(this);

// Use like setTimeout
  // var timer = accurateInterval(function() {
  //   console.log('message you will see every second!');
  // }, 1000);