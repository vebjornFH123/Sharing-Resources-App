import { navigateInApp, routeOptions } from "../app.js";
import { storage, options } from "./storage.mjs";

function errorHandler(cont, err) {
  while (cont.firstChild) {
    cont.removeChild(cont.firstChild);
  }
  let message = typeof err === "string" ? err : err.message;
  if (message === "Your token has expired" || message === "Invalid token") {
    message += " You will be logged out in 5 seconds.";
    setTimeout(() => {
      storage(options.localStorage, options.removeItem, "userToken");
      navigateInApp(routeOptions.login);
    }, 5000);
  }

  const popupHTML = `
      <div id="popup" style="display: flex; flex-direction: row; gap: 5px; background-color: #FEDCE0; color: #873147; border: 1px solid #873147; border-radius: 5px; padding: 15px; z-index: 9999;">
        <span>${message}</span>
        <button onclick="document.getElementById('popup').remove()" style="border: none; cursor: pointer; background-color: transparent;"><img src="./Assets/img/icons/exit-black-icon.svg" alt="" style="height: 10px;"/></button>
      </div>
    `;

  cont.insertAdjacentHTML("beforeend", popupHTML);
}

export default errorHandler;
