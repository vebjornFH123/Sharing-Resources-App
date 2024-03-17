import { postTo, dataOptions } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";
import { storage, options } from "../modules/storage.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const resourceList = document.getElementById("resourceList");
const addResourceBtn = document.getElementById("addResourceBtn");

const userToken = storage(options.localStorage, options.getItem, "userToken");

const userInfo = {
  token: userToken.token,
  type: "userId",
};

postTo(`/resource/get`, userInfo, dataOptions.json)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((data) => {
    const resources = JSON.parse(data);
    console.log(resources);
    if (resources)
      resources.forEach((resource) => {
        let imageURL;
        if (resource.images[0] !== null) {
          const bufferImgData = new Uint8Array(resource.images[0].data);
          const blobData = new Blob([bufferImgData], {
            type: "image/jpeg",
          });
          imageURL = URL.createObjectURL(blobData);
        } else {
          imageURL = "../Assets/img/icons/Logo-blue.svg";
        }
        const card = document.createElement("div");
        card.className = "resource-card";
        card.id = `${resource.id}`;

        card.innerHTML = `
        <div id="label" style="background-color: ${
          resource.is_admin ? "#8be6ac" : "#8bd4e6"
        }">${resource.is_admin ? "Admin" : "Bruker"}</div>
              <img class="img" src="${imageURL}" alt="${resource.name}" />
              <div class="info">
              <h3>${resource.name} <span id="type" >${resource.type}</span></h3>
              <div style="display: flex; flex-direction: column; gap: 5px">
              <div>
                  <span>Address</span>
                  <p>${resource.address}, ${resource.zipcode}</p>
                  </div>
                  <div>
                  <span>Description</span>
                  <p>${resource.description}</p>
                  </div>
                </div>
              </div>
              <button class="btn"><img src="../Assets/img/icons/arrow-right.svg" alt="" /></button>
          `;
        resourceList.appendChild(card);
      });

    const resourceCards = document.querySelectorAll(".resource-card");
    resourceCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const resourceId = e.currentTarget.id;
        storage(
          options.sessionStorage,
          options.setItem,
          "resourceId",
          resourceId
        );
        navigateInApp(routeOptions.resource);
      });
    });
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });

addResourceBtn.addEventListener("click", () => {
  navigateInApp(routeOptions.resourceAdd);
});
