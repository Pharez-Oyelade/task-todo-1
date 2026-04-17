const state = {
  title: "Complete Stage 1 task",
  desc: "Extend the todo card and make it more interactive and stateful.Adding editable content, status transitions, priority changes, expand behavior, and richer accessibility patterns",
  priority: "High",
  status: "Pending",
  due: new Date("2026-04-17T23:59:59"),
};

const toggle = document.getElementById("completeToggle");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const priority = document.getElementById("priorityBadge");
const statusText = document.getElementById("statusText");
const priorityIndicator = document.getElementById("priorityIndicator");
const statusSelect = document.getElementById("statusSelect");
const editMode = document.getElementById("editMode");
const form = document.getElementById("form");
const cancelBtn = document.getElementById("cancelBtn");

const taskCard = document.getElementById("taskCard");
// const dueDate = new Date("2026-04-17T23:59:59");
const dueDateText = document.getElementById("dueDateText");
const timeLeftText = document.getElementById("timeLeft");

const editButton = document.getElementById("editButton");
const toggleDescription = document.getElementById("toggleDesc");

document.getElementById("deleteButton").addEventListener("click", () => {
  alert("Delete clicked");
});

// Render content

const DESC_LENGTH = 100;

function render() {
  taskTitle.textContent = state.title;
  taskDescription.textContent =
    state.desc.length <= DESC_LENGTH
      ? state.desc
      : state.desc.slice(0, DESC_LENGTH) + "...";
  state.desc.length <= DESC_LENGTH
    ? toggleDescription.classList.add("hidden")
    : toggleDescription.classList.remove("hidden");

  priority.textContent = state.priority;
  priority.className = "priority " + state.priority.toLowerCase();
  priorityIndicator.className =
    "priority-indicator " + state.priority.toLowerCase();

  statusText.textContent = state.status;
  statusText.classList.toggle("completed", state.status === "Done");
  state.status === "Done"
    ? taskTitle.classList.add("completed")
    : taskTitle.classList.remove("completed");
  state.status === "Done"
    ? taskCard.classList.add("completed")
    : taskCard.classList.remove("completed");

  toggle.checked = state.status === "Done";
  statusSelect.value = state.status;

  dueDateText.textContent = `Due ${formatDueDate(state.due)}`;
  dueDateText.setAttribute("datetime", state.due.toISOString());

  updateTimeLeft();
}

toggle.addEventListener("change", () => {
  state.status = toggle.checked ? "Done" : "Pending";
  render();
});

statusSelect.addEventListener("change", () => {
  state.status = statusSelect.value;
  render();
});

function formatDueDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function updateTimeLeft() {
  timeLeftText.classList.remove("overdue");
  if (state.status === "Done") {
    timeLeftText.textContent = "Completed";
    return;
  }

  const now = new Date();
  const diff = state.due - now;

  if (diff <= 0) {
    timeLeftText.textContent = "Overdue";
    timeLeftText.classList.add("overdue");
    return;
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let text = "";

  if (days > 0) {
    text = `Due in ${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    text = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    text = `Due in ${minutes} min`;
  }

  timeLeftText.textContent = text;
}

// dueDateText.innerText = `Due ${formatDueDate(dueDate)}`;
// updateTimeLeft();

setInterval(updateTimeLeft, 60000);

// collaps
// const toggleDescription = document.getElementById("toggleDesc");

let isExpanded = false;

toggleDescription.addEventListener("click", () => {
  isExpanded = !isExpanded;

  if (isExpanded) {
    taskDescription.textContent = state.desc;
  } else {
    taskDescription.textContent = state.desc.slice(0, DESC_LENGTH) + "... ";
  }
  const expanded = taskDescription.classList.toggle("expanded");
  toggleDescription.textContent = expanded ? "Show less" : "Show more";
  toggleDescription.setAttribute("aria-expanded", expanded);
});

// Edit Mode
editButton.addEventListener("click", () => {
  document.getElementById("editTitle").value = state.title;
  document.getElementById("editDesc").value = state.desc;
  document.getElementById("editPriority").value = state.priority;
  document.getElementById("editDate").valueAsDate = state.due;

  taskCard.classList.add("hidden");
  editMode.classList.remove("hidden");
});

const editTitle = document.getElementById("editTitle");
const editDesc = document.getElementById("editDesc");
const editPriority = document.getElementById("editPriority");
const editDate = document.getElementById("editDate");

// save
form.addEventListener("submit", (e) => {
  e.preventDefault();

  state.title = editTitle.value;
  state.desc = editDesc.value;
  state.priority = editPriority.value;
  state.due = new Date(editDate.value);

  closeEdit();
});

// cancel
cancelBtn.addEventListener("click", closeEdit);

function closeEdit() {
  editMode.classList.add("hidden");
  taskCard.classList.remove("hidden");

  render();
}

render();
