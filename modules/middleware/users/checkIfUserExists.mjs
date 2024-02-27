import DBManager from "../../storageManager.mjs";

async function checkIfUserExists(email) {
  try {
    console.log(email);
    const user = await DBManager.getUser("email", email);
    const exist = user.length > 0 ? true : false;
    return exist;
  } catch (error) {
    return false;
  }
}

export default checkIfUserExists;
