import { postTo } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";
import { createBasicAuthString } from "../../modules/userAuth.mjs";

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
      console.log(data);
      localStorage.setItem("userData", data);
      // window.location.href = "index.html";  go to next page
    })
    .catch((error) => {
      errorHandler(errorHandlerCont, error);
    });
};
