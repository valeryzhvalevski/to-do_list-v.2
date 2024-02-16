"use strict";

let todos = [];
const btnSend = document.querySelector("#btnSend");
const inputNameTask = document.querySelector("#name");
const authorNameTask = document.querySelector("#pass");
const selectTask = document.querySelector("#select");
const contInProgress = document.querySelector(".container_inprogress ul");
const contMedium = document.querySelector(".container_medium ul");
const contDeadLine = document.querySelector(".container_deadline ul");
const errText = document.querySelector(".text_err");
const todosTaskLocalStorage = JSON.parse(localStorage.getItem('todosTask'));

btnSend.addEventListener("click", createSendTask);

if (todosTaskLocalStorage) {
  renderTaskPage(todosTaskLocalStorage);
  todos = todosTaskLocalStorage;
}

function createSendTask(event) {
  event.preventDefault();
  if (validateForm()) {
    errText.classList.remove("opacity");
    return;
  }
  errText.classList.add("opacity");

  const task = creteObjectTask();

  if (task.status === "inprogress") {
    contInProgress.appendChild(createTaskElement(task));
  } else if (task.status === "deadline") {
    contDeadLine.appendChild(createTaskElement(task));
  } else {
    contMedium.appendChild(createTaskElement(task));
  }

  todos.push(task);
  localStorage.setItem('todosTask', JSON.stringify(todos));
  inputNameTask.value = '';
  authorNameTask.value = '';
  selectTask.value = '';
}

function createTaskElement(task) {
  const { name, author, status, id } = task;
  const template = `
    <li>
      <div class="container_item">
        <p class="task_name task">Name task: ${name}</p>
        <p class="task_author task">Author task: <span>${author}</span></p>
        <p class="task_status task">Status task: <span>${status}</span></p>
        <p class="date_task task">Date task: <span>${new Date(id)}</span></p>
        <button class="btn_del" onclick="delTasks(${id})">Delete</button>
        <button class="btn_edit" onclick="editTask(${id})">Edit</button>
      </div>
      <div class="edit_item none" id="${id}">
        <div class="wrapper_item-edit">
          <label>Name edit</label>
          <input type="text" value="${name}" id="inputEditName" />
        </div>
        <div class="wrapper_item-edit">
          <label>Author edit</label>
          <input type="text" value="${author}" id="inputEditAuthor" />
        </div>
        <div class="wrapper_item-edit">
          <select id="selectEdit">
            <option hidden value="">Выберите тип задачи</option>
            <option value="inprogress">In progress</option>
            <option value="deadline">Deadline</option>
            <option value="error">Error</option>
          </select>   
        </div>
        <button onclick="saveEditTask(${id}, event)">Save</button>
        <button onclick="exitFuncEdit(event)">Cancel</button>
      </div>
    </li>
  `;

  const li = document.createElement("li");
  li.innerHTML = template;
  return li;
}

function delTasks(id) {
  todos = todos.filter((item) => item.id !== id);
  localStorage.setItem('todosTask', JSON.stringify(todos));
  renderTaskPage(todos);
}

function editTask(id) {
  const editItemArr = document.querySelectorAll(".edit_item");
  editItemArr.forEach((item) => {
    if (+item.id === id) {
      item.classList.remove("none");
    }
  });
}

function exitFuncEdit(event) {
  const parent = event.target.closest(".edit_item");
  parent.classList.add("none");
}

function saveEditTask(id, event) {
  const parent = event.target.closest(".edit_item");
  const inputEditName = parent.querySelector("#inputEditName").value;
  const inputEditAuthor = parent.querySelector("#inputEditAuthor").value;
  const selectEditTask = parent.querySelector("#selectEdit").value;
  const newTodos = todos.map((item) => {
    if (item.id === id) {
      item.name = inputEditName;
      item.author = inputEditAuthor;
      item.status = selectEditTask;
    }
    return item;
  });
  localStorage.setItem('todosTask', JSON.stringify(newTodos));
  renderTaskPage(newTodos);
}

function validateForm() {
  return (
    inputNameTask.value === "" ||
    authorNameTask.value === "" ||
    selectTask.value === ""
  );
}

function creteObjectTask() {
  const obj = {
    id: new Date().getTime(),
    name: inputNameTask.value,
    author: authorNameTask.value,
    status: selectTask.value,
  };
  return obj;
}

function renderTaskPage(arr) {
  contInProgress.innerHTML = "";
  contMedium.innerHTML = "";
  contDeadLine.innerHTML = "";

  arr.forEach((item) => {
    if (item.status === "inprogress") {
      contInProgress.appendChild(createTaskElement(item));
    } else if (item.status === "deadline") {
      contDeadLine.appendChild(createTaskElement(item));
    } else {
      contMedium.appendChild(createTaskElement(item));
    }
  });
}
