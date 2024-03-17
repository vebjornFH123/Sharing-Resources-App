import DBManager from "../modules/storageManager.mjs";

class ResourceAccess {
  constructor() {
    this.id;
    this.userId;
    this.resourceId;
    this.isAdmin;
  }

  async save(type) {
    try {
      if (type === "add") {
        return await DBManager.create("Resource_access", this);
      } else if (type === "update") {
        return await DBManager.update("Resource_access", this);
      }
    } catch (err) {
      console.log("Error occurred while saving/adding ResourceAccess:", err);

      throw err;
    }
  }
}

export default ResourceAccess;
