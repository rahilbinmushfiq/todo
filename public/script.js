const form = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error("Failed to add todo");
    }

    const newTodo = await response.json();
    addTodoToDOM(newTodo);
    form.reset();
  } catch (error) {
    console.error("Error adding todo:", error.message);
  }
});

function addTodoToDOM(todo) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
        <input type="checkbox" id="checkbox-${todo.id}">
        <label for="checkbox-${todo.id}">${todo.title} - ${todo.description}</label>
        <button data-id="${todo.id}" class="delete-btn">Delete</button>
    `;
  todoList.appendChild(listItem);

  const checkbox = listItem.querySelector(`#checkbox-${todo.id}`);
  checkbox.addEventListener("change", async () => {
    try {
      const response = await fetch(`/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: checkbox.checked }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      listItem.classList.toggle("completed", checkbox.checked);
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  });

  const deleteButton = listItem.querySelector(".delete-btn");
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      listItem.remove();
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  });
}

// Fetch initial todos
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/todos");

    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }

    const todos = await response.json();
    todos.forEach((todo) => addTodoToDOM(todo));
  } catch (error) {
    console.error("Error fetching todos:", error.message);
  }
});
