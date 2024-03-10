// Function to handle routing
const route = (e) => {
  e = e || window.event;
  e.preventDefault();
  const path = e.target.href.replace(window.location.origin, ""); // Extract path from href
  window.history.replaceState({}, "", path);
  generatePage(path);
};

// Function to generate page content based on path
async function generatePage(path) {
  if (path == "/") {
    await insertTemplatesFrom(`./templates/home.html`); // Load templates from external file
    removeScript(); // Remove existing script
    loadScript("home"); // Load new script
  } else {
    await insertTemplatesFrom(`./templates${path}.html`); // Load templates from external file
    removeScript(); // Remove existing script
    loadScript(path); // Load new script
  }
}

// Function to load templates from an external HTML file and insert them into the document
async function insertTemplatesFrom(source) {
  const templates = await fetch(source).then((response) => response.text());
  document.querySelector("main").innerHTML = templates; // Insert templates into main element
}

// Function to dynamically load a script
function loadScript(scriptPath) {
  let script = document.createElement("script");
  script.src = `../pageScripts/${scriptPath}.mjs?version${new Date()}`;
  script.setAttribute("id", "dynamicScript"); // Set an ID for the script
  script.type = "module";
  console.log(script);
  document.head.appendChild(script);
}

// Function to remove the dynamically loaded script
function removeScript() {
  let script = document.getElementById("dynamicScript");
  if (script) {
    script.parentNode.removeChild(script);
  }
}

window.onpopstate = route;
window.onload = () => {
  generatePage(window.location.pathname);
};

window.addEventListener("popstate", () => {
  generatePage(window.location.pathname);
});
// Assign route function to window object for global access
window.route = route;
