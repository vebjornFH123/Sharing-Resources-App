import { postTo, getData } from "../modules/methods.mjs";
import errorHandler from "../modules/errorHandling.mjs";
import { createBasicAuthString } from "../modules/userAuth.mjs";

const createUserButton = document.getElementById("createUserButton");
const errorHandlerCont = document.getElementById("errorHandlerCont");

createUserButton.onclick = async (e) => {
  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const authString = createBasicAuthString(email, password);

  const user = { name, email, authString };
  postTo("/user", user)
    .then((data) => {
      if (data.ok) {
        getData(`/user/token/${authString}`)
          .then((data) => {
            localStorage.setItem("userData", data);
            // window.location.href = "index.html";  go to next page
          })
          .catch((error) => {
            errorHandler(errorHandlerCont, error);
          });
      }
    })
    .catch((error) => {
      errorHandler(errorHandlerCont, error);
    });
};
