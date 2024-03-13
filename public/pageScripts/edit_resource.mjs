import { postTo, getData } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";

const saveChangesBtn = document.getElementById("saveChangesBtn");
const nameInput = document.getElementById("name");
const descriptionInput = document.querySelector(".description-input");
const imageUpload = document.getElementById("imageUpload");

const selectUser = document.getElementById("selectUser");

const addAdminUsersBtn = document.getElementById("addAdminUsersBtn");
const addUsersBtn = document.getElementById("addUsersBtn");

const displayAdmins = document.getElementById("displayAdmins");
const displayUsers = document.getElementById("displayUsers");

const adminUsers = [];
const users = [];

addAdminUsersBtn.addEventListener("click", () => {
  addUser(adminUsers, displayAdmins);
});
addUsersBtn.addEventListener("click", () => {
  addUser(users, displayUsers);
});

function addUser(usersArray, cont) {
  const selectValues = selectUser.value.split(",");
  const values = {
    id: selectValues[0],
    email: selectValues[1],
  };
  usersArray.push(values);
  displayCard(usersArray, cont);
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
    const htmlCard = `<div class="card">
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

getData("/resource")
  .then((respon) => {
    if (respon.ok) {
      return respon.json();
    }
  })
  .then((data) => {
    const resourceData = JSON.parse(data);
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });

getData("/user/all")
  .then((respon) => {
    if (respon.ok) {
      return respon.json();
    }
  })
  .then((data) => {
    const users = JSON.parse(data);
    console.log(users);
    users.forEach((user) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = user.email;
      optionElement.value = [user.id, user.email];
      selectUser.appendChild(optionElement);
    });
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });

saveChangesBtn.onclick = async (e) => {
  const images = imageUpload.files;
  console.log(images);

  const resourceData = new FormData();
  resourceData.append("name", nameInput.value);
  resourceData.append("description", descriptionInput.value);
  for (let i = 0; i < images.length; i++) {
    resourceData.append("resourceImages", images[i]);
  }

  postTo(`/resource/add`, resourceData)
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
