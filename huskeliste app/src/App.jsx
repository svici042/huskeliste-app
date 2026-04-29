import { useState } from "react";
import TodoItem from "./TodoItem.jsx";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="app">
      <img src="/Logo/LovLaus%20logo.png" alt="LovLaus Logo" className="logo" />
      <h1>Huskeliste App (To Do)</h1>
      <div className="add-todo">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pridėti naują užduotį..."
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
        />
        <button onClick={addTodo}>Pridėti</button>
      </div>
      <div className="stats">
        {totalCount === 0 ? (
          <p>Nėra užduočių. Pridėkite pirmąją!</p>
        ) : (
          <p>
            {completedCount}/{totalCount} atlikta
          </p>
        )}
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;

