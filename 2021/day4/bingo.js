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

const checkForCompletedColumn = (boards, excludedBoardsIndex = []) => {
    let completedBoardsIndex = [];
    for(let i = 0; i < boards.length; i++) {
        if(excludedBoardsIndex.length > 0 && excludedBoardsIndex.includes(i)) continue;
        let boardByCols = byCols(boards[i]);
        for(let j = 0; j < boardByCols.length; j++) {
            if(boardByCols[j].every(colValue => colValue === "x")) {
                completedBoardsIndex.push(i)
            }
        }
    }
    return completedBoardsIndex;
}

const checkForCompletedRows = (boards, excludedBoardsIndex = [], currentNumber) => {
    let completedBoardsIndex = [];
    for(let i = 0; i < boards.length; i++) {
        let markCount = 0;
        if(excludedBoardsIndex.length > 0 && excludedBoardsIndex.includes(i)) continue;
        for(let j = 0; j < boards[i].length; j++) {
            if(j % 5 == 0) markCount = 0;
            if(boards[i][j] === 'x') markCount += 1;
            if(markCount === 5) {
                completedBoardsIndex.push(i);
            }
        }
    }
    return completedBoardsIndex;
}

const sumUnmarkedNumbers = (board) => {
    return board.reduce((accum, current, index) => {
        if(current === 'x' && accum === 'x') return 0;
        if(accum === 'x') return current;
        return current !== 'x' ? parseInt(accum) + parseInt(current) : parseInt(accum) + 0
    });
}

const searchAndMarkAllBoards = (boards, number, excludedBoardsIndex = []) => {
    for(let i = 0; i < boards.length; i++) {
        if(excludedBoardsIndex.includes(i)) continue;
        for(let j = 0; j < boards[i].length; j++) {
            if(parseInt(boards[i][j], 10) === parseInt(number, 10)) {
                boards[i][j] = 'x';
            }
        }
    }
}

const lastWinnerBoardScore = (numbers, boards) => {
    let winsCount = 0;
    let lastWinnerBoardIndex;
    let lastWinnerNumber;
    let excludedBoardsIndex = [];
    let boardsSize = boards.length;
    let lastCompleterNumber;
    for(let i = 0; i < numbers.length; i++) {
        searchAndMarkAllBoards(boards, numbers[i], excludedBoardsIndex);

        let completedRowsIndex = checkForCompletedRows(boards, excludedBoardsIndex, numbers[i]);

        if(completedRowsIndex.length > 0) {
            excludedBoardsIndex.push(...completedRowsIndex);
            lastCompleterNumber = numbers[i];
            winsCount++
        }

        if((boardsSize - winsCount) === 0) {
            lastWinnerNumber = lastCompleterNumber;
            lastWinnerBoardIndex = completedRowsIndex.pop();
            break;
        } else if((numbers.length - 1) === i) {
            lastWinnerNumber = lastCompleterNumber;
            lastWinnerBoardIndex = excludedBoardsIndex.pop();
            break;
        }

        let completedColumnsIndex = checkForCompletedColumn(boards, excludedBoardsIndex);

        if(completedColumnsIndex.length > 0) {
            excludedBoardsIndex.push(...completedColumnsIndex);
            lastCompleterNumber = numbers[i];
            winsCount++
        }

        if((boardsSize - winsCount) === 0) {
            lastWinnerNumber = lastCompleterNumber;
            lastWinnerBoardIndex = completedColumnsIndex.pop();
            break;
        } else if((numbers.length - 1) == i) {
            lastWinnerNumber = numbers[i];
            lastWinnerBoardIndex = excludedBoardsIndex.pop();
            break;
        }
    }
    return sumUnmarkedNumbers(boards[lastWinnerBoardIndex]) * parseInt(lastWinnerNumber);
}

const bingoScore = (numbers, boards) => {
    let winnerIndex, winnerBoard, winnerNumber;
    let completedRowsIndex = [];
    let completedColumnsIndex = [];
    for(let i = 0; i < numbers.length; i++) {
        searchAndMarkAllBoards(boards, numbers[i]);
        completedRowsIndex = checkForCompletedRows(boards);
        completedColumnsIndex = checkForCompletedColumn(boards);
        if(completedRowsIndex.length > 0 || completedColumnsIndex.length > 0) {
            winnerNumber = numbers[i];
            break;
        }
    }

    winnerIndex = completedRowsIndex.length > 0 ? completedRowsIndex.shift() : completedColumnsIndex.shift();
    winnerBoard = boards[winnerIndex];

    return sumUnmarkedNumbers(winnerBoard) * parseInt(winnerNumber);
}

console.log("first winner board score: ", bingoScore(numbers, boards));
console.log("last winner board score: ", lastWinnerBoardScore(numbers, boards));
