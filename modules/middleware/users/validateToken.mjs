import jwt from "jsonwebtoken";
import { HTTPCodes } from "../../httpConstants.mjs";
import StatusCodes from "../../statusConstants.mjs";

async function validateToken(req, res, next) {
  console.log(req.body);
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(HTTPCodes.ClientSideErrorResponse.Conflict).send(StatusCodes.userErrorResponse.tokenExpired).end();
    } else {
      res.status(HTTPCodes.ClientSideErrorResponse.Conflict).send(StatusCodes.userErrorResponse.invalidToken).end();
    }
  }
}

export default validateToken;
