import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {
  #credentials = {};

  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? process.env.DB_SSL : false,
    };
  }

  async updateUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'Update "public"."Users" set "name" = $1, "email" = $2, "pswhash" = $3 where id = $4;',
        [user.name, user.email, user.pswHash, user.id]
      );
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

  async deleteUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'Delete from "public"."Users"  where id = $1;',
        [user.id]
      );

      // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
      // Of special intrest is the rows and rowCount properties of this object.

      //TODO: Did the user get deleted?
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module seperate from your server
    } finally {
      client.end(); // Always disconnect from the database.
    }

    return user;
  }

  async createUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'INSERT INTO "public"."Users"("name", "email", "pswhash") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;',
        [user.name, user.email, user.pswHash]
      );

      // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
      // Of special intrest is the rows and rowCount properties of this object.

      if (output.rows.length == 1) {
        // We stored the user in the DB.
        user.id = output.rows[0].id;
      }
    } catch (error) {
      console.error(error);
      //TODO : Error handling?? Remember that this is a module seperate from your server
    } finally {
      client.end(); // Always disconnect from the database.
    }

    return user;
  }

  async getUser(key, pswHash) {
    const client = new pg.Client(this.#credentials);
    try {
      await client.connect();
      const output = await client.query(
        `Select * from "public"."Users" WHERE ${key} = $1`,
        [pswHash]
      );
      return output.rows;
    } catch (error) {
      console.error(error);
      //TODO : Error handling?? Remember that this is a module seperate from your server
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

// 2:
connectionString = process.env.DB_CONNECTIONSTRING_LOCAL;
if (process.env.ENVIORMENT != "local") {
  connectionString = process.env.DB_CONNECTIONSTRING_PROD;
}

//3:
connectionString =
  process.env["DB_CONNECTIONSTRING_" + process.env.ENVIORMENT.toUpperCase()];

// We are using an enviorment variable to get the db credentials
if (connectionString == undefined) {
  throw "You forgot the db connection string";
}

export default new DBManager(connectionString);

//
