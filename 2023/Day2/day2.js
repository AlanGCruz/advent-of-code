import { input } from './input.js';

const inputArray = input.split('\n');

let possibleGamesSum = 0;
let powersSum = 0;
inputArray.forEach((game, index) => {
  const colorsMax = {
    "red": 0,
    "green": 0,
    "blue": 0
  }

  const matches = game.matchAll(/(\d+) (blue|red|green)/g)

  for (let match of matches) {
    const [_, quantity, color] = match;
    if (+quantity > colorsMax[color]) {
      colorsMax[color] = +quantity;
    }
  }
  const isGameValid = colorsMax.red <= 12 && colorsMax.green <= 13 && colorsMax.blue <= 14;
  if (isGameValid) possibleGamesSum += index + 1;
  powersSum += colorsMax.red * colorsMax.green * colorsMax.blue;
});

console.log(`First part result: ${possibleGamesSum}`);
console.log(`Second part result: ${powersSum}`);