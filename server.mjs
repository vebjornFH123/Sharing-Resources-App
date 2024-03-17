import "dotenv/config";
import express from "express";
import USER_API from "./routes/usersRoute.mjs";
import RESOURCE_API from "./routes/resourcesRoute.mjs";
import SuperLogger from "./modules/SuperLogger.mjs";
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";
import checkConnection from "./modules/middleware/checkInternet.mjs";
import path from "path";
printDeveloperStartupInportantInformationMSG();

const server = express();
const port = process.env.PORT || 8080;
server.set("port", port);

server.use(checkConnection);

const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());

server.use(express.static("public"));

server.use("/user", USER_API);

server.use("/resource", RESOURCE_API);

server.get("/*", (req, res, next) => {
  res.sendFile("index.html", { root: "public" });
});

server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});
