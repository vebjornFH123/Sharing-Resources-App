import "dotenv/config";
import express from "express";
import USER_API from "./routes/usersRoute.mjs";
import RESOURCE_API from "./routes/resourcesRoute.mjs";
import SuperLogger from "./modules/SuperLogger.mjs";
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";
import path from "path";
printDeveloperStartupInportantInformationMSG();

// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = process.env.PORT || 8080;
server.set("port", port);

// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

// Defining a folder that will contain static files.
server.use(express.static("public"));
// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);

server.use("/resource", RESOURCE_API);
// A get request handler example)
server.get("/", (req, res, next) => {
  res
    .status(200)
    .send(JSON.stringify({ msg: "These are not the droids...." }))
    .end();
});

// Define a route to serve the index.html file
server.get("/map", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
server.get("/account", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

server.get("/login", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

server.get("/signUp", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
server.get("/my_resource", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
server.get("/edit_resource", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
// Start the server
server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});
