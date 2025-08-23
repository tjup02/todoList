import "./common.js";
import axios from "axios";

const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const loginRegisterStyle = document.querySelectorAll(".loginRegisterStyle");
const loginRegisterBtn = document.querySelectorAll(".loginRegisterBtn");

const registerBtn = document.querySelector("#registerBtn"); //確認註冊按鈕

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

// 接API
const apiUrl = "https://todoo.5xcamp.us"; // API來源:

// 註冊
const register = async (email, nickname, password) => {
  try {
    const res = axios.post(apiUrl, {
      user: {
        email: email,
        nickname: nickname,
        password: password,
      },
    });
    console.log(res.data);
  } catch (error) {
    console.log(error.response);
  }
};

registerBtn.addEventListener("click", (e) => {
  // 設定欄位ID和對應稱呼
  const fields = [
    { id: "registerNickname", name: "暱稱" },
    { id: "registerEmail", name: "Email" },
    { id: "registerPassword", name: "密碼" },
    { id: "registerCheckPassword", name: "確認密碼" },
  ];

  // 檢查是否完整填寫註冊表單
  const fieldsValueChk = fields.forEach((item, index) => {
    const fieldsWarningTag = document.querySelector(`#${item.id} .warningTag`);
    const fieldsInputValue = document
      .querySelector(`#${item.id} input`)
      .value.trim();

    // 設定flag(用來檢查是否符合規則，true會中斷執行，false會執行拿掉警示tag)
    let hasError = false;

    //   檢查空白欄位
    if (!fieldsInputValue) {
      fieldsWarningTag.textContent = `${item.name}不可為空`;
      fieldsWarningTag.classList.add("active");
      hasError = true;
    }

    // 檢查email格式
    if (item.id === "registerEmail" && fieldsInputValue !== "") {
      const emailRule =
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

      if (!emailRule.test(fieldsInputValue) && fieldsInputValue !== "") {
        fieldsWarningTag.textContent = `${item.name}格式錯誤`;
        fieldsWarningTag.classList.add("active");
        hasError = true;
      }
    }

    //  檢查密碼:大於6碼
    if (item.id === "registerPassword" && fieldsInputValue !== "") {
      if (fieldsInputValue.length < 6) {
        fieldsWarningTag.textContent = `${item.name}必須大於等於6碼`;
        fieldsWarningTag.classList.add("active");
        hasError = true;
      }
    }

    //  檢查確認密碼:與密碼一致
    if (item.id === "registerCheckPassword" && fieldsInputValue !== "") {
      const registerPassword = document.querySelector(
        "#registerPassword input"
      ); // 抓密碼欄位
      if (fieldsInputValue !== registerPassword.value.trim()) {
        fieldsWarningTag.textContent = `${item.name}與密碼不一樣`;
        fieldsWarningTag.classList.add("active");
        hasError = true;
      }
    }

    // 回傳false時(符合條件)，拿掉警示tag
    if (!hasError) {
      fieldsWarningTag.textContent = "";
      fieldsWarningTag.classList.remove("active");
    }

    // 將符合規則的值丟到fields的inputValue屬性
    fields[index].inputValue = fieldsInputValue;

    return hasError; //回傳flag
  });

  register(fields[0].inputValue, fields[1].inputValue, fields[2].inputValue);
});

// 登入API
async function login(email, password) {
  try {
    const res = axios.get(apiUrl, {
      user: {
        email: email,
        password: password,
      },
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
