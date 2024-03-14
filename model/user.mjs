import DBManager from "../modules/storageManager.mjs";

class User {
  constructor() {
    this.email;
    this.pswhash;
    this.name;
    this.profilepic;
    this.id;
  }

  async save() {
    /// TODO: What happens if the DBManager fails to complete its task?
    // We know that if a user object dos not have the ID, then it cant be in the DB.
    if (this.id == null) {
      return await DBManager.create("Users", this);
    } else {
      return await DBManager.updateUser(this);
    }
  }

  async delete() {
    /// TODO: What happens if the DBManager fails to complete its task?
    return await DBManager.delete("Users", this, null);
  }

  async getUser(key, select) {
    return await DBManager.getData("Users", select, key, this);
  }
}

export default User;
