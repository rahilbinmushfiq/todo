const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

let todos = [];
app.use(express.static(path.join(__dirname, "public")));

(async () => {
  try {
    const data = await fs.readFile("todos.json");
    todos = JSON.parse(data);
  } catch (error) {
    console.error("Error reading todos from file:", error);
  }
})();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  const newTodo = { id: Date.now(), title, description, completed: false };
  todos.push(newTodo);
  saveTodosToFile();
  res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));
  if (todoIndex !== -1) {
    todos[todoIndex].title = title;
    todos[todoIndex].description = description;
    saveTodosToFile();
    res.json(todos[todoIndex]);
  } else {
    res.status(404).send("Todo not found");
  }
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => todo.id !== parseInt(id));
  saveTodosToFile();
  res.sendStatus(204);
});

function saveTodosToFile() {
  fs.writeFile("todos.json", JSON.stringify(todos)).catch((error) =>
    console.error("Error saving todos to file:", error)
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
