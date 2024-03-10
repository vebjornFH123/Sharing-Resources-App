import { postTo } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";
import { createBasicAuthString } from "../../modules/userAuth.mjs";

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
      console.log(data);
      localStorage.setItem("userData", data);
    })
    .catch((error) => {
      errorHandler(errorHandlerCont, error);
    });
};

// go to sign up page
const signInUserBtn = document.getElementById("signInUserBtn");
signInUserBtn.onclick = (e) => {
  window.location.href = "signUp.html";
};
