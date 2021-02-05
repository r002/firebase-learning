export class Article {
    constructor(id, author, content, datetime, // firebase.firestore.Timestamp
    email, tags, title, uid) {
        this.id = id;
        this.author = author;
        this.content = content;
        this.datetime = datetime;
        this.email = email;
        this.tags = tags;
        this.title = title;
        this.uid = uid;
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
            content: article.content,
            datetime: article.datetime,
            email: article.email,
            tags: article.tags,
            title: article.title,
            uid: article.uid
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        const id = snapshot.id;
        return new Article(id, data.author, data.content, data.datetime, data.email, data.tags, data.title, data.uid);
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
