import { storage, options } from "../modules/storage.mjs";
import { navigateInApp, routeOptions } from "../app.js";

const templateSource = "../templates/resource.html";
const pageScript = "../pageScripts/resource.mjs";

class resourceView {
  constructor() {}

  checkUserToken() {
    const userToken = storage(
      options.localStorage,
      options.getItem,
      "userToken"
    );
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

export default resourceView;
