import CustomError from "./CustomError.js";

export const loginError = {
  userNotFound: new CustomError(
    "Incorrect username",
    "Incorrect credentials.",
    401
  ),

  incorrectPassword: new CustomError(
    "Incorrect password",
    "Incorrect credentials.",
    401
  ),
};
