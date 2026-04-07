import './style.css';
import EditBtn from './assets/edit.svg'
import DeleteBtn from './assets/trash.svg'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Todo() {
  const [newTodo, setNewTodo] = useState('');
  const [todo, setTodo] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [activeDeadlineId, setActiveDeadlineId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const handleDeadlineClick = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDateChange = (id, date) => {
    updateDeadline(id, date);
    setOpenDropdownId(null); // close dropdown after selecting date
  };
  const completedCount = todo.filter(t => t.completed).length;
  const pendingCount = todo.filter(t => !t.completed).length;
  const totalCount = todo.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const token = sessionStorage.getItem("token")
      const response = await axios.post('http://localhost:3000/api/todos',
        { text: newTodo },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTodo(prev => [...prev, response.data]);
      console.log(todo)
      setNewTodo("");
    }
    catch (error) {
      console.log("Error in adding data", error);
    }
  }

  const fetchTodo = (async () => {
    try {
      console.log("CALLING:", '/api/todos');
      const token = sessionStorage.getItem("token")

      const response = await axios.get(
        'http://localhost:3000/api/todos',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTodo(response.data);
    }
    catch (error) {
      console.log("Error in fetching data", error)
    }
  })

  useEffect(() => {

    fetchTodo();
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setOpenDropdownId(null);
        setActiveDeadlineId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const startEditing = async (id) => {
    setEditing(true);
    setEditingId(id);
  }
  const updateTodo = async (id) => {
    try {
      const token = sessionStorage.getItem("token")

      await axios.patch(
        `http://localhost:3000/api/todos/${id}`,
        { text: editedText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ update UI
      setTodo(prev =>
        prev.map(item =>
          item._id === id
            ? { ...item, text: editedText }
            : item
        )
      );

      setEditedText('');
      setEditing(false);
      setEditingId(null);

    } catch (error) {
      console.log("Error in updating todo", error);
    }
  };

  const updatingStatus = async (t) => {
    try {
      const token = sessionStorage.getItem("token")

      await axios.patch(
        `http://localhost:3000/api/todos/${t._id}`,
        { completed: !t.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ update UI instantly
      setTodo(prev =>
        prev.map(item =>
          item._id === t._id
            ? { ...item, completed: !item.completed }
            : item
        )
      );

    } catch (error) {
      console.log(error);
    }
  };



  const deleteTodo = async (id) => {
    try {
      const token = sessionStorage.getItem("token")

      await axios.delete(
        `http://localhost:3000/api/todos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ Update UI instantly
      setTodo(prev =>
        prev.filter((t) => t._id !== id)
      );

    } catch (error) {
      console.log("Error in deleting data", error);
    }
  };

  const updateDeadline = async (id, date) => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await axios.patch(
        `http://localhost:3000/api/todos/${id}/deadline`,
        { deadline: date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update UI instantly
      setTodo(prev =>
        prev.map(t => t._id === id ? { ...t, deadline: date } : t)
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container'>
      <div className='taskForm'>
        <h1 className='todo-heading'>Get Things Done!</h1>
        <div className="dashboard">
          <div className="card completed">
            <h4>Completed</h4>
            <p>{completedCount}</p>
          </div>

          <div className="card pending">
            <h4>Pending</h4>
            <p>{pendingCount}</p>
          </div>

          <div className="card total">
            <h4>Total</h4>
            <p>{totalCount}</p>
          </div>
        </div>
        <div className="progress-container">
          <div className="my-progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>

        <form className='form' onSubmit={addTodo}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder='Add Task' id="taskInput" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
            <span className='input-group-text d-flex p-0'><button type="submit" className="addBtn h-100" >Add</button></span>
          </div>
        </form>
      </div>
      {todo.length === 0 ? <div></div> : todo.map((t) => (
        <div key={t._id} className='todolist d-flex justify-content-between align-items-center'>
          <input
            className="form-check-input"
            type="checkbox"
            checked={t.completed}
            onChange={() => updatingStatus(t)}
          />
          {editing && editingId === t._id ? (
            <div>
              <input
                className='editingField'
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button onClick={() => updateTodo(t._id)} className="savebtn">Save</button>
            </div>
          ) : (
            <>
              <div>
                {t.text}
                {t.deadline && (
                  <small style={{ marginLeft: 0, color: "green", display: "block" }}>
                    Deadline: {new Date(t.deadline).toLocaleDateString()}
                  </small>
                )}
              </div>

              <div className='btn-group'>
                <button className='icons' onClick={() => {
                  startEditing(t._id);
                  setEditedText(t.text);
                }}>
                  <img src={EditBtn} alt="" />
                </button>
                <button className='icons' onClick={() => deleteTodo(t._id)}>
                  <img src={DeleteBtn} alt="" />
                </button>
              </div>
            </>
          )}

          <div className='dropdown' style={{ position: "relative" }}>
            <button
              className='icons'
              onClick={() => handleDeadlineClick(t._id)}
            >
              <i className='bi bi-three-dots-vertical'></i>
            </button>

            {openDropdownId === t._id && (
              <div
                className='dropdown-menu show'
                style={{
                  display: "block",
                  position: "absolute",
                  right: 0,
                  padding: "5px",
                  minWidth: "150px"
                }}
              >
                {activeDeadlineId === t._id ? (
                  <input
                    type="date"
                    style={{ width: "100%" }}
                    value={t.deadline ? t.deadline.split("T")[0] : ""}
                    onChange={(e) => handleDateChange(t._id, e.target.value)}
                    onBlur={() => setActiveDeadlineId(null)}
                    autoFocus
                  />
                ) : (
                  <div
                    className='dropdown-item'
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveDeadlineId(t._id)}
                  >
                    {t.deadline ? "Update Deadline" : "Add Deadline"}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      ))}
    </div>)
}