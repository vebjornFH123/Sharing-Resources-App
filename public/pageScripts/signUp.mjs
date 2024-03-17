import { postTo } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";
import { storage, options } from "../modules/storage.mjs";
import { createBasicAuthString } from "../../modules/userAuth.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const createUserButton = document.getElementById("createUserButton");
const errorHandlerCont = document.getElementById("errorHandlerCont");

createUserButton.onclick = async (e) => {
  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const authString = email + password;
  const profilePicture = document.getElementById("profilePicture").files[0];

  const userData = new FormData();
  userData.append("name", name);
  userData.append("email", email);
  userData.append("authString", authString);
  userData.append("profilePicture", profilePicture);
  postTo("/user/signUp", userData)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      storage(
        options.localStorage,
        options.setItem,
        "userToken",
        JSON.stringify(data)
      );
      navigateInApp(routeOptions.home);
    })
    .catch((error) => {
      errorHandler(errorHandlerCont, error);
    });
};
