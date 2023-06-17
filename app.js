const form = document.getElementById("add-task-form");
const input = document.getElementById("task-input");
const todoList = document.getElementById("todo-list");

let tasks = [];

function addTask(task) {
  tasks.push(task);
  saveTasks();
  renderTodoList();
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTodoList();
}

function editTask(index, newTask) {
  tasks[index] = newTask;
  saveTasks();
  renderTodoList();
}

function toggleCompleted(index) {
  const task = tasks[index];
  tasks[index] = {
    ...task,
    completed: !task.completed,
  };
  saveTasks();
  renderTodoList();
}

function customizeColor(index, color) {
  const task = tasks[index];
  tasks[index] = {
    ...task,
    color: color,
  };
  saveTasks();
  renderTodoList();
}

function renderTodoList() {
  todoList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = index;
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);

    if (task.color) {
      li.style.backgroundColor = task.color;
    }

    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleCompleted(index));
    li.appendChild(checkbox);

    const span = document.createElement("span");
    span.innerText = task.text;
    li.appendChild(span);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      const newTask = prompt("Enter the new task name:", task.text);
      if (newTask !== null) {
        editTask(index, { text: newTask, color: task.color, completed: task.completed });
      }
    });
    li.appendChild(editButton);

    if (!task.completed) {
      const colorSelect = document.createElement("select");
      colorSelect.addEventListener("change", () => {
        customizeColor(index, colorSelect.value);
      });
      const defaultOption = document.createElement("option");
      defaultOption.text = "Select a color";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      colorSelect.add(defaultOption);
      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
      colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.text = color;
        if (task.color === color) {
          option.selected = true;
        }
        colorSelect.add(option);
      });
      li.appendChild(colorSelect);
    }

    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.classList.add("delete-button");
    removeButton.addEventListener("click", () => {
      removeTask(index);
    });
    li.appendChild(removeButton);

    todoList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks != null) {
    tasks = JSON.parse(storedTasks);
    renderTodoList();
  }
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.index);
  event.dataTransfer.dropEffect = "move";
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
  event.preventDefault();
  const sourceIndex = event.dataTransfer.getData("text/plain");
  const targetIndex = event.target.dataset.index;
  if (sourceIndex !== targetIndex) {
    tasks.splice(targetIndex, 0, tasks.splice(sourceIndex, 1)[0]);
    saveTasks();
    renderTodoList();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskText = input.value.trim();
  if (taskText.length > 0) {
    addTask({ text: taskText, color: null, completed: false });
    input.value = "";
  }
});

loadTasks();