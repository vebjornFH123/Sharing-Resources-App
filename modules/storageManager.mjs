import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";
import { query } from "express";

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
    try {
      await client.connect();
      if (data.profilepic === null) {
        delete data.profilepic;
      }
      const columnNames = Object.keys(data).slice(0, -1);
      const values = Object.values(data);
      const placeholders = columnNames
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      const updateQuery = `
        UPDATE "public"."${tableName}"
        SET ${columnNames
          .map((column, index) => `"${column}" = $${index + 1}`)
          .join(", ")} WHERE id = $${values.length};
    `;
      const output = await client.query(updateQuery, values);
      return output.rowCount;
    } catch (err) {
      console.log(`Error occurred while updating data in ${tableName}:`, err);
      throw err;
    } finally {
      client.end();
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
    } catch (err) {
      console.log(`Error occurred while updating data in ${tableName}:`, err);
      throw err;
    } finally {
      client.end();
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
        data.id = output.rows[0].id;
      }
    } catch (err) {
      console.log(`Error occurred while updating data in ${tableName}:`, err);
      throw err;
    } finally {
      client.end();
    }

    return data;
  }

  async getData(tableName, select, key, data, query) {
    const client = new pg.Client(this.#credentials);
    try {
      await client.connect();
      const columnNames = data === undefined ? null : Object.keys(data);
      const values = data === undefined ? null : Object.values(data);
      let output;
      if (tableName === "Users" || tableName === "Resource_access") {
        if (key === undefined) {
          output = await client.query(
            `Select ${select} from "public"."${tableName}"`
          );
        } else {
          output = await client.query(
            `Select ${select} from "public"."${tableName}" WHERE ${key} = $1;`,
            values
          );
        }
      } else {
        output = await client.query(query, values);
      }
      return output.rows;
    } catch (err) {
      console.log(`Error occurred while updating data in ${tableName}:`, err);
      throw err;
    } finally {
      client.end();
    }
  }
}

let connectionString =
  process.env.ENVIORMENT == "local"
    ? process.env.DB_CONNECTIONSTRING_LOCAL
    : process.env.DB_CONNECTIONSTRING_PROD;

if (connectionString == undefined) {
  throw "You forgot the db connection string";
}

export default new DBManager(connectionString);
