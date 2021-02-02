console.log('\nFunctional Programming: Different Tries\n')

const numbers = [1, 2, 3, 4, 5, 6]

const greaterThan3a = numbers.reduce((acc:number[], number) => {
  if (number > 3) {
    acc.push(number)
  }
  return acc
}, [])

console.log('>> greaterThan3a:', greaterThan3a)
// Output:
// >> greaterThan3a [ 4, 5, 6 ]

const greaterThan3b = numbers.reduce((acc:number[], number) => {
  if (number > 3) {
    return [...acc, number]
  }
  return acc
}, [])

console.log('>> greaterThan3b:', greaterThan3b)
// Output:
// >> greaterThan3b [ 4, 5, 6 ]

/** *************************************** */
const map = new Map()
map.set(1, 'aaa')
map.set(2, 'bbb')
console.log('>> map', ...map)

const map2 = new Map([[1, 'aaa'], [2, 'bbb']])
console.log('>> map2', map2)

/** *************************************** */

enum RoleTest {
  reader,
  writer,
  admin,
}

interface Article {
  id: string,
  title: string,
  role: RoleTest
}

// const role1:string = 'admin'  // Donesn't work!
const role1 = 'admin'
const articles: Article[] = [
  {
    id: 'a1',
    title: 'aaaaaaaaaa',
    role: <RoleTest>RoleTest[role1]

  },
  {
    id: 'a2',
    title: 'bbbb',
    role: 'writer' as unknown as RoleTest
  }
]

function printRole (article: Article) {
  console.log('>> role', article.role)
  if (article.role === RoleTest.admin) {
    console.log('>> role is admin!')
  }
}

printRole(articles[0])

const test: [string, Article][] = [['aaa', articles[0]], ['bbb', articles[1]]]
const test2: [string, Article][] = [...test, ['ccc', articles[0]]]
console.log('test', test)
console.log('test2', test2)

const arr = articles.reduce((acc: any, article: Article) => {
  // acc.set(article.id, article)
  // return acc
  return [...acc, [article.id, article]]
}, [])
const articlesMap: Map<string, Article> = new Map(arr)

console.log('articlesMap first: ', articlesMap.get('a1')!.title)
