import express, { json } from "express";
import Resource from "../model/resource.mjs";
import ResourceImage from "../model/image.mjs";

import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import imageManger from "../modules/fileManger.mjs";
import {
  checkIfUserExists,
  createHashPassword,
} from "../modules/middleware/users/userMiddleware.mjs";

const RESOURCE_API = express.Router();

RESOURCE_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

RESOURCE_API.get("/", (req, res, next) => {
  const resources = {
    id: 1,
    title: "Resource 1",
    description: "Description 1",
    imageUrls: [
      "../Assets/img/icons/eye.png",
      "../Assets/img/Vebjørn-web.jpg",
      "../Assets/img/Vebjørn-web.jpg",
    ],
  };

  res
    .status(HTTPCodes.SuccesfullRespons.Ok)
    .json(JSON.stringify(resources))
    .end();
});

RESOURCE_API.post(
  "/add",
  imageManger("resourceImages"),
  async (req, res, next) => {
    const { name, description } = req.body;
    if (name != "" && description != "") {
      let resource = new Resource();
      resource.name = name;
      resource.description = description;
      resource = await resource.save();
      if (resource.id) {
        console.log(req.reducedImages);
        if (req.reducedImages !== null) {
          resource.images = req.reducedImages;
          req.reducedImages.forEach(async (img) => {
            let image = new ResourceImage();
            image.data = img;
            image.resource_id = resource.id;
            image = await image.save();
          });
        }
      }
      res
        .status(HTTPCodes.SuccesfullRespons.Ok)
        .json(JSON.stringify(resource))
        .end();
    } else {
      res
        .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
        .send("Mangler data felt")
        .end();
    }
  }
);

RESOURCE_API.post("/update", async (req, res, next) => {});

RESOURCE_API.delete("/:id", async (req, res) => {});

export default RESOURCE_API;
