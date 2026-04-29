import { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('huskeliste-lang') || 'lt');

  const textMap = {
    lt: {
      title: 'Huskeliste App (To Do)',
      placeholder: 'Pridėti naują užduotį...',
      addButton: 'Pridėti',
      noTasks: 'Nėra užduočių. Pridėkite pirmąją!',
      stats: 'atlikta',
      deleteBtn: 'Ištrinti'
    },
    no: {
      title: 'Huskeliste App (Oppgaveliste)',
      placeholder: 'Legg til ny oppgave...',
      addButton: 'Legg til',
      noTasks: 'Ingen oppgaver. Legg til den første!',
      stats: 'ferdig',
      deleteBtn: 'Slett'
    },
    en: {
      title: 'To Do App',
      placeholder: 'Add new task...',
      addButton: 'Add',
      noTasks: 'No tasks. Add the first one!',
      stats: 'completed',
      deleteBtn: 'Delete'
    }
  };

  const cycleLang = () => {
    const langs = ['lt', 'no', 'en'];
    const currentIndex = langs.indexOf(lang);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLang(langs[nextIndex]);
  };

useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('huskeliste-todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(Array.isArray(parsedTodos) ? parsedTodos : []);
      }
    } catch (e) {
      console.error('LocalStorage load error:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('huskeliste-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('huskeliste-lang', lang);
  }, [lang]);

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

  const updateTodo = (id, newText) => {
    setTodos(todos.map((todo) =>
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
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <li><a href="#apie">Apie mus</a></li>
          <li><a href="#paslaugos">Paslaugos</a></li>
          <li><a href="#kontaktai">Kontaktai</a></li>
          <li><a href="#lovlaus">LovLaus</a></li>
        </ul>
        <button className="lang-toggle" onClick={cycleLang}>
          {lang.toUpperCase()}
        </button>
      </nav>
      <img src="/Logo/LovLaus logo.png" alt="LovLaus Logo" className="logo" />
      <h1>{textMap[lang].title}</h1>
      <div className="add-todo">
        <input
          id="new-todo-input"
          name="new-todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={textMap[lang].placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
          autoComplete="off"
        />
        <button onClick={addTodo}>{textMap[lang].addButton}</button>
      </div>
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
            lang={lang}
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

