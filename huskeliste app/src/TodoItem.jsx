import { useState } from "react";

function TodoItem({ todo, onToggle, onDelete, onUpdate, labels, maxLength }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      onUpdate(todo.id, trimmedText);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={todo.text}
      />
      {isEditing ? (
        <input
          type="text"
          id={`edit-${todo.id}`}
          name={`edit-${todo.id}`}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUpdate();
            if (e.key === "Escape") handleCancel();
          }}
          maxLength={maxLength}
          autoFocus
          autoComplete="off"
        />
      ) : (
        <span>{todo.text}</span>
      )}
      {!isEditing && (
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          {labels.editBtn}
        </button>
      )}
      <button onClick={() => onDelete(todo.id)}>
        {labels.deleteBtn}
      </button>
    </li>
  );
}

export default TodoItem;

