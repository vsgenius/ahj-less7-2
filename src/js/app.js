document.addEventListener("DOMContentLoaded", (e) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    const res = JSON.parse(xhr.responseText);
    for (let key in res) {
      if (res.hasOwnProperty(key)) {
        var data = res[key];
        let li = document.createElement("li");
        let value = data.value;
        let t = document.createTextNode(value);
        li.appendChild(t);
        if (data.status === "done") {
          li.className = "checked";
        }
        let span = document.createElement("SPAN");
        let txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.id = key;
        span.addEventListener('click', (e)=> {
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
        document.getElementById("myUL").appendChild(li);
      }
    }
  };
  xhr.open("GET", "http://localhost:7070");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
});
const subscribeForm = document.querySelector(".subscribe-form");
let myNodelist = document.getElementsByTagName("LI");
for (i = 0; i < myNodelist.length; i++) {
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

let list = document.querySelector("ul");
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
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  span.addEventListener('click', (e)=> {
    const id = e.target.parentElement.id;
      e.target.parentElement.parentElement.removeChild(
        e.target.parentElement
      )});
  li.appendChild(span);
  li.id = id;
}
