import "./common.js";
import axios from "axios";
import Swal from "sweetalert2";

const apiUrl = "https://todoo.5xcamp.us"; // API來源:
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const loginRegisterStyle = document.querySelectorAll(".loginRegisterStyle"); //登入和註冊表單
const loginRegisterBtn = document.querySelectorAll(".loginRegisterBtn"); //登入和註冊前往按鈕

const registerBtn = document.querySelector("#registerBtn"); //確認註冊按鈕
const loginBtn = document.querySelector("#loginBtn"); //確認登入按鈕

// 註冊登入頁面切換
loginRegisterBtn.forEach((item) => {
  // 點選進入頁面的按鈕(前往登入/登出)
  item.addEventListener("click", (e) => {
    loginRegisterStyle.forEach((i) => {
      console.log(e.target.getAttribute("id"));
      i.classList.remove("active");
      if (e.target.getAttribute("id") === "toLoginBtn") {
        loginForm.classList.add("active");
      } else {
        registerForm.classList.add("active");
      }
    });
  });
});

// 註冊
const register = async (nickname, email, password) => {
  try {
    const res = await axios.post(`${apiUrl}/users`, {
      user: {
        email: email,
        nickname: nickname,
        password: password,
      },
    });
    // console.log(res.data);
    Swal.fire({
      title: `${res.data.message}`,
      icon: "success",
      text: `點擊確認後，請重新登入`,
      confirmButtonColor: "#FFD370",
    }).then(() => {
      // SweetAlert 關閉後再刷新頁面
      location.reload();
    });
  } catch (error) {
    console.log(error.response);
    Swal.fire({
      title: "註冊失敗",
      text: `${error.response.data.error}`,
      icon: "error",
      confirmButtonColor: "#FFD370",
    });
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

  // 設定flag(用來檢查所有條件是否全部符合規則，true會中斷執行)
  let hasErrorAll = false;

  // 檢查是否完整填寫註冊表單
  fields.forEach((item, index) => {
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

    // hasError回傳false時(符合條件)，拿掉警示tag
    if (!hasError) {
      fieldsWarningTag.textContent = "";
      fieldsWarningTag.classList.remove("active");
    } else {
      //如果有任一欄位不符合規則，將hasErrorAll標為true，註冊表單將不會送出
      hasErrorAll = true;
    }

    // 將符合規則的值丟到fields的inputValue屬性
    fields[index].inputValue = fieldsInputValue;
  });

  // 如果有任一欄位不符合規則，停止執行。
  if (hasErrorAll) return;

  // 送出註冊表單
  register(fields[0].inputValue, fields[1].inputValue, fields[2].inputValue);
});

// 登入API
const login = async (email, password) => {
  try {
    const res = await axios.post(`${apiUrl}/users/sign_in`, {
      user: {
        email: email,
        password: password,
      },
    });
    // console.log(res.data);
    //axios預設登入成功後取得token，且後續動作攜帶token
    // axios.defaults.headers.common["Authorization"] = res.headers.authorization;

    // 儲存token和nickname
    localStorage.setItem("token", res.headers.authorization);
    localStorage.setItem("nickname", res.data.nickname);

    // 標記為此次進入主頁方式為"登入轉跳"
    sessionStorage.setItem("justLoggedIn", "true");

    // 自動跳轉到主頁
    window.location.href = "index.html";
  } catch (error) {
    // console.log(error.response.data);
    Swal.fire({
      title: `${error.response.data.message}`,
      text: `註冊信箱或密碼輸入錯誤`,
      icon: "error",
      confirmButtonColor: "#FFD370",
    });
  }
};

// 送出登入表單
loginBtn.addEventListener("click", (e) => {
  const loginEmailValue = document.querySelector("#loginEmail").value;
  const loginPasswordValue = document.querySelector("#loginPassword").value;

  if (!loginEmailValue || !loginPasswordValue) {
    Swal.fire({
      title: "註冊失敗",
      text: `請輸入註冊的Email和密碼`,
      icon: "warning",
      confirmButtonColor: "#FFD370",
    });
  } else {
    login(loginEmailValue, loginPasswordValue);
  }
});
