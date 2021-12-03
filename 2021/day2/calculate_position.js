const fs = require('fs');

let dataArr;
try {
  const data = fs.readFileSync('input.txt', 'utf8').trim();
  dataArr = data.split("\n");
} catch (err) {
  console.error(err);
}

const calculate = (commands, withAim = false) => {
    let state = { h: 0, d: 0, a: 0 };
    const run = withAim ? calculatePositionWithAim : calculatePosition;
    commands.forEach(command => {
        let [direction, value] = command.split(" ");
        run(state, direction, Number(value));
    })
    return state['h'] * state['d'];
}

function calculatePosition(state, direction, value) {
    switch (direction) {
        case "forward":
            state['h'] += value;
            break;
        case "down":
            state['d'] += value;
            break;
        case "up":
            state['d'] -= value;
            break;
    }
}
function calculatePositionWithAim(state, direction, value) {
    switch (direction) {
        case "forward":
            state['h'] += value;
            state['d'] += state['a'] * value;
            break;
        case "down":
            state['a'] += value;
            break;
        case "up":
            state['a'] -= value;
            break;
    }
}

console.log("Problem 1:", calculate(dataArr));
console.log("Problem 2:", calculate(dataArr, true));