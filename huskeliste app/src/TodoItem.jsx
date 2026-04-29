import { useState } from "react";

function TodoItem({ todo, onToggle, onDelete, onUpdate, lang }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      onUpdate(todo.id, trimmedText);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleSave = handleUpdate;

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      {isEditing ? (
        <input
          id={`edit-${todo.id}`}
          name={`edit-${todo.id}`}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
          autoComplete="off"
        />
      ) : (
        <span onDoubleClick={handleEdit}>{todo.text}</span>
      )}
      <button onClick={handleDelete}>
        {lang === 'lt' ? 'Ištrinti' : lang === 'no' ? 'Slett' : 'Delete'}
      </button>
    </li>
  );
}

export default TodoItem;

