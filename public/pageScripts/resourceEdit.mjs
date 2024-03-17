import { postTo, getData, deleteData } from "../modules/methods.mjs";
import errorHandler from "../modules/errorHandling.mjs";
import successHandling from "../modules/successHandling.mjs";
import { navigateInApp, routeOptions } from "../app.js";
import { storage, options } from "../modules/storage.mjs";

const successHandlerCont = document.getElementById("successHandlerCont");
const errorHandlerCont = document.getElementById("errorHandlerCont");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const deleteResourceBtn = document.getElementById("deleteResourceBtn");
const nameInput = document.getElementById("nameInput");
const descriptionInput = document.querySelector(".description-input");
const keyInput = document.getElementById("keyInput");
const typeInput = document.getElementById("typeInput");
const countryInput = document.getElementById("countryInput");
const addressInput = document.getElementById("addressInput");
const zipCodeInput = document.getElementById("zipCodeInput");
const imageUpload = document.getElementById("imageUpload");
const selectUser = document.getElementById("selectUser");
const addAdminUsersBtn = document.getElementById("addAdminUsersBtn");
const addUsersBtn = document.getElementById("addUsersBtn");
const displayUsers = document.getElementById("displayUsers");

const userToken = storage(options.localStorage, options.getItem, "userToken");

const users = [];

addAdminUsersBtn.addEventListener("click", () => {
  addUser(users, displayUsers, true);
});
addUsersBtn.addEventListener("click", () => {
  addUser(users, displayUsers, false);
});

function addUser(usersArray, cont, admin) {
  const selectValues = selectUser.value.split(",");
  const values = {
    id: selectValues[0],
    email: selectValues[1],
    isAdmin: admin,
  };
  let checkIfUserExists = usersArray.some((user) => user.id === values.id);
  if (checkIfUserExists === false) {
    usersArray.push(values);
    displayCard(usersArray, cont);
  } else {
    errorHandler(errorHandlerCont, `User ${values.email} already added`);
  }
}

function removeUser(usersArray, cont, id) {
  const index = usersArray.findIndex((user) => user.id === id);
  console.log(index);
  // If the user is found, remove it from the array
  if (index !== -1) {
    usersArray.splice(index, 1);
    displayCard(usersArray, cont);
  }
}

function displayCard(usersArray, cont) {
  cont.innerHTML = "";
  console.log(usersArray);
  usersArray.forEach((user) => {
    const htmlCard = `<div class="card" style="background-color:${
      user.isAdmin === true ? "#8be6ac" : "#8bd4e6"
    }">
  <div class="card-content">
    <span class="card-name">${user.email}</span>
    <button id="${user.id}" class="close-button">×</button>
  </div>
</div>`;
    cont.insertAdjacentHTML("beforeend", htmlCard);
  });

  const removeUserBtns = document.querySelectorAll(".close-button");
  removeUserBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeUser(usersArray, cont, e.target.id);
    });
  });
}

getData("/user/all")
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((data) => {
    const users = JSON.parse(data);
    console.log(users);
    users.forEach((user) => {
      if (user.email !== null) {
        const optionElement = document.createElement("option");
        optionElement.textContent = user.email;
        optionElement.value = [user.id, user.email];
        selectUser.appendChild(optionElement);
      }
    });
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });

saveChangesBtn.addEventListener("click", async (e) => {
  const images = imageUpload.files;

  const resourceData = new FormData();
  resourceData.append("name", nameInput.value);
  resourceData.append("resourceType", typeInput.value);
  resourceData.append("country", countryInput.value);
  resourceData.append("zipCode", zipCodeInput.value);
  resourceData.append("address", addressInput.value);
  resourceData.append("description", descriptionInput.value);
  resourceData.append("key", keyInput.value);
  for (let i = 0; i < images.length; i++) {
    resourceData.append("resourceImages", images[i]);
  }
  resourceData.append("usersInfo", JSON.stringify(users));
  resourceData.append("token", userToken.token);

  postTo(`/resource/add`, resourceData)
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
    })
    .then((message) => {
      successHandling(successHandlerCont, message, "block");
    })
    .catch((error) => {
      errorHandler(errorHandlerCont, error);
    });
});

deleteResourceBtn.addEventListener("click", () => {
  navigateInApp(routeOptions.home);
});
