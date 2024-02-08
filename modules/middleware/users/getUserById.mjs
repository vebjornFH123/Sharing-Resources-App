import { HTTPCodes } from "../../httpConstants.mjs";

function getUserById(req, res, next) {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);

  if (user) {
    req.user = user;
    next();
  } else {
    res
      .status(HTTPCodes.ClientSideErrorRespons.NotFound)
      .json({ error: "User not found" });
  }
}

export default getUserById;
