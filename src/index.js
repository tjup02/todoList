import "./common.js";
import axios from "axios";
import Swal from "sweetalert2";

const userName = document.querySelector("#userName");
const logoutBtn = document.querySelector("#logoutBtn");
const noList = document.querySelector("#noList");
const hasList = document.querySelector("#hasList");
const todoWrap = document.querySelector("#todoWrap");

const addBtn = document.querySelector("#addBtn");
const todoInput = document.querySelector("#todoInput");
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

  // 列出todosList
  todosListAPI();
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

// todos列表API
const todosListAPI = async () => {
  const res = await axios.get(`${apiUrl}/todos`);

  const list = res.data.todos;
  // 根據載入的清單有無內容，顯示指定內容
  if (list.length === 0) {
    noList.classList.add("active");
    hasList.classList.remove("active");
  } else {
    hasList.classList.add("active");
    noList.classList.remove("active");
  }

  // 列出清單
  const html = list.reduce((accumulator, currentValue) => {
    return (
      accumulator +
      `
          <li id="${currentValue.id}" class=" todoItem d-flex align-items-center justify-content-between my-2 pb-2">
            <div class="d-flex align-items-center w-100">
              <!-- 尚未打勾 -->
              <div class="iconNoChk me-2">
                <i class="fa-regular fa-square"></i>
              </div>
              <!-- 已打勾 -->
              <div class="iconChk me-2"><i class="fa-solid fa-check"></i></div>
              <!-- 清單項目內容 -->
              <input class="todoInfo w-100 me-5 pe-3 " type="text" value="${currentValue.content}" readonly>
            </div>
            <!-- 編輯項目按鈕 -->
            <button type="button" class="iconEdit me-2">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <!-- 刪除項目按鈕 -->
            <button type="button" class="iconDel me-2">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </li>`
    );
  }, "");

  todoWrap.innerHTML = html;
};

// 新增todosAPI
const addTodos = async (content) => {
  try {
    const res = await axios.post(`${apiUrl}/todos`, {
      todo: {
        content: content,
      },
    });
    // console.log(res);

    // 即時更新清單
    todosListAPI();

    Swal.fire({
      title: `新增成功`,
      text: content,
      icon: "success",
      timer: 2000, // 2000 毫秒後自動關閉
      showConfirmButton: false, // 不顯示「確定」按鈕
    });
  } catch (error) {
    console.log(error.response.data);

    Swal.fire({
      title: `新增失敗`,
      text: error.response.data.message,
      icon: "error",
      confirmButtonColor: "#FFD370",
    });
  }
};
// 新增todos功能
addBtn.addEventListener("click", (e) => {
  if (!todoInput.value.trim()) return;
  addTodos(todoInput.value.trim());
  todoInput.value = "";
});

// 按enter打開輸入確認功能
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // 避免預設行為
    addBtn.click(); // 觸發按鈕的 click 事件
  }
});

// 修改todos API
const editTodos = async (Id, content) => {
  try {
    const res = await axios.put(`${apiUrl}/todos/${Id}`, {
      todo: {
        content: content,
      },
    });
    Swal.fire({
      title: res.data.message,
      text: content,
      icon: "success",
      confirmButtonColor: "#FFD370",
    });
  } catch (error) {
    Swal.fire({
      title: error.response.data.message,
      icon: "error",
      confirmButtonColor: "#FFD370",
    });
  }
};
// 修改/刪除todos功能
todoWrap.addEventListener("click", (e) => {
  //找清單項目容器
  const todoItem = e.target.closest(".todoItem");
  if (!todoItem) return;
  //找輸入框
  const itemInput = todoItem.querySelector(".todoInfo");
  if (!itemInput) return;

  // 原始input的value值
  let originalInputValue = "";

  // 如果點擊編輯按鈕
  if (e.target.closest(".iconEdit")) {
    originalInputValue = itemInput.value; //存取原始input的value值
    itemInput.removeAttribute("readonly"); //輸入框解除唯讀模式
    itemInput.focus(); //編輯輸入框聚焦

    //讓輸入框游標放在最後一個字元後面
    itemInput.setSelectionRange(itemInput.value.length, itemInput.value.length);

    // 確認修改彈窗
    const makeSureSwal = () => {
      Swal.fire({
        title: "是否確認修改",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "儲存修改",
        denyButtonText: `還原項目`,
        cancelButtonText: `繼續編輯`,
        confirmButtonColor: "#FFD370",
        denyButtonColor: "#9F9A91",
        cancelButtonColor: "#9F9A91",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          editTodos(todoItem.id, itemInput.value.trim()); //編輯內容存入後端
        } else if (result.isDenied) {
          itemInput.value = originalInputValue; //取消變更，還原原始字串
        } else {
          itemInput.removeAttribute("readonly"); //輸入框解除唯讀模式
          itemInput.focus(); //編輯輸入框聚焦
          //讓輸入框游標放在最後一個字元後面
          itemInput.setSelectionRange(
            itemInput.value.length,
            itemInput.value.length
          );
        }
      });
    };

    // 設定編輯輸入框按enter的行為
    const enterEditInput = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault(); // 避免預設行為
        itemInput.setAttribute("readonly", true); //輸入框唯讀模式
        makeSureSwal();
      }
    };
    // 編輯輸入框按enter觸發
    itemInput.addEventListener("keydown", enterEditInput);

    // 設定編輯輸入框失去焦點(再次點擊編輯輸入框以外的地方)
    itemInput.addEventListener("blur", (e) => {
      const activeEl = document.activeElement; //點選的位置

      // 如果點選的位置父元素是.swal2-shown，停止執行
      if (activeEl.closest(".swal2-shown")) return;

      if (itemInput.value !== originalInputValue) {
        makeSureSwal(); //詢問是否修改的彈窗
      } else {
        itemInput.setAttribute("readonly", true);
      }
    });
  }
});

// 刪除todos功能
