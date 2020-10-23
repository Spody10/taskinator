var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
// create array to hold tasks 
var tasks = [];
var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  // check if inputs are empty
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  // reset form fields 
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;
  // check if task is new 
  var isEdit = formEl.hasAttribute("data-task-id");
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    var taskFormObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };
    createTaskEl(taskFormObj);
  }
};
var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  listItemEl.setAttribute("draggable", "true");
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }
  // save task 
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  // save tasks to localStorage
  saveTasks();

  // increase task counter 
  taskIdCounter++;
};
var createTaskActions = function (taskId) {
  // create container 
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);
  // delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);
  // change status dropdown
  var statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);
  // status options
  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];

    // append
    statusSelectEl.appendChild(statusOptionEl);
  }
  return actionContainerEl;
};
var completeEditTask = function (taskName, taskType, taskId) {
  // task list item 
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  // new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // find task 
  tasks.forEach(function (task) {
    if (task.id === parseInt(taskId)) {
        task.name = taskName;
        task.type = taskType;
    }
  });
  alert("Task Updated!");

  // save tasks 
  saveTasks();

  formEl.removeAttribute("data-task-id");
  formEl.querySelector("#save-task").textContent = "Add Task";
};
var taskButtonHandler = function (event) {
  // get target element 
  var targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};
var taskStatusChangeHandler = function (event) {
  console.log(event.target.value);
  // find task list 
  var taskId = event.target.getAttribute("data-task-id");
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  // convert to lower case
  var statusValue = event.target.value.toLowerCase();
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  // update task's in tasks array save to localStorage 
  tasks.forEach(function (task) {
    if (parseInt(taskId) === task.id) {
      task.status = statusValue;
    }
  });

  saveTasks();
};
var editTask = function (taskId) {
  console.log(taskId);
  // get task list item 
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  // get content
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);
  // write values taskName/taskType to form 
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  // set data attribute 
  formEl.setAttribute("data-task-id", taskId);
  
  formEl.querySelector("#save-task").textContent = "Save Task";
};
var deleteTask = function (taskId) {
  console.log(taskId);
  
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  
  tasks = tasks.filter(function (task) {
    if (parseInt(taskId) !== task.id) {
      return true;
    }
  });

  saveTasks();

  alert("Task deleted!");
};
var dropTaskHandler = function (event) {
  event.preventDefault();
  var id = event.dataTransfer.getData("text/plain");
  var draggableElement = document.querySelector("[data-task-id='" + id + "']");
  var dropzone = event.target.closest(".task-list");
  console.log(dropzone);
  var statusSelectEl = draggableElement.querySelector(
    "select[name='status-change']"
  );
  var statusType = dropzone.id;
  // create variable to hold status
  var newStatus;
  switch (statusType) {
    case "tasks-to-do":
      statusSelectEl.selectedIndex = 0;
      break;
    case "tasks-in-progress":
      statusSelectEl.selectedIndex = 1;
      break;
    case "tasks-completed":
      statusSelectEl.selectedIndex = 2;
      break;
    default:
      console.log("Something went wrong!");
  }
  tasks.forEach(function (task) {
    if (parseInt(id) === task.id) {
      task.status = statusSelectEl.value.toLowerCase();
    }
  });

  // saveTasks
  saveTasks();

  dropzone.removeAttribute("style");
  dropzone.appendChild(draggableElement);
};

// stops page from loading 
var dropzoneDragHandler = function (event) {
  event.preventDefault();
  if (event.target.closest(".task-list") !== null) {
    event.target
      .closest(".task-list")
      .setAttribute(
        "style",
        "background: rgba(68, 233, 255, 0.7); border-style: dashed;"
      );
  }
};

var dragTaskHandler = function (event) {
  if (event.target.matches("li.task-item")) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
  }
};

var dragLeaveHandler = function (event) {
  if (event.target.closest(".task-list") !== null) {
    event.target.closest(".task-list").removeAttribute("style");
  }
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("tasks saved");
};

var loadTasks = function () {
  var savedTasks = localStorage.getItem("tasks");

  if (!savedTasks) {
    return false;
  }
  console.log("Saved tasks found!");
  savedTasks = JSON.parse(savedTasks);
  savedTasks.forEach(createTaskEl);
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropzoneDragHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);

loadTasks();