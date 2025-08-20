import "./css/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/style.scss";

const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const loginRegisterStyle = document.querySelectorAll(".loginRegisterStyle");
const loginRegisterBtn = document.querySelectorAll(".loginRegisterBtn");

// 註冊登入頁面切換
loginRegisterBtn.forEach((item) => {
  item.addEventListener("click", (e) => {
    loginRegisterStyle.forEach((i) => {
      i.classList.remove("active");
    });
    if (e.target.getAttribute("id") === "loginBtn") {
      loginForm.classList.add("active");
    } else {
      registerForm.classList.add("active");
    }
  });
});

console.log("Webpack SCSS HMR 測試");
