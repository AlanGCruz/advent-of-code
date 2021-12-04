
const fs = require('fs');

let dataArr;
try {
  const data = fs.readFileSync('input.txt', 'utf8').trim();
  dataArr = data.split("\n");
} catch (err) {
  console.error(err);
}

const powerConsumption = diagnosisReport => {
    let store = {};
    let gammaRate = "";
    let epsilonRate = "";
    for (let i = 0; i < diagnosisReport.length; i++) {
        let row = diagnosisReport[i];
        for (let i = 0; i < row.length; i++) {
            if(!store.hasOwnProperty(i)) store[i] = { 1: 0, 0: 0 };
            !!Number(row[i]) ? store[i]["1"]++ : store[i]["0"]++;
        }
    }
    Object.keys(store).forEach( key => {
        if (store[key]["0"] > store[key]["1"]) {
            gammaRate += "0";
            epsilonRate += "1";
        } else {
            gammaRate += "1";
            epsilonRate += "0";
        }
    });

    return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
}

console.log(powerConsumption(dataArr));

const getRating = (diagnosisReport, forOxygenRating = true) => {
    const binaryBitsLength = diagnosisReport[0].length;
    let currentBinaries = diagnosisReport;
    let currentIndexBits;

    for (let i = 0; i < binaryBitsLength; i++) {
        if(currentBinaries.length === 1) break;
        currentIndexBits = currentBinaries.map(binary => binary[i]);
        const mcb = currentIndexBits.reduce((accum, current) => Number(accum) + Number(current)) >= (currentBinaries.length / 2) ? "1" : "0";

        if(forOxygenRating) {
            let arr = [];
            for(let j = 0; j < currentIndexBits.length; j++) {
                if(currentIndexBits[j] === mcb) arr.push(currentBinaries[j]);
            }
            currentBinaries = arr;
        } else {
            invertedMcb = mcb === "1" ? "0" : "1";
            let arr = [];
            for(let j = 0; j < currentIndexBits.length; j++) {
                if(currentIndexBits[j] === invertedMcb) arr.push(currentBinaries[j]);
            }
            currentBinaries = arr;
        }
    }
    return currentBinaries[0];
};

const lifeSupportRating = diagnosisReport => {
    const oxygen = getRating(diagnosisReport);
    const co2 = getRating(diagnosisReport, false);
    return parseInt(oxygen, 2) * parseInt(co2, 2);
}

console.log(lifeSupportRating(dataArr));