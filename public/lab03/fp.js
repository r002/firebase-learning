"use strict";
console.log('\nFunctional Programming: Different Tries\n');
const numbers = [1, 2, 3, 4, 5, 6];
const greaterThan3a = numbers.reduce((acc, number) => {
    if (number > 3) {
        acc.push(number);
    }
    return acc;
}, []);
console.log('>> greaterThan3a', greaterThan3a);
// Output:
// >> greaterThan3a [ 4, 5, 6 ]
const greaterThan3b = numbers.reduce((acc, number) => {
    if (number > 3) {
        return [...acc, number];
    }
    return acc;
}, []);
console.log('>> greaterThan3b', greaterThan3b);
// Output:
// >> greaterThan3b [ 4, 5, 6 ]
