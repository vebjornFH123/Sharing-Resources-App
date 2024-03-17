import DBManager from "../modules/storageManager.mjs";

class ResourceImage {
  constructor() {
    this.id;
    this.img_data;
    this.resource_id;
  }

  async save() {
    try {
      if (this.id == null) {
        return await DBManager.create("Resources_images", this);
      } else {
        return await DBManager.update("Resources_images", this);
      }
    } catch (err) {
      console.log("Error occurred while saving ResourceImage:", err);
      throw err;
    }
  }
}

export default ResourceImage;
