export class FriendList {
  constructor(data) {
    this.uid = data.uid;
    this.email = data.email;
    this.owner = data.owner;
  }

  serialize() {
    return {
      uid: this.uid,
      email: this.email,
      owner: this.owner,
    };
  }
}
