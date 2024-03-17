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
    try {
      if (this.id == null) {
        return await DBManager.create("Users", this);
      } else {
        return await DBManager.update("Users", this);
      }
    } catch (err) {
      console.log("Error occurred while saving/adding User:", err);
      throw err;
    }
  }

  async delete() {
    try {
      return await DBManager.delete("Users", this, null);
    } catch (err) {
      console.log("Error occurred while deleting User:", err);
      throw err;
    }
  }

  async getUser(key, select) {
    try {
      return await DBManager.getData("Users", select, key, this);
    } catch (err) {
      console.log("Error occurred while getting User:", err);
      throw err;
    }
  }
}

export default User;
