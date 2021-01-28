export class User {
    constructor(email, firstname, lastname, logins, role, uid) {
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
        return new User(data.email, data.firstname, data.lastname, data.logins, data.role, data.uid);
    }
};
