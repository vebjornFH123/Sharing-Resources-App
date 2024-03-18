import crypto from "crypto";
import User from "../../../model/user.mjs";
import { HTTPCodes } from "../../httpConstants.mjs";
import StatusCodes from "../../statusConstants.mjs";

async function checkIfUserExists(req, res, next) {
  let user = new User();
  user.email = req.body.email;
  user = await user.getUser("email", "*");
  if (user.length === 0) {
    next();
  } else {
    res.status(HTTPCodes.ClientSideErrorResponse.Conflict).send(StatusCodes.userErrorResponse.userExists).end();
  }
}

function createHashPassword(authString) {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY);
  hmac.update(authString);
  return hmac.digest("hex");
}

export { checkIfUserExists, createHashPassword };
