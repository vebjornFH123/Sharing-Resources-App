import { storage, options } from "../modules/storage.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const templateSource = "../templates/login.html";
const pageScript = "../pageScripts/login.mjs";
class LoginView {
  constructor() {}

  checkUserToken() {
    const userToken = storage(options.localStorage, options.getItem, "userToken");
    console.log(userToken);
    if (userToken !== null) {
      navigateInApp(routeOptions.account);
    }
  }

  async getTemplate() {
    return await fetch(templateSource).then((d) => d.text());
  }

  async loadScript() {
    try {
      await import(pageScript);
    } catch (error) {
      console.log(error);
    }
  }
}

export default LoginView;
