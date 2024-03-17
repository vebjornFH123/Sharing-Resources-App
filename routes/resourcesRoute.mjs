import express, { json } from "express";
import Resource from "../model/resource.mjs";
import ResourceImage from "../model/image.mjs";
import ResourceAccess from "../model/resourceAccess.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import StatusCodes from "../modules/statusConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import imageManger from "../modules/fileManger.mjs";
import {
  checkIfUserExists,
  createHashPassword,
} from "../modules/middleware/users/userMiddleware.mjs";
import validateToken from "../modules/middleware/users/validateToken.mjs";

const RESOURCE_API = express.Router();

RESOURCE_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

RESOURCE_API.post("/get", validateToken, async (req, res, next) => {
  let resource = new Resource();
  console.log(req.body);
  resource.userId = req.userId;
  if (req.body.id) {
    resource.id = req.body.id;
  }
  resource = await resource.get(req.body.type, "*");
  console.log(resource);
  if (resource.length === 0) {
    res
      .status(HTTPCodes.ClientSideErrorResponse.NotFound)
      .send(StatusCodes.resourceErrorResponse.noResourcesInDataBase)
      .end();
  } else {
    res
      .status(HTTPCodes.SuccessfulResponse.Ok)
      .json(JSON.stringify(resource))
      .end();
  }
});

RESOURCE_API.post(
  "/add",
  imageManger("resourceImages"),
  validateToken,
  async (req, res, next) => {
    const { name, resourceType, country, zipCode, address, description, key } =
      req.body;
    const usersInfo = JSON.parse(req.body.usersInfo);
    usersInfo.push({
      id: req.userId,
      email: req.userEmail,
      isAdmin: true,
    });
    console.log(usersInfo);
    if (
      name != "" &&
      resourceType != "" &&
      key != "" &&
      description != "" &&
      usersInfo.length > 0
    ) {
      let resource = new Resource();
      resource.name = name;
      resource.description = description;
      resource.type = resourceType;
      resource.key = key;
      resource.address = address;
      resource.country = country;
      resource.zipcode = zipCode;
      resource = await resource.save();
      if (resource.id) {
        usersInfo.forEach(async (userInfo) => {
          let resourceAccess = new ResourceAccess();
          resourceAccess.userId = userInfo.id;
          resourceAccess.resourceId = resource.id;
          resourceAccess.isAdmin = userInfo.isAdmin;
          resourceAccess = await resourceAccess.save();
        });
        res
          .status(HTTPCodes.SuccessfulResponse.Ok)
          .send(StatusCodes.resourceSuccessfulResponse.resourceAdd)
          .end();
      } else {
        res
          .status(HTTPCodes.ClientSideErrorResponse.BadRequest)
          .send("Failed to create resource")
          .end();
      }
    } else {
      res
        .status(HTTPCodes.ClientSideErrorResponse.BadRequest)
        .send("Mangler data felt")
        .end();
    }
  }
);

RESOURCE_API.post("/update", async (req, res, next) => {
  const { name, resourceType, country, zipCode, address, description, key } =
    req.body;
  const usersInfo = JSON.parse(req.body.usersInfo);
  if (
    name != "" &&
    resourceType != "" &&
    key != "" &&
    description != "" &&
    usersInfo.length > 0
  ) {
    let resource = new Resource();
    resource.name = name;
    resource.description = description;
    resource.type = resourceType;
    resource.key = key;
    resource.address = address;
    resource.country = country;
    resource.zipcode = zipCode;
    resource = await resource.save();
    if (resource.id) {
      console.log(usersInfo);
      usersInfo.forEach(async (userInfo) => {
        console.log(userInfo);
        let resourceAccess = new ResourceAccess();
        resourceAccess.userId = userInfo.id;
        resourceAccess.resourceId = resource.id;
        resourceAccess.isAdmin = userInfo.isAdmin;
        resourceAccess = await resourceAccess.save();
        console.log(resourceAccess);
      });
      if (req.reducedImages !== null) {
        resource.images = req.reducedImages;
        req.reducedImages.forEach(async (img) => {
          let image = new ResourceImage();
          image.img_data = img;
          image.resource_id = resource.id;
          image = await image.save();
        });
      }
      res
        .status(HTTPCodes.SuccessfulResponse.Ok)
        .json(JSON.stringify(resource))
        .end();
    } else {
      res
        .status(HTTPCodes.ClientSideErrorResponse.BadRequest)
        .send("Failed to create resource")
        .end();
    }
  } else {
    res
      .status(HTTPCodes.ClientSideErrorResponse.BadRequest)
      .send("Mangler data felt")
      .end();
  }
});

RESOURCE_API.delete("/:id", async (req, res) => {
  /// TODO: Delete user.
  const resource = new Resource(); //TODO: Actual user
  resource.id = 80;
  const deleteUser = await resource.delete();

  console.log(deleteUser);

  if (deleteUser === 1) {
    res
      .status(HTTPCodes.SuccessfulResponse.Ok)
      .send("Account deleted successfully")
      .end();
  } else {
    res
      .status(HTTPCodes.ClientSideErrorResponse.Conflict)
      .send("Failed to delete user")
      .end();
  }
});

export default RESOURCE_API;
