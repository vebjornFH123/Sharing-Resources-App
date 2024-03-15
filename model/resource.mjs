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
  }

  async save() {
    /// TODO: What happens if the DBManager fails to complete its task?
    // We know that if a user object dos not have the ID, then it cant be in the DB.
    if (this.id == null) {
      return await DBManager.create("Resources", this);
    } else {
      return await DBManager.updateUser(this);
    }
  }

  async delete() {
    /// TODO: What happens if the DBManager fails to complete its task?
    return await DBManager.delete("Resources", this);
  }

  async get(key, select) {
    let query;
    if (key === "userId") {
      query = `SELECT 
          r.id AS resource_id, 
          r.name, 
          r.description, 
          r.type,
          r.key,
          r.address,
          r.country,
          r.zipcode,
          array_agg(ri.img_data) AS images
      FROM 
          "Resources" r
      LEFT JOIN 
          "Resources_images" ri ON r.id = ri.resource_id
      WHERE 
          r.id IN (
              SELECT 
                  ra."resourceId"
              FROM 
                  "Resource_access" ra
              WHERE 
                  ra."userId" = $1
          )
      GROUP BY 
          r.id, r.name, r.description;`;
    } else if (key === "resourceId") {
      console.log(key);
      query = `SELECT 
      r.id, 
      r.name, 
      r.description, 
      r.type,
      r.key,
      r.address,
      r.country,
      r.zipcode,
      array_agg(ri.img_data) AS images
  FROM 
      "Resources" r
  LEFT JOIN 
      "Resources_images" ri ON r.id = ri.resource_id
  WHERE 
      r.id = $1
  GROUP BY 
      r.id, r.name, r.description;`;
    }
    return await DBManager.getData("Resources", select, key, this, query);
  }
}

export default Resource;
