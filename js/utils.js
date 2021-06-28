'use strict'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//count the amount of the mines around a cell
function countNeighbourMines(i, j, board) {

  var pos = { i: i, j: j }
  var currBoard = board;
  var minesNum = countMinesAround(currBoard, pos)
  return minesNum;
}

function countMinesAround(mat, pos) {
  var count = 0
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === pos.i && j === pos.j) continue
      var currCell = mat[i][j]
      if (currCell.isMine) {
        count++;
      }
    }
  }
  return count
}


function getRandMines(gLevelIdx) {
  var minesArr = [];
  var idx = getRandomInt(0, gLevel[gLevelIdx].SIZE);
  var jdx = getRandomInt(0, gLevel[gLevelIdx].SIZE);
  minesArr[0] = { i: idx, j: jdx };
  console.log(' befor the while - minesArr[0]', minesArr[0]);
  for (var num = 1; num < gLevel[gLevelIdx].MINES; num++) {

    idx = getRandomInt(0, gLevel[gLevelIdx].SIZE);
    jdx = getRandomInt(0, gLevel[gLevelIdx].SIZE);;
    while (isContainMine(minesArr, idx, jdx)) {              /// if the mine exiset in the minArr- get another mine
      idx = getRandomInt(0, gLevel[gLevelIdx].SIZE);
      jdx = getRandomInt(0, gLevel[gLevelIdx].SIZE);

      console.log(' minesArr insid the while in utils', minesArr);
      console.log('indexes of Mines inside the while', idx, jdx);
    }

    if (!isContainMine(minesArr, idx, jdx)) {

      console.log(' minesArr from utils after the while', minesArr);
      console.log('indexes of Mines from utils after the while', idx, jdx);
      minesArr.push({ i: idx, j: jdx });

    }
  }
  return minesArr;

}

function isContainMine(minesArr, idx, jdx) {
  for (var num = 0; num < minesArr.length; num++) {
    if ((minesArr[num].i === idx) && (minesArr[num].j === jdx)) {
      return true;
    }
  }
  return false;
}

function countTimer() {
  gTotalSeconds++;
  var hour = Math.floor(gTotalSeconds / 3600);
  var minute = Math.floor((gTotalSeconds - hour * 3600) / 60);
  var seconds = gTotalSeconds - (hour * 3600 + minute * 60);
  if (hour < 10)
    hour = "0" + hour;
  if (minute < 10)
    minute = "0" + minute;
  if (seconds < 10)
    seconds = "0" + seconds;
  gTime = hour + ":" + minute + ":" + seconds;
  document.querySelector(".timer").innerHTML = gTime;
}