const todosContainer = document.querySelector(".todos-container");
const todoAddForm = document.querySelector(".todo-input-container");
const todoAddInput = document.querySelector(".todo-input");

const todoData = localStorage.getItem("topzyTodos")
  ? JSON.parse(localStorage.getItem("topzyTodos"))
  : [];

// event listeners
document.addEventListener("DOMContentLoaded", getAllTodos);
todoAddForm.addEventListener("submit", addTodo);
todosContainer.addEventListener("click", deleteTodo);
todosContainer.addEventListener("click", checkTodo);
todosContainer.addEventListener("click", editTodo);

// functions
function createNewTodo(sampleTodo) {
  const newTodo = document.createElement("div");
  newTodo.className = "todo-wrapper";
  newTodo.id = sampleTodo.id;
  newTodo.innerHTML = `
            <div class="todo">
                <div class="todo-left">
                <div class="check-div">
                    <input type="checkbox" name="todo" value=${
                      sampleTodo.text
                    } class='checkInput' ${sampleTodo.completed && "checked"} />
                </div>
                <label for="todo" class=${
                  sampleTodo.completed && "strike"
                } todo-label>${sampleTodo.text}</label>
                </div>
                <div class="todo-edit-wrapper">
                <input type="text" class="todo-edit" />
                <button class="todo-add-btn todo-edit-btn">Edit</button>
                </div>        
                <div class="todo-right">
                <button class="edit-btn">&#9998;</button>
                <button class="delete-btn">&#10006;</button>
                </div>
            </div>
            <div class="todo-dates">
                <p class="todo-created">Created: ${sampleTodo.createdAt}</p>
                <p class="todo-updated">Updated: ${sampleTodo.updatedAt}</p>
            </div>
        `;
  todosContainer.appendChild(newTodo);
}

function getAllTodos(e) {
  const storedTodos = JSON.parse(localStorage.getItem("topzyTodos")) || [];
  storedTodos.forEach((todo) => {
    createNewTodo(todo);
  });
}

function addTodo(e) {
  e.preventDefault();
  if (todoAddInput.value !== "") {
    const newTodo = {
      id: Math.random(),
      text: todoAddInput.value,
      completed: false,
      createdAt: dayjs().format("DD/MM/YYYY h:mma"),
      updatedAt: dayjs().format("DD/MM/YYYY h:mma"),
    };

    const storedTodos = JSON.parse(localStorage.getItem("topzyTodos")) || [];
    storedTodos.push(newTodo);
    localStorage.setItem("topzyTodos", JSON.stringify(storedTodos));
    createNewTodo(newTodo);
  }
  todoAddInput.value = ""
}

function deleteTodo(e) {
  if (e.target.classList.contains("delete-btn")) {
    const deleteBtn = e.target;
    const parentTodo = deleteBtn.parentElement.parentElement.parentElement;
    const parentTodoParent = parentTodo.parentElement;

    const storedTodos = JSON.parse(localStorage.getItem("topzyTodos")) || [];

    if (storedTodos.length !== 0) {
      const newTodoArray = storedTodos.filter(
        (todo) => String(todo.id) !== parentTodo.id
      );

      localStorage.setItem("topzyTodos", JSON.stringify(newTodoArray));
    }

    parentTodoParent.removeChild(parentTodo);
  }
}

function checkTodo(e) {
  if (e.target.classList.contains("checkInput")) {
    const checkBox = e.target;
    const parentTodo =
      checkBox.parentElement.parentElement.parentElement.parentElement;
    const parentTodoParent = parentTodo.parentElement;
    const textSibling = checkBox.parentElement.nextElementSibling;

    if (e.target.checked) {
      textSibling.classList.add("strike");
    } else {
      textSibling.classList.remove("strike");
    }

    const storedTodos = JSON.parse(localStorage.getItem("topzyTodos")) || [];

    if (storedTodos.length !== 0) {
      storedTodos.forEach((todo) => {
        if (String(todo.id) === parentTodo.id) {
          todo.completed = !todo.completed;
        }
      });
    }

    localStorage.setItem("topzyTodos", JSON.stringify(storedTodos));
  }
}

function editTodo(e) {
  if (e.target.classList.contains("edit-btn")) {
    const editBtn = e.target;
    const parentTodo = editBtn.parentElement.parentElement.parentElement;
    const parentTodoParent = parentTodo.parentElement;

    const todoLabel = Array.from(
      e.target.parentElement.parentElement.children
    )[0];

    const todoCheck = Array.from(
      e.target.parentElement.parentElement.children
    )[0];

    const todoInputForm = Array.from(
      e.target.parentElement.parentElement.children
    )[1];

    const todoInput = todoInputForm.firstElementChild;
    const todoEditBtn = todoInputForm.children[1];

    todoLabel.style.display = "none";
    todoInputForm.style.display = "block";
    todoAddInput.value = "";

    todoInput.value = todoLabel.children[1].innerText;

    todoEditBtn.addEventListener("click", () => {
      if (todoInput.value !== "") {
        todoLabel.children[1].innerText = todoInput.value;
        todoLabel.style.display = "flex";
        todoInputForm.style.display = "none";

        const storedTodos =
          JSON.parse(localStorage.getItem("topzyTodos")) || [];

        if (storedTodos.length !== 0) {
          storedTodos.forEach((todo) => {
            if (String(todo.id) === parentTodo.id) {
              todo.text = todoInput.value;
              todo.updatedAt = dayjs().format("DD/MM/YYYY h:mma");
            }
          });
        }
        localStorage.setItem("topzyTodos", JSON.stringify(storedTodos));
      }
    });
  }
}
