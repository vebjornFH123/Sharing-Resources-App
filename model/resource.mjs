import DBManager from "../modules/storageManager.mjs";
import ResourceImage from "./image.mjs";

class Resource {
  constructor() {
    this.id;
    this.name;
    this.description;
    this.type;
    this.key;
    this.address;
    this.country;
    this.zipCode;
    this.userId;
  }

  async save() {
    try {
      if (this.id == null) {
        return await DBManager.create("Resources", this);
      } else {
        return await DBManager.update("Resources", this);
      }
    } catch (err) {
      console.log("Error occurred while saving/updating Resource:", err);
      throw err;
    }
  }

  async delete() {
    try {
      return await DBManager.delete("Resources", this);
    } catch (err) {
      console.log("Error occurred while deleting Resource:", err);
      throw err;
    }
  }

  async get(key, select) {
    try {
      let query;
      if (key === "userId") {
        query = `SELECT r.id, r.name, r.description, r.type, r.key, r.address, r.country, r.zipcode, array_agg(ri.img_data) AS images,  ra."isAdmin" AS is_admin 
      FROM "Resources" r
      LEFT JOIN "Resources_images" ri ON r.id = ri.resource_id
      LEFT JOIN "Resource_access" ra ON r.id = ra."resourceId" AND ra."userId" = $1
      WHERE r.id IN (
              SELECT ra."resourceId"
              FROM "Resource_access" ra
              WHERE ra."userId" = $1
          )
      GROUP BY r.id, r.name, r.description, ra."isAdmin";`;
      } else if (key === "resourceId") {
        query = `SELECT r.id, r.name, r.description, r.type, r.key, r.address, r.country, r.zipcode, array_agg(ri.img_data) AS images, array_agg(DISTINCT ra."userId") AS user_ids, array_agg(DISTINCT ra."isAdmin") AS is_admins, ra."userId" IS NOT NULL AS has_access, ra."isAdmin" AS is_admin 
      FROM "Resources" r
      LEFT JOIN "Resources_images" ri ON r.id = ri.resource_id
          LEFT JOIN (
              SELECT "resourceId", "userId", "isAdmin"
              FROM "Resource_access"
              WHERE "userId" = $1
            ) ra ON r.id = ra."resourceId"  
          WHERE r.id = $2
      GROUP BY r.id, r.name, r.description, ra."userId", ra."isAdmin";`;
      }
      return await DBManager.getData("Resources", select, key, this, query);
    } catch (err) {
      console.log("Error occurred while getting Resource:", err);
      throw err;
    }
  }
}

export default Resource;
