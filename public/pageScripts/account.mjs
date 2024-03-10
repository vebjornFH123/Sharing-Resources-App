import { postTo, deleteData } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";
import { createBasicAuthString } from "../../modules/userAuth.mjs";

// skada!!!!!

const saveChangesBtn = document.getElementById("saveChangesBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const logoutBtn = document.getElementById("logoutBtn");
const errorHandlerCont = document.getElementById("errorHandlerCont");

// inputs
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const profilePicture = document.getElementById("profilePicture");

//get userData from localStorage
const getUserData = JSON.parse(localStorage.getItem("userData"));

const usernameHeader = document.getElementById("usernameHeader");
const profileImage = document.getElementById("profileImage");
usernameHeader.innerText = getUserData.name;
username.value = getUserData.name;
//profilePicture.value = userData.img;
email.value = getUserData.email;
// password.value = userData.pswhash;.profilePicPath.p.profilePicPath
let imageURL;
if (getUserData.profilepic) {
  const bufferImgData = new Uint8Array(getUserData.profilepic.data);
  const blobData = new Blob([bufferImgData], {
    type: "image/jpeg",
  });
  imageURL = URL.createObjectURL(blobData);
} else {
  imageURL = "../Assets/img/icons/Logo.svg";
}

document.getElementById("profileImage").src = imageURL;
// "..profilePicPath./Assets/img/icons/Logo.svg";
deleteAccountBtn.onclick = async (e) => {
  deleteData(`/user/${getUserData.id}`)
    .then((respon) => {
      console.log(respon);
    })
    .catch((error) => {
      errorHandler(errorHandlerCont, error);
    });
};

saveChangesBtn.onclick = async (e) => {
  const authString = email.value + password.value;

  console.log(authString);

  const userData = new FormData();
  userData.append("name", username.value);
  userData.append("email", email.value);
  userData.append("authString", authString);
  userData.append("profilePicture", profilePicture.files[0]);
  userData.append("id", getUserData.id);

  postTo(`/user/update`, userData)
    .then((respon) => {
      if (respon.ok) {
        return respon.json();
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
