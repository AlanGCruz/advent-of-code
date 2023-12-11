import { input } from "./input.js";

const lineRegex =
  /^Card\s+(?<cardNumber>\d+):\s+(?<winningNums>.+)\|(?<cardNums>.+)$/;

const parsedInput = input.split("\n");
const cards = parsedInput.map((line) => {
  const { cardNumber, winningNums, cardNums } = lineRegex.exec(line).groups;

  return {
    cardNumber: parseInt(cardNumber),
    winningNums: winningNums.trim().split(" "),
    cardNums: cardNums.trim().split(" ").filter(Boolean),// filter to remove empty strings
  };
});

const winAmounts = (card) => {
  return card.cardNums.reduce((acc, currNumber) => {
    return card.winningNums.includes(currNumber) ? acc += 1 : acc;
  }, 0);
}

//Part one
const pilePoints = cards.reduce((pileWorth, card) => {
  const winningNumbersAmount = winAmounts(card);
  const cardWorth = winningNumbersAmount === 0 ? 0 : Math.pow(2, winningNumbersAmount - 1); // the first number substracted since its value its 1
  return pileWorth += cardWorth;
}, 0);

console.log(pilePoints);

//Part two
const cardInstances = cards.reduce((acc, card) => {
  acc[card.cardNumber] = 1;
  return acc;
}, {});

for (let i = 0; i < cards.length; i++) {
  const card = cards[i];
  const wins = winAmounts(card);
  for (let j = 1; j <= wins && i + j < cards.length; j++) {
    const nextCard = cards[i + j];
    cardInstances[nextCard.cardNumber] =
      (cardInstances[nextCard.cardNumber] ?? 0) +
      cardInstances[card.cardNumber];
  }
}

const scratchCardsAmount = Object.values(cardInstances).reduce((sum, x) => sum + x, 0);
 console.log(scratchCardsAmount);

