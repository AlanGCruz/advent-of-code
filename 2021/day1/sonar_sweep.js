const fs = require('fs');

let dataArr;
try {
  const data = fs.readFileSync('adventofcode-2021-day-1-input.txt', 'utf8');
  dataArr = data.split("\n").map(Number);
} catch (err) {
  console.error(err);
}

/*
 Solutions logic:
 both problems objective is to count increments in measurements, The first problem is very straight forward, you just compare
 measurements[currentIndex] with measurements[previousIndex] for this case the "window" is one.
 The second problem ask us to compare the sum of 2 windows of 3 elements: the current index and its two next elements,
 and the next element with its next two elements. notice that in each "three-measurement window" that you can get,
 two of the elements will be the same for both "three-measurement windows". example: for [1,2,3,4,5,6] A: [1,2,3], B: [2,3,4].
 For both windows, the elements 2 and 3 appears and the only difference between the windows are the first element of the first window
 and the last element of the second window. This means that you can know which sum will be bigger just comparing the first element of the first window
 and the last element of the second window, since both of them will add that value to the sum of 2 + 3.
 example: A: 1 + 2 + 3, B: 2 + 3 + 4 == A: 1 + 5, B: 5 + 4
 So for this case we can define the window param value to 3 to compare the current index with the value of the array three elements ahead.
*/
const countIncrements = (window, measurements) => {
    let count = 0;

    for(let i = 0; i < measurements.length; i++) if(measurements[i] < measurements[i + window]) count++;

    return count;
}

console.log("problem 1 result: ", countIncrements(1, dataArr));
console.log("problem 2 result: ", countIncrements(3, dataArr));