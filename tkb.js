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
                  "MT", "CD", "Sử", "Địa", "Sinh", "TD", "Tin", "AN"];

const ADMIN_HASH = "9d5c2327f77c860ce51fe6c19ee3642331a4a3bfc37b51c5b0de9950707f24f8";
let isAdmin = false;

const modeEl = document.getElementById("mode");
const codeEl = document.getElementById("code");
const okEl = document.getElementById("ok");

async function bam(chuoi) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(chuoi));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function capNhatMode() {
  document.body.classList.toggle("admin", isAdmin);
  modeEl.textContent = isAdmin ? "ADMIN" : "Khách";
  codeEl.style.display = isAdmin ? "none" : "";
  okEl.textContent = isAdmin ? "Thoát" : "OK";
  codeEl.placeholder = "Nhập mã";
  if (!isAdmin) closeAllMenus();
}

okEl.onclick = async () => {
  if (isAdmin) {
    isAdmin = false;
    try { localStorage.removeItem("tkbAdmin"); } catch (e) {}
    codeEl.value = "";
    capNhatMode();
    return;
  }
  const h = await bam(codeEl.value.trim());
  codeEl.value = "";
  if (h === ADMIN_HASH) {
    isAdmin = true;
    try { localStorage.setItem("tkbAdmin", h); } catch (e) {}
    capNhatMode();
  } else {
    codeEl.placeholder = "Sai mã";
  }
};

codeEl.onkeydown = e => {
  if (e.key === "Enter") okEl.click();
};

try {
  if (localStorage.getItem("tkbAdmin") === ADMIN_HASH) isAdmin = true;
} catch (e) {}

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

  const luu = giaTri => {
    if (!isAdmin) return;
    set(ref(db, "tkb2/o" + id), giaTri);
  };

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
    if (!isAdmin) return;
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

capNhatMode();
