import MapView from "./viewControllers/mapView.mjs";
import HomeView from "./viewControllers/homeView.mjs";
import AccountView from "./viewControllers/accountView.mjs";
import ResourceView from "./viewControllers/resourceView.mjs";
import ResourceAddView from "./viewControllers/resourceAddView.mjs";
import ResourceEditView from "./viewControllers/resourceEditView.mjs";
import SignUpView from "./viewControllers/signUpView.mjs";
import NotFound from "./viewControllers/notFound.mjs";

import LoginView from "./viewControllers/loginView.mjs";

function navigateInApp(url) {
  history.pushState(null, null, url);
  router();
  window.location.reload(true);
}

const routeOptions = {
  home: "/",
  map: "/map",
  account: "/account",
  resource: "/resource",
  resourceEdit: "/resource_edit",
  resourceAdd: "/resource_add",
  signUp: "/sign_up",
  login: "/login",
};

async function router() {
  const routes = [
    { path: "/notFound", view: NotFound },
    { path: "/", view: HomeView },
    { path: "/map", view: MapView },
    { path: "/account", view: AccountView },
    { path: "/resource", view: ResourceView },
    { path: "/resource_add", view: ResourceAddView },
    { path: "/resource_edit", view: ResourceEditView },
    { path: "/sign_up", view: SignUpView },
    { path: "/login", view: LoginView },
  ];

  const checkRoutesMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = checkRoutesMatches.find((checkRoutesMatch) => checkRoutesMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
    document.querySelector(".navbar").style = "display: none";
  }

  const view = new match.route.view();

  view.checkUserToken();

  const mainApp = document.getElementById("mainApp");
  mainApp.innerHTML = await view.getTemplate();

  await view.loadScript();
}

window.addEventListener("popstate", router);

const homeBtn = document.getElementById("homeBtn");
const mapBtn = document.getElementById("mapBtn");
const accountBtn = document.getElementById("accountBtn");

document.addEventListener("DOMContentLoaded", () => {
  homeBtn.addEventListener("click", (e) => {
    navigateInApp(routeOptions.home);
  });
  mapBtn.addEventListener("click", (e) => {
    navigateInApp(routeOptions.map);
  });
  accountBtn.addEventListener("click", (e) => {
    navigateInApp(routeOptions.account);
  });
  router();
});

export { navigateInApp, routeOptions };
