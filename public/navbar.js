import { navigateInApp, routeOptions } from "./app.js";
import { storage, options } from "./modules/storage.mjs";
import { postTo, dataOptions } from "./modules/methods.mjs";

const userToken = storage(options.localStorage, options.getItem, "userToken");

let accountBtnHTML = "";

if (userToken !== null) {
  const userInfo = {
    token: userToken.token,
    get: "profilepic, name",
  };

  postTo("/user/get", userInfo, dataOptions.json)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      const user = data[0];
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
      accountBtnHTML = `
      <img id="profilepicNav" src=${imageURL} alt=""> ${user.name}
      `;
      accountBtn.innerHTML = accountBtnHTML;
    })
    .catch((err) => {
      console.log(err);
    });

  const accountBtn = document.getElementById("accountBtn");
} else {
  accountBtnHTML = "LOGIN";
  accountBtn.innerHTML = accountBtnHTML;
}
