export class User {
  fullname: string;
  constructor (
    public email: string,
    public firstname: string,
    public lastname: Date,
    public logins: [string],
    public role: string,
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
    return new User(data.email, data.firstname, data.lastname, data.logins,
      data.role, data.uid)
  }
}
