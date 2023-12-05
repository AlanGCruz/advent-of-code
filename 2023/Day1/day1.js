import { input } from './input.js';

// ****************Part one******************
const firstResult = input.trim().split('\n').reduce((acc, elem) => {
  const numbers = elem.match(/\d/g);
  if (numbers) {
    const firstDigit = numbers[0];
    const lastDigit = numbers[numbers.length - 1];
    return acc + +`${firstDigit}${lastDigit}`;
  }
}, 0)

console.log(`First Part: ${firstResult}`);

// ***************Part two*******************
// Mapping words to corresponding numbers
const numberMapper = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const secondResult = input.trim().split('\n').reduce((acc, elem) => {
  const matches = elem.toLowerCase().matchAll(/(?=((\d)|one|two|three|four|five|six|seven|eight|nine))/gm);

  // Array to store the matched values
  const numbers = [];

  // Collect matched values in the numbers array
  for (const match of matches) {
      numbers.push(match[1]);
  }

  if (numbers.length) {
    const firstDigit = numbers[0];
    const lastDigit = numbers[numbers.length - 1];
    const converted = `${isNaN(+firstDigit) ? numberMapper[firstDigit] : firstDigit}${isNaN(+lastDigit) ? numberMapper[lastDigit] : lastDigit}`;
    return acc + +converted;
  }

}, 0)
console.log(`Second Part: ${secondResult}`);
