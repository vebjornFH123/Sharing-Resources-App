import { getData } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";

const resourceImg = document.querySelector(".resource-image");
const prevImgBtn = document.querySelector(".prev-btn");
const nextImgBtn = document.querySelector(".next-btn");

let slideIndex = 0;
function showSlides(images, index) {
  let slides = document.querySelector(".slides");
  if (index < 0) {
    slideIndex = images.length - 1;
  } else if (index >= images.length) {
    slideIndex = 0;
  }
  slides.innerHTML =
    '<img src="' + images[slideIndex] + '" style="width:100%">';
}

function plusSlides(images, n) {
  showSlides(images, (slideIndex += n));
}

getData("/resource")
  .then((respon) => {
    if (respon.ok) {
      return respon.json();
    }
  })
  .then((data) => {
    const resourceData = JSON.parse(data);
    console.log(resourceData.imageUrls);
    showSlides(resourceData.imageUrls, slideIndex);
    prevImgBtn.addEventListener("click", () => {
      plusSlides(resourceData.imageUrls, -1);
    });
    nextImgBtn.addEventListener("click", () => {
      plusSlides(resourceData.imageUrls, 1);
    });
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });
