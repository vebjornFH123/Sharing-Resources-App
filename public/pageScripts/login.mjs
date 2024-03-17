import { postTo } from "../modules/methods.mjs";
import errorHandler from "../modules/errorHandling.mjs";
import { createBasicAuthString } from "../modules/userAuth.mjs";
import { storage, options } from "../modules/storage.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const loginButton = document.getElementById("loginButton");
const errorHandlerCont = document.getElementById("errorHandlerCont");
const imgTest = document.getElementById("imgTest");

loginButton.onclick = async (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const authString = email + password;

  const userData = { email, authString };

  postTo("/user/logIn", userData, "JSON")
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

// go to sign up page
const signInUserBtn = document.getElementById("signInUserBtn");
signInUserBtn.onclick = (e) => {
  navigateInApp(routeOptions.signUp);
};
