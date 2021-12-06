const fs = require('fs');

let boards;
let numers

try {
  const data = fs.readFileSync('input.txt', 'utf8');
  [numbers, ...boards] = data.split(/\n{2}/);
  numbers = numbers.split(",");
  boards = boards.map( b => b.trim().split(/\\n|\s+/));
} catch (err) {
  console.error(err);
}

const byCols= (arr) => {
    let boardsByCol = []
    for(let i = 0; i < 5; i++) {
        let  currentBoardCols= [];
        for(let add = 0; add <= 20; add += 5) {
            currentBoardCols.push(arr[i + add]);
        }
        boardsByCol.push(currentBoardCols);
    }
    return boardsByCol;
}

const checkForCompletedColumn = (boards) => {
    let isCompletedColumn = false;
    let completedBoard = [];
    for(let i = 0; i < boards.length; i++) {
        let boardByCols = byCols(boards[i])
        for(let j = 0; j < boardByCols.length; j++) {
            if(boardByCols[j].every(colValue => colValue === "x")) {
                isCompletedColumn = true;
                break;
            }
        }
        if(isCompletedColumn) {
            completedBoard = [boards[i], i];
            break;
        }
    }
    if(isCompletedColumn) {
        return  completedBoard;
    }
    return completedBoard;
}

const checkForCompletedRows = (boards) => {
    let completedBoard = [];
    for(let i = 0; i < boards.length; i++) {
        let markCount = 0;
        let completedRow = false;
        for(let j = 0; j < boards[i].length; j++) {
            if(j % 5 == 0) markCount = 0;
            if(boards[i][j] === 'x') markCount += 1;
            if(markCount === 5) {
                completedRow = true;
                break;
            }
        }
        if(completedRow) {
            completedBoard = [boards[i], i];
            break;
        }
    }
    return completedBoard;
}

const sumUnmarkedNumbers = (board) => {
    return board.reduce((accum, current, index) => {
        if(current === 'x' && accum === 'x') return 0;
        if(accum === 'x') return current;
        return current !== 'x' ? parseInt(accum) + parseInt(current) : parseInt(accum) + 0
    });
}

const searchAndMarkAllBoards = (boards, number) => {
    for(let i = 0; i < boards.length; i++) {
        for(let j = 0; j < boards[i].length; j++) {
            if(parseInt(boards[i][j]) === parseInt(number)) {
                boards[i][j] = 'x';
            }
        }
    }
   // console.log(`****************new board marking number: ${number} ************************`);
   // console.log(boards);
}

const bingoScore = (numbers, boards) => {
    let completedRowInfo = [];
    let completedColumnInfo = [];
    let winnerIndex, winnerBoard, winnerNumber;
    for(let i = 0; i < numbers.length; i++) {
        searchAndMarkAllBoards(boards, numbers[i]);
        completedRowInfo = checkForCompletedRows(boards);
        completedColumnInfo = checkForCompletedColumn(boards);
        if(completedRowInfo.length > 0 || completedColumnInfo.length > 0) {
            winnerNumber = numbers[i];
            break;
        }
    }
    if(completedRowInfo.length > 0 && completedColumnInfo.length > 0){
        [winnerBoard,winnerIndex] = completedRowInfo[1] < completedColumnInfo[1] ? completedRowInfo : completedColumnInfo;
    } else if(completedRowInfo.length > 0) {
        [winnerBoard,winnerIndex] = completedRowInfo;
    } else if(completedColumnInfo[1]) {
        [winnerBoard,winnerIndex] = completedColumnInfo;
    }
    return sumUnmarkedNumbers(winnerBoard) * parseInt(winnerNumber);

}

console.log(bingoScore(numbers, boards));
