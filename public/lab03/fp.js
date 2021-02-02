"use strict";
console.log('\nFunctional Programming: Different Tries\n');
const numbers = [1, 2, 3, 4, 5, 6];
const greaterThan3a = numbers.reduce((acc, number) => {
    if (number > 3) {
        acc.push(number);
    }
    return acc;
}, []);
console.log('>> greaterThan3a:', greaterThan3a);
// Output:
// >> greaterThan3a [ 4, 5, 6 ]
const greaterThan3b = numbers.reduce((acc, number) => {
    if (number > 3) {
        return [...acc, number];
    }
    return acc;
}, []);
console.log('>> greaterThan3b:', greaterThan3b);
// Output:
// >> greaterThan3b [ 4, 5, 6 ]
/** *************************************** */
const map = new Map();
map.set(1, 'aaa');
map.set(2, 'bbb');
console.log('>> map', ...map);
const map2 = new Map([[1, 'aaa'], [2, 'bbb']]);
console.log('>> map2', map2);
/** *************************************** */
var RoleTest;
(function (RoleTest) {
    RoleTest[RoleTest["reader"] = 0] = "reader";
    RoleTest[RoleTest["writer"] = 1] = "writer";
    RoleTest[RoleTest["admin"] = 2] = "admin";
})(RoleTest || (RoleTest = {}));
// const role1:string = 'admin'  // Donesn't work!
const role1 = 'admin';
const articles = [
    {
        id: 'a1',
        title: 'aaaaaaaaaa',
        role: RoleTest[role1]
    },
    {
        id: 'a2',
        title: 'bbbb',
        role: 'writer'
    }
];
function printRole(article) {
    console.log('>> role', article.role);
    if (article.role === RoleTest.admin) {
        console.log('>> role is admin!');
    }
}
printRole(articles[0]);
const test = [['aaa', articles[0]], ['bbb', articles[1]]];
const test2 = [...test, ['ccc', articles[0]]];
console.log('test', test);
console.log('test2', test2);
const arr = articles.reduce((acc, article) => {
    // acc.set(article.id, article)
    // return acc
    return [...acc, [article.id, article]];
}, []);
const articlesMap = new Map(arr);
console.log('articlesMap first: ', articlesMap.get('a1').title);
