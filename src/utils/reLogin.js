
import { initRouter } from '@/router'
var currentRouter = initRouter();
export default function reLogin (callback) {
  sessionStorage.clear();
  if (process.env.NODE_ENV === "production") {
    // currentRouter.push("/login");
    window.location.href = process.env.VUE_APP_LOGIN_URL + "&redirectUrl=" + process.env.VUE_APP_REDIRECT_URI;
  } else {
    callback();
  }
}
