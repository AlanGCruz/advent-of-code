import { input } from "./input.js";

const parsedInput = input.split("\n")
const symbolRegex = /[^\d\.]/;
let sum = 0;

// used for tracking the pair of part numbers adjacent to '*'
const gears = {}

parsedInput.forEach((row, rowIndex) => {
  const numMatches = [...row.matchAll(/\d+/g)];

  numMatches.forEach(numMatch => {
    let isPart = false;
    let gearIndex = "";
    const number = +numMatch[0];
    const matchStartIndex = numMatch.index;
    const matchEndIndex = matchStartIndex + numMatch[0].length - 1;

    //check for any number adjacent to a symbol
    // positions we will need to check are denoted by x. which are all surrounding positions
    // [x] [x] [x] [ ] - to check: entire top row and top diagonals
    // [x] [m] [x] [ ] - to check: left and right neighbour
    // [x] [x] [x] [ ] - to check: entire bottom row and bottom diagonals

    //Check right neighbours
    if (matchEndIndex + 1 < row.length) {//check if we are not on the last element in the row
      const nextElement = row[matchEndIndex + 1];
      if (symbolRegex.test(nextElement)) {
        isPart = true;
        if (nextElement == "*") {
          // get gear coordinates
          const x = matchEndIndex + 1;
          const y = rowIndex
          const coordinate = `x:${x},y:${y}`
          const currentValue = gears[coordinate] || [];
          gears[coordinate] = [...currentValue, number]
        }
      }
    }

    //check left neighbours
    if (matchStartIndex - 1 >= 0) {//check if we are not on the first element in the row
      const prevElement = row[matchStartIndex - 1];
      if (symbolRegex.test(prevElement)) {
        isPart = true;
        if (prevElement == "*") {
          // get gear coordinates
          const x = matchStartIndex - 1;
          const y = rowIndex
          const coordinate = `x:${x},y:${y}`
          const currentValue = gears[coordinate] || [];
          gears[coordinate] = [...currentValue, number]
        }
      }
    }

    // check bottom row and bottom diagonals: matchStart - 1 to matchEnd + 1
    if (rowIndex != parsedInput.length - 1) { //check if we are not on the last row
      const nextRow = parsedInput[rowIndex + 1];
      const nextRowStartIndex = Math.max(0, matchStartIndex - 1);
      const nextRowEndIndex = Math.min(nextRow.length - 1, matchEndIndex + 1);

      for (let nextRowIndex = nextRowStartIndex; nextRowIndex <= nextRowEndIndex; nextRowIndex++) {
        const nextRowChar = nextRow[nextRowIndex];
        if (symbolRegex.test(nextRowChar)) {
          isPart = true;
          if (nextRowChar == "*") {
            // get gear coordinates
            const x = nextRowIndex;
            const y = rowIndex + 1
            const coordinate = `x:${x},y:${y}`
            const currentValue = gears[coordinate] || [];
            gears[coordinate] = [...currentValue, number]
          }
        }
      }
    }

    // check top row and top diagonals: matchStart - 1 to matchEnd + 1
    if (rowIndex != 0) { //check if we are not on the first row
      const previousRow = parsedInput[rowIndex - 1];
      const previousRowStartIndex = Math.max(0, matchStartIndex - 1);
      const previousRowEndIndex = Math.min(previousRow.length - 1, matchEndIndex + 1);

      for (let previousRowIndex = previousRowStartIndex; previousRowIndex <= previousRowEndIndex; previousRowIndex++) {
        const previousRowChar = previousRow[previousRowIndex];
        if (symbolRegex.test(previousRowChar)) {
          isPart = true;
          if (previousRowChar == "*") {
            // get gear coordinates
            const x = previousRowIndex;
            const y = rowIndex - 1
            const coordinate = `x:${x},y:${y}`
            const currentValue = gears[coordinate] || [];
            gears[coordinate] = [...currentValue, number]
          }
        }
      }
    }

    if (isPart) {
      sum += number;
    }
  });
});
console.log(`Sum of parts is ${sum}`);

//PART 2
let sum2 = 0;
let gearPairs = [];
for (let coordinate in gears) {
  const numbers = gears[coordinate];
  if (numbers.length === 2) {
    gearPairs.push(numbers)
  }
}

for (let i = 0; i < gearPairs.length; i++) {
  const pair = gearPairs[i];
  const p0 = pair[0]
  const p1 = pair[1]

  const gearRatio = p0 * p1;
  sum2 += gearRatio
}
console.log(`Sum of gear ratios is ${sum2}`)