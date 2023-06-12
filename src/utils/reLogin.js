
import { initRouter } from '@/router'
var currentRouter = initRouter();
export default function reLogin (callback) {
  sessionStorage.clear();
  if (process.env.NODE_ENV === "production") {
    // currentRouter.push("/login");
    window.location.href =
      process.env.VUE_APP_API_BASE_OUT_URL +
      "client_id=" +
      process.env.VUE_APP_CLIENTID +
      "&response_type=" +
      process.env.VUE_APP_RESPONSE_TYPE +
      "&redirectUrl=" +
      process.env.VUE_APP_REDIRECT_URI;
  } else {
    callback();
  }
}
