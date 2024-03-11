import { postTo, getData } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";

const saveChangesBtn = document.getElementById("saveChangesBtn");

const nameInput = document.getElementById("name");

const descriptionInput = document.querySelector(".description-input");

const imageUpload = document.getElementById("imageUpload");

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
