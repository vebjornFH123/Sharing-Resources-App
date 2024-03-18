import express, { json } from "express";
import Resource from "../model/resource.mjs";
import ResourceImage from "../model/image.mjs";
import ResourceAccess from "../model/resourceAccess.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import StatusCodes from "../modules/statusConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import imageManger from "../modules/middleware/fileManger.mjs";
import { checkIfUserExists, createHashPassword } from "../modules/middleware/users/userMiddleware.mjs";
import validateToken from "../modules/middleware/users/validateToken.mjs";

const RESOURCE_API = express.Router();

RESOURCE_API.use(express.json());

RESOURCE_API.post("/get", validateToken, async (req, res, next) => {
  try {
    let resource = new Resource();
    resource.userId = req.userId;
    if (req.body.id) {
      resource.id = req.body.id;
    }
    resource = await resource.get(req.body.type, "*");
    if (resource.length === 0) {
      res.status(HTTPCodes.ClientSideErrorResponse.NotFound).send(StatusCodes.resourceErrorResponse.noResourcesInDataBase).end();
    } else {
      res.status(HTTPCodes.SuccessfulResponse.Ok).json(JSON.stringify(resource)).end();
    }
  } catch (err) {
    console.log("Error occurred while getting resource:", err);
    res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Server cant get resources right now try again later").end();
  }
});

RESOURCE_API.post("/add", imageManger("resourceImages"), validateToken, async (req, res, next) => {
  try {
    const { name, resourceType, country, zipCode, address, description, key } = req.body;
    const usersInfo = JSON.parse(req.body.usersInfo);
    usersInfo.push({
      id: req.userId,
      email: req.userEmail,
      isAdmin: true,
    });
    if (name != "" && resourceType != "" && key != "" && description != "" && usersInfo.length > 0) {
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
          resourceAccess = await resourceAccess.save("add");
        });
        if (req.reducedImages !== null) {
          req.reducedImages.forEach(async (data) => {
            let image = new ResourceImage();
            image.img_data = data;
            image.resource_id = resource.id;
            image = await image.save();
          });
        }
        res.status(HTTPCodes.SuccessfulResponse.Ok).send(StatusCodes.resourceSuccessfulResponse.resourceAdd).end();
      } else {
        res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).send(StatusCodes.resourceErrorResponse.failedToCreateResource).end();
      }
    } else {
      res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).send(StatusCodes.inputErrorResponse.missingInput).end();
    }
  } catch (err) {
    console.log("Error occurred while adding resource:", err);
    res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Server cant add resource right now try again later").end();
  }
});

RESOURCE_API.post("/update", imageManger("resourceImages"), validateToken, async (req, res, next) => {
  try {
    const { name, resourceType, country, zipCode, address, description, key, id } = req.body;
    const usersInfo = JSON.parse(req.body.usersInfo);
    usersInfo.push({
      id: req.userId,
      email: req.userEmail,
      isAdmin: true,
    });
    if (name != "" && resourceType != "" && key != "" && description != "" && usersInfo.length > 0) {
      let resource = new Resource();
      resource.name = name;
      resource.description = description;
      resource.type = resourceType;
      resource.key = key;
      resource.address = address;
      resource.country = country;
      resource.zipcode = zipCode;
      resource.id = id;
      resource = await resource.save();
      if (resource === 1) {
        usersInfo.forEach(async (userInfo) => {
          let resourceAccess = new ResourceAccess();
          resourceAccess.userId = userInfo.id;
          resourceAccess.isAdmin = userInfo.isAdmin;
          resourceAccess.resourceId = id;
          resourceAccess = await resourceAccess.save("update");
        });
        let image = new ResourceImage();
        if (req.reducedImages !== null) {
          req.reducedImages.forEach(async (data) => {
            image.img_data = data;
            image.resource_id = id;
            image = await image.save();
          });
        }
        res.status(HTTPCodes.SuccessfulResponse.Ok).send(StatusCodes.resourceSuccessfulResponse.resourceUpdated).end();
      } else {
        res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).send(StatusCodes.resourceErrorResponse.failedToUpdateResource).end();
      }
    } else {
      res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).send(StatusCodes.inputErrorResponse.missingInput).end();
    }
  } catch (err) {
    console.log("Error occurred while updateing resource:", err);
    res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Server cant update resource right now try again later").end();
  }
});

RESOURCE_API.delete("/deleteResource", validateToken, async (req, res) => {
  try {
    const resource = new Resource();
    resource.id = req.body.id;
    const deleteUser = await resource.delete();
    if (deleteUser === 1) {
      res.status(HTTPCodes.SuccessfulResponse.Ok).send(StatusCodes.resourceSuccessfulResponse.resourceDeleted).end();
    } else {
      res.status(HTTPCodes.ClientSideErrorResponse.Conflict).send(StatusCodes.resourceSuccessfulResponse.failedToDeleteResource).end();
    }
  } catch (err) {
    console.log("Error occurred while deleting resource:", err);
    res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Server cant delete resource right now try again later").end();
  }
});
export default RESOURCE_API;
