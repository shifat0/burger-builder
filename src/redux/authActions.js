import axios from "axios";
import * as actionTypes from "./actionTypes";

export const auth = (email, password, mode) => {
  return (dispatch) => {
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    let url = null;

    if (mode === "signup")
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
    else
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

    const apiKey = "AIzaSyBcFpUTBeuMKUQoJX0UH0OOf91lPndUW4I";

    axios.post(url + apiKey, authData).then((res) => console.log(res));
  };
};
