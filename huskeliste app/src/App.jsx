import { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import "./App.css";

const STORAGE_KEYS = {
  todos: "huskeliste-todos",
  lang: "huskeliste-lang",
};
const SUPPORTED_LANGS = ["lt", "no", "en"];
const MAX_TODO_LENGTH = 500;

const createTodoId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const isValidTodo = (todo) =>
  todo !== null &&
  typeof todo === "object" &&
  (typeof todo.id === "string" || typeof todo.id === "number") &&
  typeof todo.text === "string" &&
  todo.text.trim().length > 0 &&
  todo.text.length <= MAX_TODO_LENGTH &&
  typeof todo.completed === "boolean";

const loadTodos = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.todos));
    return Array.isArray(parsed) ? parsed.filter(isValidTodo) : [];
  } catch {
    return [];
  }
};

const loadLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.lang);
    return SUPPORTED_LANGS.includes(savedLanguage) ? savedLanguage : "lt";
  } catch {
    return "lt";
  }
};

function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [inputValue, setInputValue] = useState("");
  const [lang, setLang] = useState(loadLanguage);

  const textMap = {
    lt: {
      title: 'Huskeliste App (To Do)',
      placeholder: 'Pridėti naują užduotį...',
      addButton: 'Pridėti',
      noTasks: 'Nėra užduočių. Pridėkite pirmąją!',
      stats: 'atlikta',
      deleteBtn: 'Ištrinti',
      editBtn: 'Redaguoti'
    },
    no: {
      title: 'Huskeliste App (Oppgaveliste)',
      placeholder: 'Legg til ny oppgave...',
      addButton: 'Legg til',
      noTasks: 'Ingen oppgaver. Legg til den første!',
      stats: 'ferdig',
      deleteBtn: 'Slett',
      editBtn: 'Rediger'
    },
    en: {
      title: 'To Do App',
      placeholder: 'Add new task...',
      addButton: 'Add',
      noTasks: 'No tasks. Add the first one!',
      stats: 'completed',
      deleteBtn: 'Delete',
      editBtn: 'Edit'
    }
  };

  const cycleLang = () => {
    const currentIndex = SUPPORTED_LANGS.indexOf(lang);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGS.length;
    setLang(SUPPORTED_LANGS[nextIndex]);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
    } catch {
      // The app remains usable when storage is unavailable or full.
    }
  }, [todos]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEYS.lang, lang);
    } catch {
      // The selected language still works for the current session.
    }
  }, [lang]);

  const addTodo = (event) => {
    event?.preventDefault();
    if (inputValue.trim() === "") return;
    const newTodo = {
      id: createTodoId(),
      text: inputValue.trim(),
      completed: false,
    };
    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id) => {
    setTodos((currentTodos) => currentTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, newText) => {
    setTodos((currentTodos) => currentTodos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="app">
      {/* Flying small logos */}
      <div className="logo-particle"></div>
      <div className="logo-particle"></div>
      <div className="logo-particle"></div>
      <div className="logo-particle"></div>
      
      <nav className="navbar">
        <button className="lang-toggle" onClick={cycleLang} aria-label="Change language">
          {lang.toUpperCase()}
        </button>
      </nav>
      <img src="./Logo/LovLaus logo.png" alt="LovLaus Logo" className="logo" />
      <h1>{textMap[lang].title}</h1>
      <form className="add-todo" onSubmit={addTodo}>
        <input
          id="new-todo-input"
          name="new-todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={textMap[lang].placeholder}
          maxLength={MAX_TODO_LENGTH}
          aria-label={textMap[lang].placeholder}
          autoComplete="off"
        />
        <button type="submit">{textMap[lang].addButton}</button>
      </form>
      <div className="stats">
        {totalCount === 0 ? (
          <p>{textMap[lang].noTasks}</p>
        ) : (
          <p>
            {completedCount}/{totalCount} {textMap[lang].stats}
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
            onUpdate={updateTodo}
            labels={textMap[lang]}
            maxLength={MAX_TODO_LENGTH}
          />
        ))}
      </ul>
      
      <footer className="footer">
        <p>&copy; 2026 LovLaus Media</p>
      </footer>
    </div>
  );
}

export default App;
