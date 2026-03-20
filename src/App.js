import { useState } from "react";
import "./App.css";

const toInputFormat = (str) => {
  const parts = str.split("/");
  if (parts.length !== 3) return "";
  const [y, m, d] = parts;
  return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
};

const COLORS = [
  { id: "default", value: "#555" },
  { id: "red",     value: "#e07070" },
  { id: "green",   value: "#4a9e75" },
  { id: "blue",    value: "#4a86c8" },
];

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "React 공부하기", done: false, color: "#555", date: "" },
    { id: 2, text: "포트폴리오 완성하기", done: false, color: "#e07070", date: "" },
    { id: 3, text: "영화 검색 앱 배포하기", done: false, color: "#555", date: "" },
  ]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [selectedColor, setSelectedColor] = useState("#555");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editColor, setEditColor] = useState("#555");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, {
      id: Date.now(),
      text: input,
      done: false,
      color: selectedColor,
      date: date
    }]);
    setInput("");
    setDate("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const openEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
    setEditDate(todo.date);
    setEditColor(todo.color);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setTodos(todos.map(todo =>
      todo.id === editId
        ? { ...todo, text: editText, date: editDate, color: editColor }
        : todo
    ));
    setEditId(null);
    setEditText("");
    setEditDate("");
    setEditColor("#555");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
    setEditDate("");
    setEditColor("#555");
  };

  return (
    <div className="app">
      <div className="card">

        {/* 제목 */}
        <h1 className="title">TO DO LIST</h1>
        <div className="divider" />

        {/* 색상 선택 */}
        <div className="color-row">
          {COLORS.map(c => (
            <button
              key={c.id}
              className={`color-btn ${selectedColor === c.value ? "active" : ""}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setSelectedColor(c.value)}
            />
          ))}
        </div>

        {/* 날짜 입력 */}
        <div className="date-row">
          <div className="date-input-wrap">
            <input
              type="text"
              className="date-input"
              placeholder="날짜 입력 (예: 2026/3/21)"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="calendar-wrap">
              <span className="calendar-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7dba9c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <input
                type="date"
                className="date-picker-over"
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  setDate(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
                }}
              />
            </div>
          </div>
        </div>

        {/* 할 일 입력 */}
        <div className="input-row">
          <input
            type="text"
            placeholder="할 일을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            style={{ color: selectedColor }}
          />
          <button className="add-btn" onClick={addTodo}>추가</button>
        </div>

        <div className="divider" />

        {/* 할 일 목록 */}
        <ul className="todo-list">
          {todos.length === 0 && (
            <li className="empty">할 일을 추가해보세요 😊</li>
          )}
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <span className="todo-date">{todo.date || "-"}</span>
              <div
                className={`checkbox ${todo.done ? "checked" : ""}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.done && <span className="checkmark">✓</span>}
              </div>
              <span
                className="todo-text"
                style={{
                  color: todo.color,
                  textDecoration: todo.done ? "line-through" : "none",
                  opacity: todo.done ? 0.4 : 1
                }}
              >
                {todo.text}
              </span>
              <button className="edit-btn" onClick={() => openEdit(todo)}>✎</button>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>✕</button>
            </li>
          ))}
        </ul>

        {/* 완료 항목 삭제 */}
        <button
          className="clear-btn"
          onClick={() => setTodos(todos.filter(todo => !todo.done))}
        >
          완료 항목 삭제
        </button>

      </div>

      {/* 수정 팝업 */}
      {editId && (
        <div className="overlay" onClick={cancelEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">수정하기</h2>
            <div className="modal-divider" />

            <div className="color-row" style={{ justifyContent: "center", marginBottom: "1rem" }}>
              {COLORS.map(c => (
                <button
                  key={c.id}
                  className={`color-btn ${editColor === c.value ? "active" : ""}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setEditColor(c.value)}
                />
              ))}
            </div>

            <input
              className="modal-input"
              type="text"
              placeholder="날짜 (예: 2026/3/21)"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              style={{ marginBottom: "0.75rem", color: "#aaa" }}
            />

            <input
              className="modal-input"
              type="text"
              placeholder="할 일 내용"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              style={{ color: editColor }}
              autoFocus
            />

            <div className="modal-btns">
              <button className="modal-cancel" onClick={cancelEdit}>취소</button>
              <button className="modal-save" onClick={saveEdit}>수정하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;