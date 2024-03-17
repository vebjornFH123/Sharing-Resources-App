import { postTo, deleteData, dataOptions } from "../modules/methods.mjs";
import errorHandler from "../modules/errorHandling.mjs";
import successHandling from "../modules/successHandling.mjs";
import warningPopup from "../modules/warningPopup.mjs";
import { createBasicAuthString } from "../modules/userAuth.mjs";
import { storage, options } from "../modules/storage.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const saveChangesBtn = document.getElementById("saveChangesBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const logoutBtn = document.getElementById("logoutBtn");
const errorHandlerCont = document.getElementById("errorHandlerCont");
const successHandlerCont = document.getElementById("successHandlerCont");

// inputs
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const profilePicture = document.getElementById("profilePicture");

const usernameHeader = document.getElementById("usernameHeader");
const profileImage = document.getElementById("profileImage");

//get userData from localStorage
const userToken = storage(options.localStorage, options.getItem, "userToken");

const userInfo = {
  token: userToken.token,
  get: "profilepic, name, email",
};

postTo("/user/get", userInfo, dataOptions.json)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((data) => {
    const user = data[0];
    usernameHeader.innerText = user.name;
    username.value = user.name;
    email.value = user.email;
    let imageURL;
    if (user.profilepic) {
      const bufferImgData = new Uint8Array(user.profilepic.data);
      const blobData = new Blob([bufferImgData], {
        type: "image/jpeg",
      });
      imageURL = URL.createObjectURL(blobData);
    } else {
      imageURL = "../Assets/img/icons/Logo.svg";
    }

    document.getElementById("profileImage").src = imageURL;
  })
  .catch((err) => {
    errorHandler(errorHandlerCont, err);
  });

deleteAccountBtn.addEventListener("click", async (e) => {
  // Example usage
  warningPopup().then((response) => {
    if (response) {
      deleteData(`/user/deleteUser`, userToken)
        .then((res) => {
          if (res === "Account deleted successfully") {
            storage(options.localStorage, options.removeItem, "userToken");
            navigateInApp(routeOptions.login);
          }
        })
        .catch((error) => {
          errorHandler(errorHandlerCont, error);
        });
    }
  });
});

saveChangesBtn.addEventListener("click", async (e) => {
  const authString = email.value + password.value;
  const userData = new FormData();
  userData.append("name", username.value);
  userData.append("email", email.value);
  userData.append("authString", authString);
  userData.append("profilePicture", profilePicture.files[0]);
  userData.append("password", password.value);
  userData.append("token", userToken.token);

  postTo(`/user/update`, userData)
    .then((res) => {
      if (res.ok) {
        res.text().then((message) => {
          successHandling(successHandlerCont, message, "none");
        });
      }
    })
    .catch((err) => {
      errorHandler(errorHandlerCont, err);
    });
});

logoutBtn.addEventListener("click", () => {
  console.log("logout");
  storage(options.localStorage, options.removeItem, "userToken");
  navigateInApp(routeOptions.login);
});
