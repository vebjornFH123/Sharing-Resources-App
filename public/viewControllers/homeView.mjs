import { storage, options } from "../modules/storage.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const templateSource = "../templates/home.html";
const pageScript = "../pageScripts/home.mjs";

class HomeView {
  constructor() {}

  checkUserToken() {
    const userToken = storage(options.localStorage, options.getItem, "userToken");
    if (userToken === null) {
      navigateInApp(routeOptions.login);
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

export default HomeView;
