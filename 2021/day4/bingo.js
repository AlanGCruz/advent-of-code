const fs = require('fs');

let boards;
let numers;

try {
  const data = fs.readFileSync('input.txt', 'utf8');
  [numbers, ...boards] = data.split(/\n{2}/);
  numbers = numbers.split(",");
  boards = boards.map( b => b.trim().split(/\\n|\s+/));
} catch (err) {
  console.error(err);
}

const byCols= (board) => {
    let rowLength = 5;
    let boardLength = 20;
    let boardsByCol = []
    for(let i = 0; i < rowLength; i++) {
        let currentBoardCols= [];
        for(let add = 0; add <= boardLength; add += 5) {
            currentBoardCols.push(board[i + add]);
        }
        boardsByCol.push(currentBoardCols);
    }
    return boardsByCol;
}

const checkForCompletedColumn = (boards, excludedBoardsIndex = []) => {
    let completedBoardsIndex = [];
    boards.forEach((board, i) => {
        if(excludedBoardsIndex.includes(i)) return;
        byCols(board).forEach((bc, j) => {
            if(bc.every(colVal => colVal === "x")) completedBoardsIndex.push(i);
        });
    });

    return completedBoardsIndex;
}

const checkForCompletedRows = (boards, excludedBoardsIndex = []) => {
    let completedBoardsIndex = [];

    boards.forEach((board, boardIndex) => {
        if(excludedBoardsIndex.includes(boardIndex)) return;
        let consecutiveMarksCount = 0;
        board.forEach((value, valueIndex) => {
            if(valueIndex % 5 == 0) consecutiveMarksCount = 0;
            if(value === 'x') consecutiveMarksCount++;
            if(consecutiveMarksCount === 5) completedBoardsIndex.push(boardIndex)
        })
    });

    return completedBoardsIndex;
}

const sumUnmarkedNumbers = (board) => {
    return board.reduce((accum, current, index) => {
        if(current === 'x' && accum === 'x') return 0;
        if(accum === 'x') return current;
        return current !== 'x' ? parseInt(accum) + parseInt(current) : parseInt(accum);
    });
}

const searchAndMarkAllBoards = (boards, number, excludedBoardsIndex = []) => {
    boards.forEach((board, boardIndex) => {
        if(excludedBoardsIndex.includes(boardIndex)) return;
        board.forEach((value, valueIndex) => {
            if(parseInt(value, 10) === parseInt(number, 10)) boards[boardIndex][valueIndex] = 'x';
        });
    });
}

const lastWinnerBoardScore = (numbers, boards) => {
    let winsCount = 0;
    let lastWinnerBoardIndex;
    let lastWinnerNumber;
    let excludedBoardsIndex = [];
    let boardsSize = boards.length;
    let numbersSize = numbers.length;
    numbers.forEach((number, numberIndex) => {
        searchAndMarkAllBoards(boards, number, excludedBoardsIndex);

        let completedRowsIndex = checkForCompletedRows(boards, excludedBoardsIndex, number);

        if(completedRowsIndex.length > 0) {
            excludedBoardsIndex.push(...completedRowsIndex);
            lastWinnerNumber = number;
            winsCount++
        }

        let completedColumnsIndex = checkForCompletedColumn(boards, excludedBoardsIndex);

        if(completedColumnsIndex.length > 0) {
            excludedBoardsIndex.push(...completedColumnsIndex);
            winsCount++
        }

        // break if all numbers ran or all boards won.
        // in case a board's rows and another board's columns were completed in the last number,
        // the board with completed columns will always be the last winner.
        if((numbersSize - 1) === numberIndex || (boardsSize - winsCount) === 0) {
            lastWinnerBoardIndex = excludedBoardsIndex.pop();
            return;
        }
    });

    return sumUnmarkedNumbers(boards[lastWinnerBoardIndex]) * parseInt(lastWinnerNumber);
}

const firstWinnerBoardScore = (numbers, boards) => {
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

console.log("first winner board score: ", firstWinnerBoardScore(numbers, boards));
console.log("last winner board score: ", lastWinnerBoardScore(numbers, boards));
