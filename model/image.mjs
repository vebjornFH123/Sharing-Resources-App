import DBManager from "../modules/storageManager.mjs";

class ResourceImage {
  constructor() {
    this.id;
    this.img_data;
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
}

export default ResourceImage;
