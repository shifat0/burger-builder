import axios from "axios";
import * as actionTypes from "./actionTypes";

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      token: token,
      userId: userId,
    },
  };
};

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

    axios.post(url + apiKey, authData).then((res) => {
      localStorage.setItem("token", res.data.idToken);
      localStorage.setItem("userId", res.data.localId);
      const tokenExpiresIn = new Date(
        new Date().getTime() + res.data.expiresIn * 1000
      );
      localStorage.setItem("expiresIn", tokenExpiresIn);
      dispatch(authSuccess(res.data.idToken, res.data.localId));
    });
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expiresIn");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authCheck = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const tokenExpiresIn = new Date(localStorage.getItem("expiresIn"));
      if (tokenExpiresIn <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
      }
    }
  };
};
