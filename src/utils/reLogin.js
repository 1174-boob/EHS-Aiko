export default function reLogin (callback) {
  sessionStorage.clear();
  if (process.env.NODE_ENV === "production") {
    window.location.href =
      process.env.VUE_APP_LOGIN_URL +
      "client_id=" +
      process.env.VUE_APP_CLIENTID +
      "&response_type=" +
      process.env.VUE_APP_RESPONSE_TYPE +
      "&redirect_uri=" +
      process.env.VUE_APP_REDIRECT_URI +
      "&isLogout=true";
  } else {
    callback();
  }
}
