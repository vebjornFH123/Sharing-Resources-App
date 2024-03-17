import { navigateInApp, routeOptions } from "../app.js";

function successHandling(cont, err, btnDisplay) {
  while (cont.firstChild) {
    cont.removeChild(cont.firstChild);
  }
  const message = typeof err === "string" ? err : err.message;
  const popupHTML = `
      <div id="popup" style="display: flex; flex-direction: column; gap: 5px; justify-content: center;  align-items: center; background-color: #97F3A0; color: white; border: 1px solid #37E047; border-radius: 5px; padding: 15px; z-index: 9999;">
      <div display: flex; flex-direction: row; gap: 5px;>
      <span>${message}</span>
      <button onclick="document.getElementById('popup').remove()" style="border: none; cursor: pointer; background-color: transparent;"><img src="./Assets/img/icons/exit-black-icon.svg" alt="" style="height: 10px;"/></button>
      </div> 
      <button id="goHomeBtn">Go Home <img src="./Assets/img/icons/arrow-right-white.svg" alt="" style="height: 10px;"/> </button>
      </div>
    `;

  cont.insertAdjacentHTML("beforeend", popupHTML);

  const goHomeBtn = document.getElementById("goHomeBtn");
  goHomeBtn.addEventListener("click", () => {
    navigateInApp(routeOptions.home);
  });

  goHomeBtn.style = `display: ${btnDisplay}; cursor: pointer;`;
}

export default successHandling;
