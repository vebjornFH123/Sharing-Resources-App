import DBManager from "../modules/storageManager.mjs";

class ResourceAccess {
  constructor() {
    this.id;
    this.userId;
    this.resourceId;
    this.isAdmin;
  }

  async save() {
    /// TODO: What happens if the DBManager fails to complete its task?
    if (this.id == null) {
      return await DBManager.create("Resource_access", this);
    } else {
      return await DBManager.updateUser(this);
    }
  }
}

export default ResourceAccess;
