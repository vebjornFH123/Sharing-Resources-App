import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";
import { query } from "express";

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {
  #credentials = {};

  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? true : false,
    };
  }

  async update(tableName, data) {
    const client = new pg.Client(this.#credentials);
    console.log(data);
    try {
      await client.connect();
      console.log(data);
      if (data.profilepic === null) {
        delete data.profilepic;
      }
      const columnNames = Object.keys(data).slice(0, -1);
      const values = Object.values(data);
      const placeholders = columnNames
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      console.log(values, placeholders, values.length);
      const updateQuery = `
        UPDATE "public"."${tableName}"
        SET ${columnNames
          .map((column, index) => `"${column}" = $${index + 1}`)
          .join(", ")} WHERE id = $${values.length};
    `;
      const output = await client.query(updateQuery, values);
      return output.rowCount;
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module separate from your server
      console.error(error);
    } finally {
      client.end(); // Always disconnect from the database.
    }
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

  async getData(tableName, select, key, data, query) {
    const client = new pg.Client(this.#credentials);
    console.log("data", data);
    try {
      await client.connect();
      const columnNames = data === undefined ? null : Object.keys(data);
      const values = data === undefined ? null : Object.values(data);
      console.log(columnNames, values, key);
      let output;
      if (tableName === "Users" || tableName === "Resource_access") {
        if (key === undefined) {
          output = await client.query(
            `Select ${select} from "public"."${tableName}"`
          );
        } else {
          console.log("heiheihei", key);
          output = await client.query(
            `Select ${select} from "public"."${tableName}" WHERE ${key} = $1;`,
            values
          );
          console.log("hei", values);
        }
      } else {
        output = await client.query(query, values);
      }
      console.log("TEST123", output.rows);

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
