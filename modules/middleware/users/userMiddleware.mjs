import crypto from "crypto";
import User from "../../../model/user.mjs";

async function checkIfUserExists(req, res, next) {
  let user = new User();
  user.email = req.body.email;
  console.log(user.email);
  user = await user.getUser("email", "*");
  if (user.length === 0) {
    req.exists = false;
  } else {
    req.exists = true;
  }
  next();
}

function createHashPassword(authString) {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY);
  hmac.update(authString);
  return hmac.digest("hex");
}

export { checkIfUserExists, createHashPassword };
