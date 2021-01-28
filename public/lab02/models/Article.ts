export class Article {
  fullName: string;
  constructor (
    public author: string,
    public content: string,
    public datetime: Date,
    public email: string,
    public tags: [string],
    public title: string,
    public uid: string
  ) {
    this.fullName = author
  }
}
