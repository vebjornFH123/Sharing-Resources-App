import express, { json } from "express";
import User from "../model/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import imageManger from "../modules/fileManger.mjs";
import {
  checkIfUserExists,
  createHashPassword,
} from "../modules/middleware/users/userMiddleware.mjs";

const USER_API = express.Router();

USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

USER_API.get("/all", async (req, res, next) => {
  let user = new User();
  user = await user.getUser(undefined, "email, id");
  if (user) {
    console.log(user);
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
  } else {
    res
      .status(HTTPCodes.ClientSideErrorRespons.Conflict)
      .send("Incorrect username or password.")
      .end();
  }
});

USER_API.post(
  "/signUp",
  imageManger("profilePicture"),
  checkIfUserExists,
  async (req, res, next) => {
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { name, email, authString } = req.body;
    if (name != "" && email != "" && authString != "") {
      let user = new User();
      user.name = name;
      user.email = email;
      user.profilepic = req.reducedImages[0];
      user.pswhash = createHashPassword(authString);
      if (req.exists === false) {
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
  }
);

USER_API.post("/logIn", async (req, res, next) => {
  // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
  // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
  const { email, authString } = req.body;
  if (email != "" && authString != "") {
    let user = new User();
    user.pswhash = createHashPassword(authString);
    user = await user.getUser("pswHash", "*");
    if (user) {
      res
        .status(HTTPCodes.SuccesfullRespons.Ok)
        .json(JSON.stringify(user))
        .end();
    } else {
      res
        .status(HTTPCodes.ClientSideErrorRespons.Conflict)
        .send("Incorrect username or password.")
        .end();
    }
  } else {
    res
      .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
      .send("Mangler data felt")
      .end();
  }
});

USER_API.post(
  "/update",
  imageManger("profilePicture"),
  async (req, res, next) => {
    const { name, email, authString, id } = req.body;
    console.log(req.reducedImage);
    if (name != "" && email != "" && authString != "") {
      let user = new User();
      user.name = name;
      user.email = email;
      user.profilepic = req.reducedImages[0];
      user.pswhash = createHashPassword(authString);
      user.id = id;
      if (!req.exists) {
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
  }
);

USER_API.delete("/:id", async (req, res) => {
  /// TODO: Delete user.
  const user = new User(); //TODO: Actual user
  user.name = null;
  user.email = null;
  user.profilepic = null;
  user.pswhash = null;
  user.id = req.params.id;
  const deleteUser = await user.delete();

  if (deleteUser === 1) {
    res
      .status(HTTPCodes.SuccesfullRespons.Ok)
      .send("Account deleted successfully")
      .end();
  } else {
    res
      .status(HTTPCodes.ClientSideErrorRespons.Conflict)
      .send("Failed to delete user")
      .end();
  }
});

export default USER_API;
