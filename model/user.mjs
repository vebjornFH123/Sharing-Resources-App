import DBManager from "../modules/storageManager.mjs";

class User {
  constructor() {
    ///TODO: Are these the correct fields for your project?
    this.email;
    this.pswHash;
    this.name;
    this.id;
    this.profilepic;
  }

  async save() {
    /// TODO: What happens if the DBManager fails to complete its task?
    // We know that if a user object dos not have the ID, then it cant be in the DB.
    if (this.id == null) {
      return await DBManager.createUser(this);
    } else {
      return await DBManager.updateUser(this);
    }
  }

  async delete() {
    /// TODO: What happens if the DBManager fails to complete its task?
    return await DBManager.deleteUser(this);
  }

  async getUser(key) {
    return await DBManager.getUser(key, this);
  }
}

export default User;
