import express, { json } from "express";
import Resource from "../model/resource.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import fileManger from "../modules/fileManger.mjs";
import {
  checkIfUserExists,
  createHashPassword,
} from "../modules/middleware/users/userMiddleware.mjs";

const RESOURCE_API = express.Router();

RESOURCE_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

RESOURCE_API.get("/", (req, res, next) => {
  const resources = [
    {
      id: 1,
      title: "Resource 1",
      description: "Description 1",
      imageUrl: "image1.jpg",
    },
    {
      id: 2,
      title: "Resource 2",
      description: "Description 2",
      imageUrl: "image2.jpg",
    },
    {
      id: 3,
      title: "Resource 3",
      description: "Description 3",
      imageUrl: "image3.jpg",
    },
  ];

  res
    .status(HTTPCodes.SuccesfullRespons.Ok)
    .json(JSON.stringify(resources))
    .end();
});

RESOURCE_API.post("/add", async (req, res, next) => {});

RESOURCE_API.post("/update", async (req, res, next) => {});

RESOURCE_API.delete("/:id", async (req, res) => {});

export default RESOURCE_API;
