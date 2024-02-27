import { HTTPCodes } from "../../httpConstants.mjs";
import { users } from "../../user.mjs";

function getUserById(req, res, next) {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);
  console.log(user);
  if (user) {
    req.user = user;
    next();
  } else {
    res
      .status(HTTPCodes.ClientSideErrorResponse.NotFound)
      .json({ error: "User not found" });
  }
}

export default getUserById;
