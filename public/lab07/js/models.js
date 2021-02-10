// const firebase = (window as any).firebase
export class Article {
    constructor(id, author, uid, email, song, movie, title, category, tags, content, datetime, // firebase.firestore.FieldValue // firebase.firestore.Timestamp
    wordCount, headingsCount) {
        this.id = id;
        this.author = author;
        this.uid = uid;
        this.email = email;
        this.song = song;
        this.movie = movie;
        this.title = title;
        this.category = category;
        this.tags = tags;
        this.content = content;
        this.datetime = datetime;
        this.wordCount = wordCount;
        this.headingsCount = headingsCount;
        // this.datetime = firebase.firestore.FieldValue.serverTimestamp()
        this.tagsStr = tags.reduce((acc, tag) => {
            acc += `#${tag}, `;
            return acc;
        }, '');
    }
}
export const articleConverter = {
    toFirestore: function (article) {
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
            datetime: article.datetime,
            wordCount: article.wordCount,
            headingsCount: article.headingsCount
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        const id = snapshot.id;
        return new Article(id, data.author, data.uid, data.email, data.song, data.movie, data.title, data.category, data.tags, data.content, data.datetime.toDate(), data.wordCount, data.headingsCount);
    }
};
export var Role;
(function (Role) {
    Role[Role["reader"] = 0] = "reader";
    Role[Role["writer"] = 1] = "writer";
    Role[Role["admin"] = 2] = "admin";
})(Role || (Role = {}));
export class User {
    constructor(id, email, firstname, lastname, logins, role, uid) {
        this.id = id;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.logins = logins;
        this.role = role;
        this.uid = uid;
        this.fullname = `${firstname} ${lastname}`;
    }
}
export const userConverter = {
    toFirestore: function (user) {
        return {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        const id = snapshot.id;
        const typedRoleString = data.role;
        const role = Role[typedRoleString];
        // console.log('###### fromFirestore after type guard check:', Role[role])
        return new User(id, data.email, data.firstname, data.lastname, data.logins, role, data.uid);
    }
};
