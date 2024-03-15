import { getData } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";

const resourceList = document.getElementById("resourceList");

getData("/resource/userId/1")
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
      card.id = resource.id;
      card.innerHTML = `
              <img class="img" src="${imageURL}" alt="${resource.name}" />
              <div class="info">
              <h3>${resource.name}</h3>
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
      card.id = "resource";
      resourceList.appendChild(card);
    });
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });
