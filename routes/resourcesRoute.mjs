import express, { json } from "express";
import Resource from "../model/resource.mjs";
import ResourceImage from "../model/image.mjs";
import ResourceAccess from "../model/resourceAccess.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import imageManger from "../modules/fileManger.mjs";
import {
  checkIfUserExists,
  createHashPassword,
} from "../modules/middleware/users/userMiddleware.mjs";

const RESOURCE_API = express.Router();

RESOURCE_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

RESOURCE_API.get("/:type/:id", async (req, res, next) => {
  let resource = new Resource();
  resource.id = req.params.id;
  resource = await resource.get(req.params.type, "*");
  if (resource) {
    res
      .status(HTTPCodes.SuccesfullRespons.Ok)
      .json(JSON.stringify(resource))
      .end();
  }
});

RESOURCE_API.post(
  "/add",
  imageManger("resourceImages"),
  async (req, res, next) => {
    const { name, resourceType, country, zipCode, address, description, key } =
      req.body;
    console.log(req.body);
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
          .status(HTTPCodes.SuccesfullRespons.Ok)
          .json(JSON.stringify(resource))
          .end();
      } else {
        res
          .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
          .send("Failed to create resource")
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

RESOURCE_API.post("/update", async (req, res, next) => {});

RESOURCE_API.delete("/:id", async (req, res) => {
  /// TODO: Delete user.
  const resource = new Resource(); //TODO: Actual user
  resource.id = 80;
  const deleteUser = await resource.delete();

  console.log(deleteUser);

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

export default RESOURCE_API;
