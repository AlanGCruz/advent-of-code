const fs = require('fs');

let dataArr;
try {
  const data = fs.readFileSync('input.txt', 'utf8').trim();
  dataArr = data.split(",").map(Number);
} catch (err) {
  console.error(err);
}

const amountOfLanternFishAfter80Days = lanternFishTimers => {
    let currentDay = 0;
    let fishesCount = lanternFishTimers.length;
    while (currentDay < 80) {
        let fishesToAddAtEOD = 0;
        lanternFishTimers.forEach((timer, index) => {
            if(timer === 0) {
                lanternFishTimers[index] = 6;
                fishesToAddAtEOD++;
                return;
            }
            lanternFishTimers[index]--;
        });
        fishesCount += fishesToAddAtEOD;
        for(let i = 0; i < fishesToAddAtEOD; i++) {
            lanternFishTimers.push(8);
        }
        currentDay++;
    }
    return fishesCount;
}
console.log(amountOfLanternFishAfter80Days(dataArr));