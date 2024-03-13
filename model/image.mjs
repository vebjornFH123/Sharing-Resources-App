import DBManager from "../modules/storageManager.mjs";

class ResourceImage {
  constructor() {
    this.id;
    this.data;
    this.resource_id;
  }

  async save() {
    /// TODO: What happens if the DBManager fails to complete its task?
    // We know that if a user object dos not have the ID, then it cant be in the DB.
    if (this.id == null) {
      return await DBManager.create("Resources_images", this);
    } else {
      return await DBManager.updateUser(this);
    }
  }

  async delete() {
    /// TODO: What happens if the DBManager fails to complete its task?
    return await DBManager.deleteUser(this);
  }

  async get(key) {
    return await DBManager.getData("Resources_images", key, this);
  }
}

export default ResourceImage;
