import { getData } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";

const resourceList = document.getElementById("resourceList");

getData("/resource")
  .then((respon) => {
    if (respon.ok) {
      return respon.json();
    }
  })
  .then((data) => {
    const resources = JSON.parse(data);
    resources.forEach((resource) => {
      const card = document.createElement("div");
      card.innerHTML = `
              <img class="img" src="${resource.imageUrl}" alt="${resource.title}" />
              <div class="info">
                  <h3>${resource.title}</h3>
                  <p>${resource.description}</p>
              </div>
              <button class="btn"><img src="../Assets/img/icons/arrow-right.svg" alt="" /></button>
          `;
      card.id = "resource";
      resourceList.appendChild(card);
    });
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });
