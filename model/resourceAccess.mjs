import DBManager from "../modules/storageManager.mjs";

class ResourceAccess {
  constructor() {
    this.id;
    this.userId;
    this.resourceId;
    this.isAdmin;
  }

  async save(type) {
    if (type === "add") {
      return await DBManager.create("Resource_access", this);
    } else if (type === "update") {
      return await DBManager.update("Resource_access", this);
    }
  }
}

export default ResourceAccess;
