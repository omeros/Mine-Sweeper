'use strict'

const BOMB = '💣';
const FLAG = '🚩';
const FAILS = 3;

var gLevelIdx = 0;
var gBoard;
var gMinesArr = [];

// for timer
var gTime = 0;
var gTimerVar;
var gTotalSeconds = 0;
var gisFirstCliked = true;

var gLevel = [
    { SIZE: 4, MINES: 2 },
    { SIZE: 8, MINES: 12 },
    { SIZE: 12, MINES: 30 }
];

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    markSuccess: 0,
    life: 3
}

function initGame() {
    gGame.isOn = true;
    gGame.markedCount = 0;
    gGame.markSuccess = 0;
    gTime = 0;
    gTotalSeconds = 0;
    gTimerVar = null;
    gGame.life = 3;
    gisFirstCliked = true;
    var el = document.querySelector('.outcome')
    el.innerHTML = 'Mine Sweeper';
    gBoard = buildBoard();
    renderBoard(gBoard)
    // var el = document.querySelector('.timer');
    // el.style.width = "200px";
}

function buildBoard() {
    var level = gLevel[gLevelIdx].SIZE;
    gMinesArr = getRandMines(gLevelIdx);
    var board = [];
    for (var i = 0; i < level; i++) {
        board.push([]);
        for (var j = 0; j < level; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: true,
                isMine: false,
                isMarked: true
            };;
        }
    }
    for (var num = 0; num < gMinesArr.length; num++) {
        var idx = gMinesArr[num].i;
        var jdx = gMinesArr[num].j;
        console.log(' gMinesArr from main', gMinesArr);
        console.log('indexes of Mines fom main', idx, jdx);
        board[idx][jdx].isMine = true;
    }
    for (var i = 0; i < level; i++) {
        for (var j = 0; j < level; j++) {
            var numNeighbours = countNeighbourMines(i, j, board);
            board[i][j].minesAroundCount = numNeighbours;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = ''
    var level = gLevel[gLevelIdx].SIZE;
    for (var i = 0; i < level; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < level; j++) {
            strHTML += `<td data-i="${i}"  data-j="${j}" class = cell onmousedown="WhichButton(event,this,${i},${j})")"   > </td>  `
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}
/****************************** cell clicked ***************************************** */
function cellClicked(elCell, i, j) {
/************************************************************************************** */
    while (((!gGame.isOn) && (gBoard[i][j].isMine === true)) || ((gBoard[i][j].minesAroundCount > 0) && (!gGame.isOn))) {
        initGame();
    }
    gGame.isOn = true;
    if ((gBoard[i][j].isMine === true)) {
        // if (!elCell.innerHTML==BOMB){
        elCell.innerHTML = BOMB
        checkGameOver(elCell)
        // }
        return
    } else if (gBoard[i][j].minesAroundCount) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
        elCell.classList.add('hid')
        if ((gGame.markSuccess === (gMinesArr.length)) && (allCellsShown())) {
            winner();
        }
        return
    } else {
        emptyClicked(elCell, i, j);     // run the recursion
    }

}

//******************************* Recursion Search ************************************************** */
function emptyClicked(elCell, i, j) {
    //********************************************************************************** */
    if ((i < 0) || (j < 0) || (i > gBoard.length - 1) || (j > gBoard[0].length - 1)) {
        return;
    } else if (gBoard[i][j].isMine) {
        return;
    } else if (elCell.classList.contains("hid")) {
        return;
    } else if (elCell.innerHTML === FLAG) {
        return
    } else if (gBoard[i][j].minesAroundCount > 0) {
        cellClicked(elCell, i, j);
        return;
    } else if (gBoard[i][j].minesAroundCount === 0) {
        elCell.classList.add('hid')
        var idx = i + 1;
        var jdx = j
        var elNextDownMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextDownMove, idx, jdx);
        idx = i - 1
        jdx = j
        var elNextUpMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextUpMove, idx, jdx)
        idx = i;
        jdx = j + 1;
        var elNextRigthMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextRigthMove, idx, jdx)
        idx = i
        jdx = j - 1
        var elNextLeftMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextLeftMove, idx, jdx)
        idx = i - 1
        jdx = j + 1
        var elNextRigthUPMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextRigthUPMove, idx, jdx)
        idx = i + 1
        jdx = j - 1
        var elNextLeftDownMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextLeftDownMove, idx, jdx)
        idx = i + 1
        jdx = j + 1
        var elNextRigthDownMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextRigthDownMove, idx, jdx)
        idx = i - 1
        jdx = j - 1
        var elNextLeftUpMove = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        emptyClicked(elNextLeftUpMove, idx, jdx)
    }

}

function cellMarked(elCell) {

}

function checkGameOver() {
    //gGame.life++;
    gGame.life--;
    var elLife = document.querySelector('.life');
    var l = gGame.life;
    elLife.innerHTML = 'LIFE : ' + l;
    if (gGame.life === 0) {
        gameOver();
    }
}

function expandShown(board, elCell, i, j) {
}


//*********************************** Button clicked *********************************************  */
function WhichButton(event, elCell, i, j) {
 /********************************************************************************************************* */
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
    if (!gGame.isOn) {
        return
    }
    if (gisFirstCliked) {
        gTimerVar = setInterval(countTimer, 1000);
        gisFirstCliked = false;
    }
    if (event.button === 0) {
        if (elCell.innerHTML === FLAG) {
            return
        } else {
            cellClicked(elCell, i, j);
        }
    } else if (event.button == 2) {                  // rigth clicked
        event.preventDefault();
        event.stopPropagation();
        if (elCell.classList.contains('hid')) {
            return
        } else if (elCell.innerHTML === FLAG) {
            elCell.innerHTML = ""
            gGame.markedCount--;
            console.log('gGame.markedCount', gGame.markedCount)
            if (containMine(i, j)) {
                gGame.markSuccess--
                console.log('gGame.markSuccess  1', gGame.markSuccess)
            }
        } else {                                                // rigth clicked on Not a FLAG
            elCell.innerHTML = FLAG;
            gGame.markedCount++;
            if (containMine(i, j)) {                  //       <=====================  rigth clicked on  a FLAG 
                gGame.markSuccess++;
                console.log('gGame.markSuccess  2 ', gGame.markSuccess);
                if ((gGame.markSuccess === (gMinesArr.length)) && (allCellsShown())) {
                    console.log('gGame.markSuccess in winning 3', gGame.markSuccess)
                    console.log('minesArr.length', gMinesArr.length)
                    winner();
                }
            }
        }
    }

}



function containMine(idx, jdx) {
    for (var num = 0; num < gMinesArr.length; num++) {
        if ((gMinesArr[num].i === idx) && (gMinesArr[num].j === jdx)) {
            return true
        }
    }
    return false;
}


function winner() {
    var el = document.querySelector('.outcome')
    el.innerHTML = 'WINNER !';
    console.log('gTimerVar', gTimerVar)
    clearInterval(gTimerVar);
    console.log('gTimerVar after clearing in winner', gTimerVar)
    document.querySelector(".timer").innerHTML = gTime;
    gGame.isOn = false;
}

function gameOver() {
    var idx = 0;
    var jdx = 0;
    for (var num = 0; num < gMinesArr.length; num++) {
        idx = gMinesArr[num].i;
        jdx = gMinesArr[num].j;
        var elMines = document.querySelector('[data-i="' + idx + '"][data-j="' + jdx + '"]');
        elMines.innerHTML = BOMB;
    }
    console.log('gMinesArr insid GAME OVER  - 2', gMinesArr);
    console.log('gTimerVar in game over', gTimerVar)
    clearInterval(gTimerVar);
    console.log('gTimerVar after clearing in game over', gTimerVar)
    document.querySelector(".timer").innerHTML = gTime;
    var el = document.querySelector('.outcome')
    gGame.isOn = false;
    el.innerHTML = 'GAME OVER !';
}


function easy(elButton) {
    gLevelIdx = 0;
    if (gTimerVar) {
        console.log('gTimerVar', gTimerVar)
        clearInterval(gTimerVar);
        document.querySelector(".timer").innerHTML = gTime;
    }
    var el = document.querySelector('.timer');
    el.style.width = "200px";
    el = document.querySelector('h1');
    el.style.width = "200px";
    el = document.querySelector('.life');
    el.style.left = '630px'
    el.innerHTML = 'LIFE : 3';
    document.querySelector(".timer").innerHTML = '00:00:00';
    initGame();
}

function hard() {
    gLevelIdx = 1;
    if (gTimerVar) {
        console.log('gTimerVar', gTimerVar)
        clearInterval(gTimerVar);
        document.querySelector(".timer").innerHTML = gTime;
    }
    var el = document.querySelector('.timer');
    el.style.width = "380px";
    el = document.querySelector('h1');
    el.style.width = "380px";
    el = document.querySelector('.life');
    el.innerHTML = 'LIFE : 3';
    el.style.left = '730px'
    document.querySelector(".timer").innerHTML = '00:00:00';
    initGame();
}
function extreme(elButton) {
    gLevelIdx = 2;
    if (gTimerVar) {
        console.log('gTimerVar', gTimerVar)
        clearInterval(gTimerVar);
        document.querySelector(".timer").innerHTML = gTime;
        
    }
    document.querySelector(".timer").style.width = "550px"
    var el = document.querySelector('h1');
    el.style.width = "550px"
    el = document.querySelector('.life');
    el.style.left = '780px'
    el.innerHTML = 'LIFE : 3';
    document.querySelector(".timer").innerHTML = '00:00:00';
    initGame();
}


function allCellsShown() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {

            var elCell = document.querySelector('[data-i="' + i + '"][data-j="' + j + '"]');
            if ((gBoard[i][j].isMine === false) && (elCell.classList.contains('hid') === false)) {
                console.log('gBoard[i][j].isMine', gBoard[i][j].isMine, i, j);
                console.log('elCell.classList.contains(hid)', elCell.classList.contains('hid'), i, j);
                return false;

            }
        }
    }
    console.log('all cells ARE SHOWN !!!')
    return true;
}