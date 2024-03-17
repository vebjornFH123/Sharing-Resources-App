import dns from "dns";
import { HTTPCodes } from "../httpConstants.mjs";

function checkConnection(req, res, next) {
  if (req.hostname === "localhost" || req.hostname === "127.0.0.1") {
    next();
  } else {
    dns.lookup("google.com", (err) => {
      if (err && err.code === "ENOTFOUND") {
        const error = new Error("No internet connection");
        error.status = HTTPCodes.ServerErrorResponse.ServiceUnavailable;
        next(error);
      } else {
        next();
      }
    });
  }
}

export default checkConnection;
