import ItcModal from "./modal";
let currentId;
const modal = new ItcModal({
  content: "",
  footerButtons: [
    { class: "btn btn-cancel", text: "Отмена", action: "cancel" },
    { class: "btn btn-ok", text: "Изменить", action: "ok" },
  ],
});
function renderList() {
  const myUL = document.getElementById("myUL");
  myUL.innerHTML = "";
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    let res = JSON.parse(xhr.responseText);
    for (let key in res) {
      if (res.hasOwnProperty(key)) {
        let data = res[key];
        let li = document.createElement("li");
        let value = data.value;
        let t = document.createTextNode(value);
        li.appendChild(t);
        if (data.status === "done") {
          li.className = "checked";
        }
        let spanFind = document.createElement("SPAN");
        spanFind.className = "find";
        spanFind.innerHTML = "&#128269";
        spanFind.addEventListener("click", (e) => {
          const id = e.target.parentNode.id;
          showText(e, id);
        });
        li.appendChild(spanFind);
        let spanEdit = document.createElement("SPAN");
        spanEdit.className = "edit";
        spanEdit.innerHTML = "&#9998";
        spanEdit.addEventListener("click", (e) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            const res = JSON.parse(xhr.responseText);
            console.log(res);
            modal.setBody(
              `<div><input/ id="${
                e.target.parentNode.id
              }"class="value" value="${
                res.value
              }"><input/ class="text" value="${res.text || ""}"></div>`
            );
          };
          xhr.open(
            "GET",
            "http://localhost:7070/?id=" + e.target.parentNode.id
          );
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xhr.send();

          modal.setTitle("Редактирование заметки");
          modal.show();
        });
        li.appendChild(spanEdit);
        let span = document.createElement("SPAN");
        let txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.id = key;
        currentId = key;
        span.addEventListener("click", (e) => {
          const id = e.target.parentElement.id;
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            e.target.parentElement.parentElement.removeChild(
              e.target.parentElement
            );
          };
          xhr.open("DELETE", "http://localhost:7070/?id=" + id);
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xhr.send();
        });
        li.appendChild(span);
        myUL.appendChild(li);
      }
    }
  };
  xhr.open("GET", "http://localhost:7070");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}
document.addEventListener("DOMContentLoaded", (e) => {
  renderList();
});
const subscribeForm = document.querySelector(".subscribe-form");
let myNodelist = document.getElementsByTagName("LI");
for (let i = 0; i < myNodelist.length; i++) {
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

const list = document.querySelector("ul");
list.addEventListener(
  "click",
  function (ev) {
    if (ev.target.tagName === "LI") {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        ev.target.classList.toggle("checked");
      };
      xhr.open("PATCH", "http://localhost:7070/?id=" + ev.target.id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    }
  },
  false
);
const addBtn = document.querySelector(".addBtn");
addBtn.addEventListener("click", (e) => {
  if (subscribeForm.myInput.value === "") return;
  const body = "value=" + e.target.parentNode.querySelector("#myInput").value;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    newElement(xhr.response);
  };
  xhr.open("POST", "http://localhost:7070");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
});
const btnCancel = document.querySelector(".btn-cancel");
btnCancel.addEventListener("click", () => {
  modal.hide();
});
const btnOk = document.querySelector(".btn-ok");
btnOk.addEventListener("click", (e) => {
  const value = e.target.parentNode.parentNode.querySelector(".value");
  const text = e.target.parentNode.parentNode.querySelector(".text") || "";
  console.log(text)
  const body = "value=" + value.value + "&text=" + text.value;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    renderList();
    modal.hide();
  };
  xhr.open("PATCH", "http://localhost:7070/?id=" + value.id);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
});
subscribeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (subscribeForm.myInput.value === "") return;
  const body = "value=" + subscribeForm.myInput.value;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    newElement(xhr.response);
  };
  xhr.open("POST", "http://localhost:7070");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
});
function showText(e, id) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    const res = JSON.parse(xhr.responseText);
    if (!e.target.parentNode.querySelector(".text")) {
      const div = document.createElement("div");
      div.classList.add("text");
      div.textContent = res[id].text || "Нет текста заметки";
      e.target.parentNode.appendChild(div);
    } else {
      e.target.parentElement.removeChild(
        e.target.parentNode.querySelector(".text")
      );
    }
  };
  xhr.open("GET", "http://localhost:7070");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
}
function newElement(id) {
  let li = document.createElement("li");
  let inputValue = document.getElementById("myInput").value;
  let t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === "") {
    alert("Вы должны что-то написать!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";
  let spanFind = document.createElement("SPAN");
  spanFind.className = "find";
  spanFind.innerHTML = "&#128269";
  spanFind.addEventListener("click", (e) => {
    const id = e.target.parentNode.id;
    showText(e, id);
  });
  li.appendChild(spanFind);
  let spanEdit = document.createElement("SPAN");
  spanEdit.className = "edit";
  spanEdit.innerHTML = "&#9998";
  spanEdit.addEventListener("click", (e) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      const res = JSON.parse(xhr.responseText);
      modal.setBody(
        `<div><input/ id="${e.target.parentNode.id}"class="value" value="${
          res.value
        }"><input/ class="text" value="${res.text || ""}"></div>`
      );
    };
    xhr.open("GET", "http://localhost:7070/?id=" + e.target.parentNode.id);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();

    modal.setTitle("Редактирование заметки");
    modal.show();
  });
  li.appendChild(spanEdit);
  let spanDelete = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  spanDelete.className = "close";
  spanDelete.appendChild(txt);
  spanDelete.addEventListener("click", (e) => {
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
  });
  li.appendChild(spanDelete);
  li.id = id;
  currentId = id;
}
