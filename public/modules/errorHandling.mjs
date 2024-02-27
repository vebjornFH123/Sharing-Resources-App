function errorHandler(errorHandlerCont, err) {
  while (errorHandlerCont.firstChild) {
    errorHandlerCont.removeChild(errorHandlerCont.firstChild);
  }
  const popupHTML = `
      <div id="popup" style="display: flex; flex-direction: row; gap: 5px; background-color: #FEDCE0; color: #873147; border: 1px solid #873147; border-radius: 5px; padding: 15px; z-index: 9999;">
        <span>${err.message}</span>
        <button onclick="document.getElementById('popup').remove()" style="border: none; background-color: transparent;"><img src="./Assets/img/icons/exit-black-icon.svg" alt="" style="height: 10px;"/></button>
      </div>
    `;

  // Add the popup window HTML to the document body
  errorHandlerCont.insertAdjacentHTML("beforeend", popupHTML);
}

export default errorHandler;
