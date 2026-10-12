const STORAGE_KEY = "still-todos-v1";

/** @typedef {{ id: string, text: string, completed: boolean, createdAt: number }} Task */

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const listEl = document.querySelector("#task-list");
const emptyEl = document.querySelector("#empty-state");
const countEl = document.querySelector("#task-count");

/** @type {Task[]} */
let tasks = loadTasks();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks = [
    {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    },
    ...tasks,
  ];

  input.value = "";
  persist();
  render();
  input.focus();
});

listEl.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") {
    return;
  }

  const id = target.closest(".task-item")?.dataset.id;
  if (!id) return;

  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: target.checked } : task,
  );
  persist();
  render();
});

listEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const button = target.closest(".btn-delete");
  if (!(button instanceof HTMLButtonElement)) return;

  const item = button.closest(".task-item");
  const id = item?.dataset.id;
  if (!id || !(item instanceof HTMLElement)) return;

  item.classList.add("is-leaving");
  window.setTimeout(() => {
    tasks = tasks.filter((task) => task.id !== id);
    persist();
    render();
  }, 220);
});

function render() {
  const openCount = tasks.filter((task) => !task.completed).length;
  countEl.textContent =
    openCount === 1 ? "1 open" : `${openCount} open`;

  const hasTasks = tasks.length > 0;
  emptyEl.hidden = hasTasks;
  listEl.hidden = !hasTasks;

  if (!hasTasks) {
    listEl.innerHTML = "";
    return;
  }

  listEl.innerHTML = tasks
    .map(
      (task) => `
      <li class="task-item${task.completed ? " is-complete" : ""}" data-id="${task.id}">
        <input
          class="task-check"
          type="checkbox"
          ${task.completed ? "checked" : ""}
          aria-label="Mark “${escapeAttr(task.text)}” complete"
        />
        <p class="task-text">${escapeHtml(task.text)}</p>
        <button type="button" class="btn-delete" aria-label="Delete “${escapeAttr(task.text)}”">
          Delete
        </button>
      </li>
    `,
    )
    .join("");
}

/** @returns {Task[]} */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.text === "string" &&
          typeof item.completed === "boolean",
      )
      .map((item) => ({
        id: item.id,
        text: item.text,
        completed: item.completed,
        createdAt:
          typeof item.createdAt === "number" ? item.createdAt : Date.now(),
      }));
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/** @param {string} value */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** @param {string} value */
function escapeAttr(value) {
  return escapeHtml(value);
}

render();
