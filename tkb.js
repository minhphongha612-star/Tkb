import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_SMEnjHqfLf5IQ_VS5BzI-ZnaO2RN7-A",
  authDomain: "tkb9b16.firebaseapp.com",
  databaseURL: "https://tkb9b16-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tkb9b16",
  storageBucket: "tkb9b16.firebasestorage.app",
  messagingSenderId: "768829174493",
  appId: "1:768829174493:web:a108009c140d436610e134"
};

const db = getDatabase(initializeApp(firebaseConfig));

const SUBJECTS = ["TN", "ĐP", "Văn", "Hóa", "CN", "Toán", "Anh", "V/lí",
                  "MT", "CD", "Địa", "Sinh", "TD", "Tin", "AN"];

document.querySelectorAll(".i2 td").forEach((td, id) => {
  const text = document.createElement("span");
  text.textContent = td.textContent.trim();
  td.textContent = "";

  const x = document.createElement("button");
  x.className = "btn-x";
  x.textContent = "✕";
  x.title = "Xóa";

  const tri = document.createElement("button");
  tri.className = "btn-tri";
  tri.textContent = "▼";
  tri.title = "Chọn môn";

  const menu = document.createElement("div");
  menu.className = "menu";

  const luu = giaTri => set(ref(db, "tkb2/o" + id), giaTri);

  SUBJECTS.forEach(s => {
    const item = document.createElement("div");
    item.textContent = s;
    item.onclick = () => {
      luu(s);
      menu.classList.remove("show");
    };
    menu.appendChild(item);
  });

  x.onclick = () => {
    luu("");
    menu.classList.remove("show");
  };

  tri.onclick = e => {
    e.stopPropagation();
    const dangMo = menu.classList.contains("show");
    closeAllMenus();
    if (!dangMo) menu.classList.add("show");
  };

  td.append(x, text, tri, menu);

  onValue(ref(db, "tkb2/o" + id), snap => {
    if (snap.exists()) text.textContent = snap.val();
  });
});

function closeAllMenus() {
  document.querySelectorAll(".menu.show").forEach(m => m.classList.remove("show"));
}
document.addEventListener("click", closeAllMenus);
