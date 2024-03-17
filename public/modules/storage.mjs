const options = {
  setItem: "setItem",
  getItem: "getItem",
  removeItem: "removeItem",
  localStorage: "localStorage",
  sessionStorage: "sessionStorage",
};

function storage(storageType, event, key, value) {
  switch (storageType) {
    case options.localStorage:
      if (event === options.setItem) {
        localStorage.setItem(key, value);
      } else if (event === options.getItem) {
        return JSON.parse(localStorage.getItem(key));
      } else if (event === options.removeItem) {
        localStorage.removeItem(key);
      }
      break;
    case options.sessionStorage:
      if (event === options.setItem) {
        sessionStorage.setItem(key, value);
      } else if (event === options.getItem) {
        return JSON.parse(sessionStorage.getItem(key));
      } else if (event === options.removeItem) {
        sessionStorage.removeItem(key);
      }
      break;
    default:
      console.error("Invalid storage type");
  }
}

export { storage, options };
