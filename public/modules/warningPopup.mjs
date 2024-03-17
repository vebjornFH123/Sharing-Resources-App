function warningPopup() {
  const message = "Are you sure you want to proceed?";
  return new Promise((resolve, reject) => {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");
    document.body.appendChild(popupContainer);

    const popupHTML = `
        <div class="popup">
            <div class="popup-content">
                <span>${message}</span>
            </div> 
            <div>
            <button class="yes-btn">Yes</button>
            <button class="no-btn">No</button>
            </div>
        </div>
    `;

    popupContainer.innerHTML = popupHTML;

    const noBtn = popupContainer.querySelector(".no-btn");
    noBtn.addEventListener("click", function () {
      document.body.removeChild(popupContainer);
      resolve(false);
    });

    const yesBtn = popupContainer.querySelector(".yes-btn");
    yesBtn.addEventListener("click", function () {
      document.body.removeChild(popupContainer);
      resolve(true);
    });
  });
}

export default warningPopup;
