import { getData } from "./modules/methods.mjs";

const userHeader = document.getElementById("userHeader");

window.onload = async function () {
  const userData = await getData(`/user/`);

  return console.log(userData);
};
