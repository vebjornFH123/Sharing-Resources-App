import { postTo, dataOptions } from "../../modules/methods.mjs";
import errorHandler from "../../modules/errorHandling.mjs";
import { storage, options } from "../modules/storage.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const resourceImg = document.querySelector(".resource-image");
const prevImgBtn = document.querySelector(".prev-btn");
const nextImgBtn = document.querySelector(".next-btn");
const editResource = document.getElementById("editResource");

const nameText = document.getElementById("nameText");
const addressText = document.getElementById("addressText");
const descriptionText = document.getElementById("descriptionText");
const keyText = document.getElementById("keyText");
const imageUrls = [];
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
const userToken = storage(options.localStorage, options.getItem, "userToken");

const resourceId = storage(
  options.sessionStorage,
  options.getItem,
  "resourceId"
);

const resourceInfo = {
  token: userToken.token,
  type: "resourceId",
  id: resourceId,
};

postTo(`/resource/get`, resourceInfo, dataOptions.json)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((data) => {
    const resourceData = JSON.parse(data)[0];
    if (resourceData.is_admin === true) {
      editResource.style = "display: block";
    } else {
      editResource.style = "display: none";
    }
    if (resourceData.images[0] === null || resourceData.images.length === 0) {
      imageUrls.push("../Assets/img/icons/Logo-blue.svg");
    } else {
      resourceData.images.forEach((img) => {
        const bufferImgData = new Uint8Array(img.data);
        const blobData = new Blob([bufferImgData], {
          type: "image/jpeg",
        });
        const imageURL = URL.createObjectURL(blobData);
        imageUrls.push(imageURL);
      });
    }
    nameText.innerText = resourceData.name;
    addressText.innerText = `${resourceData.address}, ${resourceData.zipcode}`;
    descriptionText.innerText = resourceData.description;
    keyText.innerText = resourceData.key;
    showSlides(imageUrls, slideIndex);
    prevImgBtn.addEventListener("click", () => {
      plusSlides(imageUrls, -1);
    });
    nextImgBtn.addEventListener("click", () => {
      plusSlides(imageUrls, 1);
    });
  })
  .catch((error) => {
    errorHandler(errorHandlerCont, error);
  });

editResource.addEventListener("click", () => {
  navigateInApp(routeOptions.resourceEdit);
});

const daysTag = document.querySelector(".days"),
  currentDate = document.querySelector(".current-date"),
  prevNextIcon = document.querySelectorAll(".icons span");
// getting new date, current year and month
let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();
// storing full name of all months in array
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const renderCalendar = () => {
  let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
  let liTag = "";
  for (let i = firstDayofMonth; i > 0; i--) {
    // creating li of previous month last days
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
  }
  for (let i = 1; i <= lastDateofMonth; i++) {
    // creating li of all days of current month
    // adding active class to li if the current day, month, and year matched
    let isToday =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "active"
        : "";
    liTag += `<li class="${isToday}">${i}</li>`;
  }
  for (let i = lastDayofMonth; i < 6; i++) {
    // creating li of next month first days
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }
  currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
  daysTag.innerHTML = liTag;
};
renderCalendar();
prevNextIcon.forEach((icon) => {
  // getting prev and next icons
  icon.addEventListener("click", () => {
    // adding click event on both icons
    // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
    if (currMonth < 0 || currMonth > 11) {
      // if current month is less than 0 or greater than 11
      // creating a new date of current year & month and pass it as date value
      date = new Date(currYear, currMonth, new Date().getDate());
      currYear = date.getFullYear(); // updating current year with new date year
      currMonth = date.getMonth(); // updating current month with new date month
    } else {
      date = new Date(); // pass the current date as date value
    }
    renderCalendar(); // calling renderCalendar function
  });
});
