export class Article {
    constructor(author, content, datetime, email, tags, title, uid) {
        this.author = author;
        this.content = content;
        this.datetime = datetime;
        this.email = email;
        this.tags = tags;
        this.title = title;
        this.uid = uid;
        this.fullName = author;
    }
}
