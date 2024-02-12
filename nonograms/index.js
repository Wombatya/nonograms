let interval;
let seconds = 0;
let minutes = 0;
let hours = 0;  
let isTimerOn = false;
const winSound = new Audio('./sounds/victory.mp3');
const exedSound = new Audio('./sounds/exed.mp3');
const filledSound = new Audio('./sounds/filled.mp3');
const unclickedSound = new Audio('./sounds/unclicked.mp3');

const container = document.createElement("div");
container.classList.add("container");
document.body.appendChild(container);

const upperPart = document.createElement("div");
upperPart.classList.add("upper-part");
container.appendChild(upperPart);

const upperWrapper = document.createElement("div");
upperWrapper.classList.add("upper-wrapper");
upperPart.appendChild(upperWrapper);

const soundWrapper = document.createElement("div");
soundWrapper.classList.add("sound-wrapper");
upperWrapper.appendChild(soundWrapper)

const soundOn = document.createElement("img");
soundOn.src = '../nonograms/img/sound-on.png';
soundOn.classList.add("sound-on-icon")
soundWrapper.appendChild(soundOn);

const soundOff = document.createElement("img");
soundOff.src = '../nonograms/img/sound-off.png';
soundOff.classList.add("sound-off-icon")
soundWrapper.appendChild(soundOff);

const timer = document.createElement("div");
timer.classList.add("timer");
timer.innerHTML = "00:00:00";
upperWrapper.appendChild(timer);

const darkTheme = document.createElement("div");
darkTheme.classList.add("dark-theme");
upperWrapper.appendChild(darkTheme);

const checkbox = document.createElement("INPUT");
checkbox.setAttribute("type", "checkbox");
checkbox.setAttribute("id", "dark");
darkTheme.appendChild(checkbox);

const label = document.createElement("label");
label.setAttribute("for", "dark");
label.innerText = "Dark Theme";
darkTheme.appendChild(label);

const middlePart = document.createElement("div");
middlePart.classList.add("middle-part");
container.appendChild(middlePart);

const middleLeftPart = document.createElement("div");
middleLeftPart.classList.add("middle-left-part");
middlePart.appendChild(middleLeftPart);

const levelsBtn = document.createElement("button");
levelsBtn.classList.add("levels");
levelsBtn.innerText = "Levels";
middleLeftPart.appendChild(levelsBtn);

const randomBtn = document.createElement("button");
randomBtn.classList.add("random");
randomBtn.innerText = "Random Game";
middleLeftPart.appendChild(randomBtn);

const middleCenterPart = document.createElement("div");
middleCenterPart.classList.add("middle-center-part");
middlePart.appendChild(middleCenterPart);

const boardWrapper = document.createElement("div");
boardWrapper.classList.add("board-wrapper");
middleCenterPart.appendChild(boardWrapper);

const board = document.createElement("div");
board.classList.add("board");
board.innerHTML = "Place for a board";
boardWrapper.appendChild(board);

const solutionBtn = document.createElement("button");
solutionBtn.classList.add("solution");
solutionBtn.innerText = "Show Solution";
boardWrapper.appendChild(solutionBtn);

const middleRightPart = document.createElement("div");
middleRightPart.classList.add("middle-right-part");
middlePart.appendChild(middleRightPart);

const saveBtn = document.createElement("button");
saveBtn.classList.add("save");
saveBtn.innerText = "Save Game";
middleRightPart.appendChild(saveBtn);

const continueBtn = document.createElement("button");
continueBtn.classList.add("continue");
continueBtn.innerText = "Continue Last Game";
middleRightPart.appendChild(continueBtn);

const resetBtn = document.createElement("button");
resetBtn.classList.add("reset");
resetBtn.innerText = "Reset Game";
middleRightPart.appendChild(resetBtn);

const lowerPart = document.createElement("div");
lowerPart.classList.add("lower-part");
container.appendChild(lowerPart);

class Square {
  constructor(game) {
    this.game = game;
    this.status = "unclicked";
    this.value = 0;
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.square = document.createElement("div");
    this.square.addEventListener("click", this.handleClick);
    this.square.addEventListener("contextmenu", this.handleRightClick);
  }

  handleClick() {
    switch (this.game.mouseMode) {
      case "cursor": {
        if (this.status === "filled") {
          this.status = "unclicked";
          this.value = 0;
          unclickedSound.play();
        } else {
          this.status = "filled";
          this.value = 1;
          filledSound.play();
        }
        break;
      }
      default: {
        if (this.status === "filled") {
          this.status = "unclicked";
          this.value = 0;
        } else {
          this.status = "filled";
          this.value = 1;
        }
        break;
      }
    }

    this.render();
    return;
  }

  handleRightClick(e) {
    e.preventDefault();
    if (this.status === "exed") {
      this.status = "unclicked";
      this.value = 0;
      unclickedSound.play();
    } else {
      this.status = "exed";
      this.value = 0;
      exedSound.play();
    }
    this.render();
    return;
  }

  render() {
    this.square.className = "square";
    this.square.className += ` ${this.status}`;
    return this.square;
  }
}

class Board {
  constructor(game, size, topNums, leftNums) {
    this.game = game;
    this.mouseMode = this.game.mouseMode;
    this.grid = this.makeGrid(size);
    this.populateGrid();

    this.topNums = topNums;
    this.leftNums = leftNums;
    this.board = document.querySelector(".board");
  }

  makeGrid(size) {
    let grid = [];
    for (let i = 0; i < size; i++) {
      grid.push(new Array(size));
    }
    return grid;
  }

  populateGrid() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let square = new Square(this.game);

        this.grid[i][j] = square;
      }
    }
  }

  findCurrentVals() {
    let vals = [];
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let sq = this.grid[i][j];
        vals.push(sq.value);
      }
    }
    return vals.join("");
  }

  render() {
    this.board.innerHTML = " ";
    if (!this.board) {
      console.log("NO Board");
    } else {
      let topNums = document.createElement("div");
      let leftNums = document.createElement("div");
      if (checkbox.checked) {
        topNums.classList.add("topNums");
        topNums.classList.add("dark");
        leftNums.classList.add("leftNums");
        leftNums.classList.add("dark");
      } else {
        topNums.classList.add("topNums");
        leftNums.classList.add("leftNums");
      }

      this.topNums.forEach((numArr) => {
        let nums = document.createElement("div");
        nums.innerHTML = numArr.join(" ");
        topNums.append(nums);
      });

      this.leftNums.forEach((numArr) => {
        let nums = document.createElement("div");
        nums.innerHTML = numArr.join(" ");
        leftNums.append(nums);
      });

      this.board.appendChild(topNums);
      this.board.appendChild(leftNums);

      let griddiv = document.createElement("div");
      if (checkbox.checked) {
        griddiv.classList.add("grid");
        griddiv.classList.add("dark");
      } else {
        griddiv.classList.add("grid");
      }

      for (let i = 0; i < this.grid.length; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row-div");
        for (let j = 0; j < this.grid[i].length; j++) {
          let square = this.grid[i][j];
          rowDiv.appendChild(square.render());
        }

        griddiv.appendChild(rowDiv);
      }
      this.board.appendChild(griddiv);

      return this.board;
    }
  }
}

class Level {
  constructor(name, size, valueString) {
    this.name = name;
    this.size = size;
    this.valueString = valueString;
    this.row = this.rowVals();
    this.col = this.colVals();
    this.topNums = this.getNums(this.col);
    this.leftNums = this.getNums(this.row);
    this.won = false;
  }

  rowVals() {
    let rowsArrays = [];

    let temp = [];
    for (let i = 0; i < this.valueString.length; i++) {
      if (temp.length < this.size) {
        temp.push(this.valueString[i]);
      }
      if (temp.length === this.size) {
        rowsArrays.push(temp);
        temp = [];
      } else if (i === this.valueString.length - 1) {
        rowsArrays.push(temp);
      }
    }

    return rowsArrays;
  }

  colVals() {
    let colsArrays = new Array(this.size);
    for (let i = 0; i < colsArrays.length; i++) {
      colsArrays[i] = [];
    }
    let i = 0;

    while (i < this.valueString.length) {
      let idx = i % this.size;

      colsArrays[idx].push(this.valueString[i]);
      i++;
    }

    return colsArrays;
  }

  getNums(vals) {
    let nums = [];

    for (let i = 0; i < vals.length; i++) {
      let temp = [];
      let count = 0;

      for (let j = 0; j < vals[i].length; j++) {
        if (vals[i][j] === "0") {
          if (count !== 0) {
            temp.push(count);
          }
          count = 0;
        }
        if (vals[i][j] === "1") {
          count += 1;
        }
      }
      if (count !== 0) {
        temp.push(count);
      }
      if (temp.length > 0) {
        nums.push(temp);
      } else if (temp.length === 0) {
        nums.push([0]);
      }
    }

    return nums;
  }

  revealPicture() {
    clearInterval(interval);
    winSound.play();
    endModalText.innerText =
  `Great!\n You have solved\n the nonogram\n in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    endModal.classList.add("active");
    if(checkbox.checked) {
        endModalContent.classList.add("dark");
        endModalText.classList.add("dark")
    } else {
        endModalContent.classList.remove("dark");
        endModalText.classList.remove("dark");
    }
  }
}

const tower = new Level("tower", 5, "1010111111011100101001110");
const snowflake = new Level("snowflake", 5, "1010101110110110111010101");
const airplane = new Level("airplane", 5, "0010001110111110010001110");
const skull = new Level("skull", 5, "0111011111101011111101010");
const hourglass = new Level("hourglass", 5, "1111101110001000101011111");
const tree = new Level(
  "tree",
  10,
  "0011111100011110111011111011111101110011111011111001111100000000111000000011000001001100011111111111"
);
const coffee = new Level(
  "coffee",
  10,
  "0010101000001010100000000000000111111100011011111101101111010111111110011111110010111110010111111110"
);
const tv = new Level(
  "tv",
  10,
  "0010000100000100100011111111111011000011111000000110100000011110000001111100001111111111110100000010"
);
const leaf = new Level(
  "leaf",
  10,
  "0000111111000101010100110101100101011010010101111001011000100111111110001000010001011110001100000000"
);
const music = new Level(
  "music",
  10,
  "0000001111000111000100010001110001111001000100000100010001110111001111111100111111110001100110000000"
);
const flower = new Level(
  "flower",
  15,
  "000110110000000000100011111000011100001001100110011100000100100001101001100111010000111000011100100010000001001110010000001111111110010110011011000001111001010011111101001110111111011100100111011001111101110110000001110011100"
);
const turtle = new Level(
  "turtle",
  15,
  "001011001100001001111101110000001011000110000000000000011000110011110011000111111011110000001111101110110011111111111111001111111110110111111111110000110011110111000000000000011010101100000110011111110001110010101100001100000"
);
const deer = new Level(
  "deer",
  15,
  "110110000001101110110100101101011110100101101001111100011111000011011111000000000111111100000001010111110000011111111111000111111111111001111111111111011111111011111010111000011111011111000011111001110000111111000000000111111"
);
const duck = new Level(
  "duck",
  15,
  "000000000111000000000001111100000000011110111000000011111110000000001111100000000000111000000000001111100100000111111110111001110001110111111101110110011111011110110011111111001100001111111111000000011011100000000000111111000"
);
const home = new Level(
  "home",
  15,
  "000000000000001000000000001100000010000000000000011000110000000010000110000000111111111000001111101010100011111110101010111111111111111010000000000010010111000011010010111011011010010000011000010010000011000010111111111111111"
);
currentIdx = 0;

class Game {
  constructor() {
    this.levels = [
      tower,
      snowflake,
      airplane,
      skull,
      hourglass,
      tree,
      coffee,
      tv,
      leaf,
      music,
      flower,
      turtle,
      deer,
      duck,
      home,
    ];
    this.boards = [];
    this.currentLevel = this.levels[currentIdx];
    this.currentBoard = this.createNewBoard();
    this.boards.push(this.currentBoard);
    this.boardDiv = document.querySelector(".board");
    this.boardDiv.addEventListener("click", () => this.update());
    this.mouseMode = "cursor";
  }


  isLevelWon(board) {
    console.log(this.currentLevel.valueString)
    if (this.currentLevel.valueString === board.findCurrentVals()) {
        console.log('got it')
      this.currentLevel.won = true;
      return true;
    } else {
      return false;
    }
  }

  createNewBoard() {
    let b = new Board(
      this,
      this.currentLevel.size,
      this.currentLevel.topNums,
      this.currentLevel.leftNums
    );
    return b;
  }

  update() {
    if (this.isLevelWon(this.currentBoard)) {
      setTimeout(this.currentLevel.revealPicture, 500);
    }
  }

  play() {
    this.currentBoard.render();
  }
}

const g = new Game();
g.play();

resetBtn.addEventListener("click", resetGame);

function resetGame() {
  const g = new Game();
  g.play();
}

const endModal = document.createElement("div");
endModal.classList.add("modal-end");
document.body.appendChild(endModal);

const endModalContent = document.createElement("div");
endModalContent.classList.add("modal-end-content");
endModal.appendChild(endModalContent);

const endModalText = document.createElement("div");
endModalText.classList.add("modal-end-text");
if(checkbox.checked) {
    endModalText.classList.add("dark")
} else {
    endModalText.classList.remove("dark");
}
endModalContent.appendChild(endModalText);

const resultsBtn = document.createElement("button");
resultsBtn.classList.add("results");
resultsBtn.innerText = "See the Results";
endModalContent.appendChild(resultsBtn);

const resultsModal = document.createElement("div");
resultsModal.classList.add("modal-results");
document.body.appendChild(resultsModal);

const resultsModalContent = document.createElement("div");
resultsModalContent.classList.add("modal-results-content");
resultsModal.appendChild(resultsModalContent);

const resultsModalHeading = document.createElement("div");
resultsModalHeading.classList.add("modal-results-heading");
resultsModalHeading.innerText = "Last 5 games:";
resultsModalContent.appendChild(resultsModalHeading);

const resultsChart = document.createElement("div");
resultsChart.classList.add("results-chart");
resultsModalContent.appendChild(resultsChart);

const newGameBtn = document.createElement("button");
newGameBtn.innerText = "Start a New Game";
resultsModalContent.appendChild(newGameBtn);

const levelsModal = document.createElement("div");
levelsModal.classList.add("modal-levels");
document.body.appendChild(levelsModal);

const levelsModalContent = document.createElement("div");
levelsModalContent.classList.add("modal-levels-content");
levelsModal.appendChild(levelsModalContent);

const fivesBtn = document.createElement("button");
fivesBtn.innerText = "5x5";
levelsModalContent.appendChild(fivesBtn);

const tensBtn = document.createElement("button");
tensBtn.innerText = "10x10";
levelsModalContent.appendChild(tensBtn);

const fifteensBtn = document.createElement("button");
fifteensBtn.innerText = "15x15";
levelsModalContent.appendChild(fifteensBtn);

levelsBtn.addEventListener("click", () => {
    levelsModal.classList.add("active");
    if(checkbox.checked) {
        levelsModalContent.classList.add("dark");
    } else {
        levelsModalContent.classList.remove("dark");
    }
    clearInterval(interval);
  seconds = 0;
  minutes = 0;
  hours = 0;
  timer.textContent = '00:00:00';
  isTimerOn = false;
});

const fivesModal = document.createElement("div");
fivesModal.classList.add("modal-fives");
document.body.appendChild(fivesModal);

const fivesModalContent = document.createElement("div");
fivesModalContent.classList.add("modal-fives-content");
fivesModal.appendChild(fivesModalContent);

const towerBtn = document.createElement("button");
towerBtn.innerText = "Tower";
fivesModalContent.appendChild(towerBtn);

const snowflakeBtn = document.createElement("button");
snowflakeBtn.innerText = "Snowflake";
fivesModalContent.appendChild(snowflakeBtn);

const airplaneBtn = document.createElement("button");
airplaneBtn.innerText = "Airplane";
fivesModalContent.appendChild(airplaneBtn);

const skullBtn = document.createElement("button");
skullBtn.innerText = "Skull";
fivesModalContent.appendChild(skullBtn);

const hourglassBtn = document.createElement("button");
hourglassBtn.innerText = "Hourglass";
fivesModalContent.appendChild(hourglassBtn);

fivesBtn.addEventListener("click", showFives);

function showFives() {
  levelsModal.classList.remove("active");
  fivesModal.classList.add("active");
  if(checkbox.checked) {
    fivesModalContent.classList.add("dark");
  } else {
    fivesModalContent.classList.remove("dark");
  }
}

towerBtn.addEventListener("click", () => {
  fivesModal.classList.remove("active");
  currentIdx = 0;
  const g = new Game();
  g.play();
  startTimer()
});

snowflakeBtn.addEventListener("click", () => {
  fivesModal.classList.remove("active");
  currentIdx = 1;
  const g = new Game();
  g.play();
  startTimer();
});

airplaneBtn.addEventListener("click", () => {
  fivesModal.classList.remove("active");
  currentIdx = 2;
  const g = new Game();
  g.play();
  startTimer();
});

skullBtn.addEventListener("click", () => {
  fivesModal.classList.remove("active");
  currentIdx = 3;
  const g = new Game();
  g.play();
  startTimer();
});

hourglassBtn.addEventListener("click", () => {
  fivesModal.classList.remove("active");
  currentIdx = 4;
  const g = new Game();
  g.play();
  startTimer();
});

const tensModal = document.createElement("div");
tensModal.classList.add("modal-tens");
document.body.appendChild(tensModal);

const tensModalContent = document.createElement("div");
tensModalContent.classList.add("modal-tens-content");
tensModal.appendChild(tensModalContent);

const treeBtn = document.createElement("button");
treeBtn.innerText = "Tree";
tensModalContent.appendChild(treeBtn);

const coffeeBtn = document.createElement("button");
coffeeBtn.innerText = "Coffee";
tensModalContent.appendChild(coffeeBtn);

const tvBtn = document.createElement("button");
tvBtn.innerText = "TV";
tensModalContent.appendChild(tvBtn);

const leafBtn = document.createElement("button");
leafBtn.innerText = "Leaf";
tensModalContent.appendChild(leafBtn);

const musicBtn = document.createElement("button");
musicBtn.innerText = "Music";
tensModalContent.appendChild(musicBtn);

tensBtn.addEventListener("click", showTens);

function showTens() {
  levelsModal.classList.remove("active");
  tensModal.classList.add("active");
  if(checkbox.checked) {
    tensModalContent.classList.add("dark");
} else {
    tensModalContent.classList.remove("dark");
}
}

treeBtn.addEventListener("click", () => {
  tensModal.classList.remove("active");
  currentIdx = 5;
  const g = new Game();
  g.play();
  startTimer();
});

coffeeBtn.addEventListener("click", () => {
  tensModal.classList.remove("active");
  currentIdx = 6;
  const g = new Game();
  g.play();
  startTimer();
});

tvBtn.addEventListener("click", () => {
  tensModal.classList.remove("active");
  currentIdx = 7;
  const g = new Game();
  g.play();
  startTimer();
});

leafBtn.addEventListener("click", () => {
  tensModal.classList.remove("active");
  currentIdx = 8;
  const g = new Game();
  g.play();
  startTimer();
});

musicBtn.addEventListener("click", () => {
  tensModal.classList.remove("active");
  currentIdx = 9;
  const g = new Game();
  g.play();
  startTimer();
});

const fifteensModal = document.createElement("div");
fifteensModal.classList.add("modal-fifteens");
document.body.appendChild(fifteensModal);

const fifteensModalContent = document.createElement("div");
fifteensModalContent.classList.add("modal-fifteens-content");
fifteensModal.appendChild(fifteensModalContent);

const flowerBtn = document.createElement("button");
flowerBtn.innerText = "Flower";
fifteensModalContent.appendChild(flowerBtn);

const turtleBtn = document.createElement("button");
turtleBtn.innerText = "Turtle";
fifteensModalContent.appendChild(turtleBtn);

const deerBtn = document.createElement("button");
deerBtn.innerText = "Deer";
fifteensModalContent.appendChild(deerBtn);

const duckBtn = document.createElement("button");
duckBtn.innerText = "Duck";
fifteensModalContent.appendChild(duckBtn);

const homeBtn = document.createElement("button");
homeBtn.innerText = "Home";
fifteensModalContent.appendChild(homeBtn);

fifteensBtn.addEventListener("click", showFifteens);

function showFifteens() {
  levelsModal.classList.remove("active");
  fifteensModal.classList.add("active");
  if(checkbox.checked) {
    fifteensModalContent.classList.add("dark");
} else {
    fifteensModalContent.classList.remove("dark");
}
}

flowerBtn.addEventListener("click", () => {
  fifteensModal.classList.remove("active");
  currentIdx = 10;
  const g = new Game();
  g.play();
  startTimer();
});

turtleBtn.addEventListener("click", () => {
  fifteensModal.classList.remove("active");
  currentIdx = 11;
  const g = new Game();
  g.play();
  startTimer();
});

deerBtn.addEventListener("click", () => {
  fifteensModal.classList.remove("active");
  currentIdx = 12;
  const g = new Game();
  g.play();
  startTimer();
});

duckBtn.addEventListener("click", () => {
  fifteensModal.classList.remove("active");
  currentIdx = 13;
  const g = new Game();
  g.play();
  startTimer();
});

homeBtn.addEventListener("click", () => {
  fifteensModal.classList.remove("active");
  currentIdx = 14;
  const g = new Game();
  g.play();
  startTimer();
});

randomBtn.addEventListener("click", randomGame);

function randomGame() {
  let random = Math.floor(Math.random() * (14 - 0 + 1)) + 0;
  currentIdx = random;
  clearInterval(interval);
  seconds = 0;
  minutes = 0;
  hours = 0;
  timer.textContent = '00:00:00';
  isTimerOn = false;
  const g = new Game();
  g.play();
  startTimer()
}



checkbox.addEventListener("click", () => {
  const buttons = document.querySelectorAll("button");
  const topNums = document.querySelector(".topNums");
  const leftNums = document.querySelector(".leftNums");
  const grid = document.querySelector(".grid");
  const squares = document.querySelectorAll(".square");
  if (checkbox.checked) {
    container.classList.add("dark");
    buttons.forEach((el) => el.classList.add("dark"));
    topNums.classList.add("dark");
    leftNums.classList.add("dark");
    grid.classList.add("dark");
    squares.forEach((square) => square.classList.add("dark"));
  } else {
    container.classList.remove("dark");
    buttons.forEach((el) => el.classList.remove("dark"));
    topNums.classList.remove("dark");
    leftNums.classList.remove("dark");
    grid.classList.remove("dark");
    squares.forEach((square) => square.classList.remove("dark"));
  }
});

function updateTime() {
  seconds++;
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }
  if (minutes === 60) {
    hours++;
    minutes = 0;
  }
  timer.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
let squares = document.querySelectorAll(".square")
squares.forEach((square) => {
    square.addEventListener('click', () => {
    if(!(isTimerOn)) {
    isTimerOn = true;
    interval = setInterval(updateTime, 1000);
    };
})
})
}

startTimer();

soundWrapper.addEventListener('click', () => {
    if (exedSound.muted) {
        winSound.muted = false;
        exedSound.muted = false;
        unclickedSound.muted = false;
        filledSound.muted = false;
        soundOn.classList.remove("nonactive");
        soundOff.classList.remove("active");
    }
    else {
        winSound.muted = true;
        exedSound.muted = true;
        unclickedSound.muted = true;
        filledSound.muted = true;
        soundOn.classList.add("nonactive");
        soundOff.classList.add("active");
    }
})

resultsBtn.addEventListener('click', () => {
    endModal.classList.remove("active");
    resultsModal.classList.add("active");
    if(checkbox.checked) {
        resultsModalContent.classList.add("dark");
        resultsModalHeading.classList.add("dark");
    } else {
        resultsModalContent.classList.remove("dark");
        resultsModalHeading.classList.remove("dark");
    }
})

newGameBtn.addEventListener('click', () => {
    resultsModal.classList.remove("active");
    randomGame();
});
