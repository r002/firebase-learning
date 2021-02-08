// const firebase = (window as any).firebase

export interface Entry {
  movie: string;
  song: string; // | undefined;
  title: string;
  category: string;
  dt: string;
  body: string;
  wordCount: number;
}

export class Article {
  // datetime: any;
  tagsStr: string;
  constructor (
    public id: string,
    public author: string,
    public uid: string,
    public email: string,
    public song: string,
    public movie: string,
    public title: string,
    public category: string,
    public tags: string[],
    public content: string,
    public datetime: any // firebase.firestore.Timestamp
  ) {
    // this.datetime = firebase.firestore.FieldValue.serverTimestamp()
    this.tagsStr = tags.reduce((acc, tag) => {
      acc += `#${tag}, `
      return acc
    }, '')
  }
}

export const articleConverter = {
  toFirestore: function (article: Article) {
    return {
      // id: article.id,  // Not in ".data()" of the model!
      author: article.author,
      uid: article.uid,
      email: article.email,
      song: article.song,
      movie: article.movie,
      title: article.title,
      category: article.category,
      tags: article.tags,
      content: article.content,
      datetime: article.datetime
    }
  },
  fromFirestore: function (snapshot: any, options: any) {
    const data = snapshot.data(options)
    const id = snapshot.id
    return new Article(
      id,
      data.author,
      data.uid,
      data.email,
      data.song,
      data.movie,
      data.title,
      data.category,
      data.tags,
      data.content,
      data.datetime
    )
  }
}

export enum Role {
  reader,
  writer,
  admin,
}

export class User {
  fullname: string;
  constructor (
    public id: string,
    public email: string,
    public firstname: string,
    public lastname: string,
    public logins: [string],
    public role: Role,
    public uid: string
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
    const id: string = snapshot.id
    const typedRoleString: keyof typeof Role = data.role
    const role = Role[typedRoleString]
    // console.log('###### fromFirestore after type guard check:', Role[role])
    return new User(id, data.email, data.firstname, data.lastname, data.logins,
      role, data.uid)
  }
}
