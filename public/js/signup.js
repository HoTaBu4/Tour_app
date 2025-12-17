import axios from "axios";
import "@babel/polyfill";
import { showAlert } from "./alert";

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Account created successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    const message =
      error?.response?.data?.message || "Something went wrong. Please try again.";
    showAlert("error", message);
  }
};
