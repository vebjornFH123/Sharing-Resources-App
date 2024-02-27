import express, { json } from "express";
import { User, users } from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import getUserById from "../modules/middleware/users/getUserById.mjs";
import DBManager from "../modules/storageManager.mjs";
import { createHashPassword } from "../modules/verification.mjs";
import checkIfUserExists from "../modules/middleware/users/checkIfUserExists.mjs";

const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

USER_API.get("/", (req, res, next) => {
  SuperLogger.log("Demo of logging tool");
  SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
});

// get user by password
USER_API.get("/token/:token", async (req, res, next) => {
  const authString = createHashPassword(req.params.token);

  try {
    const userData = await DBManager.getUser("pswhash", authString);
    if (userData.length > 0) {
      res
        .status(HTTPCodes.SuccesfullRespons.Ok)
        .json(JSON.stringify(userData))
        .end();
    } else {
      res
        .status(HTTPCodes.ClientSideErrorRespons.NotFound)
        .send("Incorrect username or password.")
        .end();
    }
  } catch (error) {
    console.error("An error occurred while fetching user data:", error);
    res
      .status(HTTPCodes.ServerSideErrorRespons.InternalError)
      .send("An error occurred while fetching user data")
      .end();
  }
});

USER_API.get("/id/:id", async (req, res, next) => {
  console.log(req.params);

  console.log(await DBManager.getUser("id", req.params.id));
});

USER_API.post("/", async (req, res, next) => {
  // This is using javascript object destructuring.
  // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
  // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
  const { name, email, authString } = req.body;

  if (name != "" && email != "" && authString != "") {
    let user = new User();
    user.name = name;
    user.email = email;

    ///TODO: Do not save passwords.

    console.log(authString);
    user.pswHash = createHashPassword(authString);

    ///TODO: Does the user exist?
    const exists = await checkIfUserExists(email);

    if (!exists) {
      user = await user.save();
      res
        .status(HTTPCodes.SuccesfullRespons.Ok)
        .json(JSON.stringify(user))
        .end();
    } else {
      res
        .status(HTTPCodes.ClientSideErrorRespons.Conflict)
        .send("Email already exists.")
        .end();
    }
  } else {
    res
      .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
      .send("Mangler data felt")
      .end();
  }
});

USER_API.post("/:id", (req, res, next) => {
  /// TODO: Edit user
  const user = new User(); //TODO: The user info comes as part of the request
  user.save();
});

USER_API.delete("/:id", (req, res) => {
  /// TODO: Delete user.
  const user = new User(); //TODO: Actual user
  user.delete();
});

export default USER_API;
