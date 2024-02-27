import crypto from "crypto";

console.log(process.env.SECRET_KEY);

function createHashPassword(authString) {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY);
  hmac.update(authString);
  return hmac.digest("hex");
}

export { createHashPassword };
