import express, { json } from "express";
import User from "../model/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import StatusCodes from "../modules/statusConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import imageManger from "../modules/middleware/fileManger.mjs";
import {
  checkIfUserExists,
  createHashPassword,
} from "../modules/middleware/users/userMiddleware.mjs";
import createToken from "../modules/middleware/users/createToken.mjs";
import validateToken from "../modules/middleware/users/validateToken.mjs";

const USER_API = express.Router();

USER_API.use(express.json());

USER_API.post(
  "/signUp",
  imageManger("profilePicture"),
  checkIfUserExists,
  async (req, res, next) => {
    try {
      const { name, email, authString } = req.body;
      if (name != "" && email != "" && authString != "") {
        let user = new User();
        user.name = name;
        user.email = email;
        user.profilepic =
          req.reducedImages === null ? null : req.reducedImages[0];
        user.pswhash = createHashPassword(authString);
        user = await user.save();
        if (user.length === 0) {
          res
            .status(HTTPCodes.ClientSideErrorResponse.Conflict)
            .send(StatusCodes.userErrorResponse.incorrectLogin)
            .end();
        } else {
          req.user = user;
          next();
        }
      } else {
        res
          .status(HTTPCodes.ClientSideErrorResponse.BadRequest)
          .send(StatusCodes.inputErrorResponse.missingInput)
          .end();
      }
    } catch (err) {
      console.log("Error occurred while signUp:", err);
      res
        .status(HTTPCodes.ServerSideErrorResponse.InternalServerError)
        .send("Server cant sign you up right now try again later")
        .end();
    }
  },
  createToken
);

USER_API.post(
  "/logIn",
  async (req, res, next) => {
    try {
      const { email, authString } = req.body;
      if (email != "" && authString != "") {
        let user = new User();
        user.pswhash = createHashPassword(authString);
        user = await user.getUser("pswHash", "email, id");
        if (user.length === 0) {
          res
            .status(HTTPCodes.ClientSideErrorResponse.Conflict)
            .send(StatusCodes.userErrorResponse.incorrectLogin)
            .end();
        } else {
          req.user = user[0];
          next();
        }
      } else {
        res
          .status(HTTPCodes.ClientSideErrorResponse.BadRequest)
          .send(StatusCodes.inputErrorResponse.missingInput)
          .end();
      }
    } catch (err) {
      console.log("Error occurred while signUp:", err);
      res
        .status(HTTPCodes.ServerSideErrorResponse.InternalServerError)
        .send("Server cant sign you in right now try again later")
        .end();
    }
  },
  createToken
);

USER_API.post(
  "/update",
  imageManger("profilePicture"),
  validateToken,
  async (req, res, next) => {
    try {
      const { name, email, authString, password } = req.body;
      if (name != "" && email != "" && authString != "" && password != "") {
        let user = new User();
        user.name = name;
        user.email = email;
        user.profilepic =
          req.reducedImages === null ? null : req.reducedImages[0];
        user.pswhash = createHashPassword(authString);
        user.id = req.userId;
        user = await user.save();
        if (user === 1) {
          res
            .status(HTTPCodes.SuccessfulResponse.Ok)
            .send(StatusCodes.userSuccessfulResponse.userUpdated)
            .end();
        } else {
          res
            .status(HTTPCodes.ClientSideErrorResponse.Conflict)
            .send(StatusCodes.userErrorResponse.userNotUpdated)
            .end();
        }
      } else {
        res
          .status(HTTPCodes.ClientSideErrorResponse.BadRequest)
          .send(StatusCodes.inputErrorResponse.missingInput)
          .end();
      }
    } catch (err) {
      console.log("Error occurred while signUp:", err);
      res
        .status(HTTPCodes.ServerSideErrorResponse.InternalServerError)
        .send("Server cant update user info right now try again later")
        .end();
    }
  }
);

USER_API.post("/get", validateToken, async (req, res, next) => {
  let user = new User();
  user.id = req.userId;
  if (req.body.key === "*") {
    user = await user.getUser(undefined, req.body.get);
  } else {
    user = await user.getUser("id", req.body.get);
  }
  if (!user) {
    res
      .status(HTTPCodes.ClientSideErrorResponse.Conflict)
      .send(StatusCodes.userErrorResponse.userNotFound)
      .end();
  }
  res.status(HTTPCodes.SuccessfulResponse.Ok).json(user).end();
});

USER_API.delete("/deleteUser", validateToken, async (req, res) => {
  try {
    const user = new User();
    user.name = null;
    user.email = null;
    user.profilepic = null;
    user.pswhash = null;
    user.id = req.userId;
    const deleteUser = await user.delete();
    if (deleteUser === 1) {
      res
        .status(HTTPCodes.SuccessfulResponse.Ok)
        .send(StatusCodes.userSuccessfulResponse.successfulDelete)
        .end();
    } else {
      res
        .status(HTTPCodes.ClientSideErrorResponse.Conflict)
        .send(StatusCodes.userErrorResponse.failedToDeleteUsers)
        .end();
    }
  } catch (err) {
    console.log("Error occurred while signUp:", err);
    res
      .status(HTTPCodes.ServerSideErrorResponse.InternalServerError)
      .send("Server cant delete user right now try again later")
      .end();
  }
});

export default USER_API;
