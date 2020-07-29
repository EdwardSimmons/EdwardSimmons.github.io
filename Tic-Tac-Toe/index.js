var board;
const humanPlayer = 'O';
const computerPlayer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]
const winDecoration = [
  'win-1',
  'win-2',
  'win-3',
  'win-8',
  'win-6',
  'win-7',
  'win-4',
  'win-5'
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
  document.querySelector(".end-game-box").style.display = "none";
  document.getElementById('win-strikes-group').style.zIndex = "-1";
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i in board) {
    document.getElementById(i).style.color = "black";
    if (i < 8) {
      document.getElementById(winDecoration[i]).style.display = "none";
    }
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background');
    cells[i].addEventListener('click', turnClick, false);
  }
  turn(bestSpot(), computerPlayer);
}

function turnClick(square) {
  if (typeof board[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer);
    if (!checkWin(board, humanPlayer) && !checkTie()) {
      turn(bestSpot(), computerPlayer);
    }
  }
}

function turn(squareId, player) {
  board[squareId] = player;
  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(board, player)
  if (gameWon) {
    gameOver(gameWon);
  } else {
    checkTie();
  }
}

function checkWin(board, player) {
  let plays = board.reduce((acc, e, i) =>
    (e === player) ? acc.concat(i) : acc, []);
  let gameWon = null;
  let winIndex = -1;
  for (let [index, winCondition] of winCombos.entries()) {
    winIndex ++;
    if (winCondition.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.color =
      gameWon.player === humanPlayer ? "green" : "red";
  }
  document.getElementById(winDecoration[gameWon.index]).style.display = "block";
  document.getElementById("win-strikes-group").style.zIndex = "2";
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  document.querySelector(".end-game-box").style.backgroundColor =
    gameWon.player === humanPlayer ? "green" : "red";
  declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}

function declareWinner(declaration) {
  document.querySelector(".end-game-box").style.display = 'block';
  document.querySelector(".end-game-box .end-game-text").innerText = declaration;
}

function emptySquares() {
  return board.filter(square => typeof square == 'number');
}

function bestSpot() {
  var randomIndex = Math.floor(Math.random() * emptySquares().length)
  return emptySquares()[randomIndex];
}

function checkTie() {
  if(emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "gray";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("It's a draw!")
    return true;
  }
}
