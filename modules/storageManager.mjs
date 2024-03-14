import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {
  #credentials = {};

  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? true : false,
    };
  }

  async updateUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      let output;

      if (user.profilepic === null) {
        output = await client.query(
          'Update "public"."Users" set "name" = $1, "email" = $2, "pswhash" = $3 where id = $3;',
          [user.name, user.email, user.pswHash, user.id]
        );
      } else {
        output = await client.query(
          'Update "public"."Users" set "name" = $1, "email" = $2, "pswhash" = $3 "profilepic" = $4 where id = $5;',
          [user.name, user.email, user.pswHash, user.profilepic, user.id]
        );
      }

      // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
      // Of special intrest is the rows and rowCount properties of this object.

      //TODO Did we update the user?
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module seperate from your server
    } finally {
      client.end(); // Always disconnect from the database.
    }

    return user;
  }

  async delete(tableName, data, deleteType) {
    const client = new pg.Client(this.#credentials);
    try {
      await client.connect();
      const columnNames = Object.keys(data).slice(0, -1);
      const values = Object.values(data);
      let output;
      if (deleteType === null) {
        output = await client.query(
          `UPDATE "public"."${tableName}" SET ${columnNames
            .map((column, index) => `"${column}" = $${index + 1}`)
            .join(", ")} WHERE id = $${columnNames.length + 1}`,
          values
        );
      } else {
        output = await client.query(
          `DELETE FROM "${tableName}" WHERE id = $1;`,
          [data.id]
        );
      }
      return output.rowCount;
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module seperate from your server
      console.log("yes", error);
    } finally {
      client.end(); // Always disconnect from the database.
    }

    return data;
  }

  async create(tableName, data) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      console.log(data);
      const columnNames = Object.keys(data);
      const placeholders = columnNames
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      const values = Object.values(data);
      const output = await client.query(
        `
        INSERT INTO "${tableName}" (${columnNames
          .map((column) => `"${column}"`)
          .join(", ")})
        VALUES (${placeholders})
        RETURNING id
      `,
        values
      );
      if (output.rows.length == 1) {
        // We stored the user in the DB.
        data.id = output.rows[0].id;
      }
    } catch (error) {
      console.error(error);
      //TODO : Error handling?? Remember that this is a module seperate from your server
    } finally {
      client.end(); // Always disconnect from the database.
    }

    return data;
  }

  async getData(tableName, select, key, data) {
    const client = new pg.Client(this.#credentials);
    console.log(data);

    const columnNames = data === undefined ? null : Object.keys(data);
    const values = data === undefined ? null : Object.values(data);
    try {
      await client.connect();
      let output;
      if (tableName === "Users") {
        if (key === undefined) {
          console.log("hdfdjksfihdsjkfoipdshu", key);
          output = await client.query(
            `Select ${select} from "public"."${tableName}"`
          );
        } else {
          console.log("fkshdufihdsjhopifds", values);
          output = await client.query(
            `Select ${select} from "public"."${tableName}" WHERE ${key} = $1;`,
            values
          );
        }
      } else {
        output = await client.query(
          `SELECT r.id AS resource_id, r.name, r.description, array_agg(ri.img_data) AS images
          FROM "Resources" r
          JOIN "Resources_images" ri ON r.id = ri.resource_id
          WHERE r.id = $1
          GROUP BY r.id, r.name, r.description`,
          values
        );
      }
      return output.rows;
    } catch (error) {
      console.error(error);
    } finally {
      client.end(); // Always disconnect from the database
    }
  }
}

// The following is thre examples of how to get the db connection string from the enviorment variables.
// They accomplish the same thing but in different ways.
// It is a judgment call which one is the best. But go for the one you understand the best.

// 1:
let connectionString =
  process.env.ENVIORMENT == "local"
    ? process.env.DB_CONNECTIONSTRING_LOCAL
    : process.env.DB_CONNECTIONSTRING_PROD;

// We are using an enviorment variable to get the db credentials
if (connectionString == undefined) {
  throw "You forgot the db connection string";
}

export default new DBManager(connectionString);

//
