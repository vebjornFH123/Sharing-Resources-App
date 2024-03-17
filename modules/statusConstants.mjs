class StatusCodes {
  static userErrorResponse = {
    userExists: "User already exists",
    failedCreateToken: "Failed to create Token",
    failedToLogin: "Failed to login plies try again later",
    tokenExpired: "Your token has expired",
    invalidToken: "Invalid token",
    incorrectLogin: "Incorrect username or password",
    failedToGetAllUsers: "Failed to get all users",
    failedToDeleteUsers: "Failed to delete users",
    userNotFound: "User can not be found",
    userNotUpdated: "Failed to update user try again",
  };

  static inputErrorResponse = {
    missingInput: "Missing data fields",
  };

  static resourceErrorResponse = {
    noResourcesInDataBase: "You have no resources, please add a resource!",
    failedToCreateResource: "Failed to create resource",
    failedToUpdateResource: "Failed to update resource",
    failedToDeleteResource: "Failed to delete resource",
  };
  static userSuccessfulResponse = {
    successfulLogin: "login successfully",
    successfulDelete: "Account deleted successfully",
    userUpdated: "Account updated successfully",
  };

  static inputSuccessfulResponse = {};

  static resourceSuccessfulResponse = {
    resourceAdd: "Resource add successful",
    resourceUpdated: "Resource updated successful",
    resourceDeleted: "Resource deleted successfully",
  };
}

export default StatusCodes;
