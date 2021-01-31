export class Article {
  tagsStr: string;
  constructor (
    public id: string,
    public author: string,
    public content: string,
    public datetime: any, // firebase.firestore.Timestamp
    public email: string,
    public tags: [string],
    public title: string,
    public uid: string
  ) {
    this.tagsStr = tags.reduce((acc, tag) => {
      acc += `<a href="javascript:getArticlesByTag('${tag}');" style="background:yellow;">#${tag}</a>, `
      return acc
    }, '')
  }
}

export const articleConverter = {
  toFirestore: function (article: Article) {
    return {
      // id: article.id,  // Not in ".data()" of the model!
      author: article.author,
      content: article.content,
      datetime: article.datetime,
      email: article.email,
      tags: article.tags,
      title: article.title,
      uid: article.uid
    }
  },
  fromFirestore: function (snapshot: any, options: any) {
    const data = snapshot.data(options)
    const id = snapshot.id
    return new Article(id, data.author, data.content, data.datetime,
      data.email, data.tags, data.title, data.uid)
  }
}

export class User {
  fullname: string;
  constructor (
    public id: string,
    public email: string,
    public firstname: string,
    public lastname: string,
    public logins: [Date],
    public role: string
  ) {
    this.fullname = `${firstname} ${lastname}`
  }
}

export const userConverter = {
  toFirestore: function (user: User) {
    return {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role
    }
  },
  fromFirestore: function (snapshot: any, options: any) {
    const data = snapshot.data(options)
    const id = snapshot.id
    return new User(id, data.email, data.firstname, data.lastname, data.logins,
      data.role)
  }
}
