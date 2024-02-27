import { getData } from "../modules/methods.mjs";
import errorHandler from "../modules/errorHandling.mjs";
import { createBasicAuthString } from "../modules/userAuth.mjs";

const loginButton = document.getElementById("loginButton");
const errorHandlerCont = document.getElementById("errorHandlerCont");

loginButton.onclick = async (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const authString = createBasicAuthString(email, password);

  // make a function that check if user has put in email and a strong password;

  getData(`/user/token/${authString}`)
    .then((data) => {
      localStorage.setItem("userData", data);
      // window.location.href = "index.html";  go to next page
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
