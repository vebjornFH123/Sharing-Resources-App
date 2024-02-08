import { postTo } from "./modules/methods.mjs";

const createUserButton = document.getElementById("createUserButton");

createUserButton.onclick = async function (e) {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pswHash = document.getElementById("pswHash").value;

  const user = { name, email, pswHash };

  const respon = await postTo("/user", user);

  //window.location.href = "test.html";
};
