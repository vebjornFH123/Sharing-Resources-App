import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HTTPCodes } from "../../httpConstants.mjs";
import StatusCodes from "../../statusConstants.mjs";

async function createToken(req, res, next) {
  console.log(req.user);
  try {
    const payload = { id: req.user.id, email: req.user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "3h",
    });
    res.status(HTTPCodes.SuccessfulResponse.Ok).json({ token }).end();
  } catch (error) {
    res
      .status(HTTPCodes.SuccessfulResponse.InternalError)
      .send(StatusCodes.userErrorResponse.failedToLogin)
      .end();
  }
}

export default createToken;
