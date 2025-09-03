import "./common.js";
import axios from "axios";
import Swal from "sweetalert2";

const userName = document.querySelector("#userName");
const logoutBtn = document.querySelector("#logoutBtn");
const apiUrl = "https://todoo.5xcamp.us"; // API來源:

// 載入DOM後執行
window.addEventListener("DOMContentLoaded", () => {
  // 取用存在瀏覽器的token
  const token = localStorage.getItem("token");
  const nickname = localStorage.getItem("nickname");

  //如果沒有token，轉到登入頁
  if (!token) {
    window.location.href = "login.html";
  }

  userName.textContent = `${nickname}的代辦`;

  // 歡迎登入訊息(sessionStorage有標記justLoggedIn就會出現)
  if (sessionStorage.getItem("justLoggedIn") === "true") {
    Swal.fire({
      title: `登入成功`,
      text: `Hi~${nickname}，歡迎回來~`,
      icon: "success",
      timer: 2000, // 2000 毫秒後自動關閉
      showConfirmButton: false, // 不顯示「確定」按鈕
    });
    sessionStorage.removeItem("justLoggedIn"); //拿掉justLoggedIn，避免頁面重整或其他方式進入頁面後，再次出現
  }

  //載入頁面時，在axios預設header的token
  axios.defaults.headers.common["Authorization"] = token;
});

// 登出API
const logout = async () => {
  try {
    const res = await axios.delete(`${apiUrl}/users/sign_out`);
    // 清掉localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");

    Swal.fire({
      icon: "success",
      title: `${res.data.message}`,
      timer: 2000, // 2000 毫秒後自動關閉
      showConfirmButton: false, // 不顯示「確定」按鈕
    }).then(() => {
      window.location.href = "login.html";
    });
  } catch (error) {
    console.log(error.response.data);
    Swal.fire({
      title: `${error.response.data.message}`,
      text: "請稍後再嘗試",
      icon: "error",
      confirmButtonColor: "#FFD370",
    });
  }
};

// 登出按鈕
logoutBtn.addEventListener("click", () => {
  logout();
});
