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
      let imageURL;
      console.log(resource);
      if (resource.images) {
        const bufferImgData = new Uint8Array(resource.images[0].data);
        const blobData = new Blob([bufferImgData], {
          type: "image/jpeg",
        });
        imageURL = URL.createObjectURL(blobData);
      } else {
        imageURL = "../Assets/img/icons/Logo.svg";
      }
      const card = document.createElement("div");
      card.innerHTML = `
              <img class="img" src="${imageURL}" alt="${resource.name}" />
              <div class="info">
                  <h3>${resource.name}</h3>
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
