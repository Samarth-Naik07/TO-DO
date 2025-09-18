import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TaskDetails.css";

type Task = {
  _id: string;
  title: string;
  description: string;
  status?: "Completed" | "Pending";
};

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch single task
  useEffect(() => {
    fetch(`http://localhost:5000/tasks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task");
        return res.json();
      })
      .then((data) => {
        setTask(data);
        setEditedTitle(data.title);
        setEditedDescription(data.description);
      })
      .catch((err) => console.error("Error fetching task:", err));
  }, [id]);

  // Update task
  const handleUpdate = async () => {
    if (!id || !task) return;
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: editedTitle,
          description: editedDescription,
          status: task.status
        }),
      });
      const updatedTask = await res.json();
      setTask(updatedTask);
      setTimeout(() => {
        navigate("/");
      }, 500);
       // redirect home after update
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task after confirmation
  const confirmDelete = async () => {
    if (!id) return;
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
      });
      navigate("/"); // redirect home after delete
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Toggle task status
  const handleComplete = async () => {
    if (!id || !task) return;
    try {
      const updatedStatus = task.status === "Completed" ? "Pending" : "Completed";
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: editedTitle,
          description: editedDescription,
          status: updatedStatus 
        }),
      });
      const updatedTask = await res.json();
      setTask(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (!task) {
    return (
      <div className="todo-container">
        <h1 className="todo-heading">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <h1 className="todo-heading">
        TODO <span>LIST</span>
      </h1>

      <div className="todo-form">
        <div className="todo-row">
          <div className="finish-section">
            <label className="todo-label-checkmark">status</label>
            <div 
              className={`checkbox ${task.status === "Completed" ? "checked" : ""}`}
              onClick={handleComplete}
            >
             {task.status === "Completed" ? 
             (<span className="checkmark">✓</span>):
             (<span className="non_checkmark">✓</span>) 
  }
              
            </div>
          </div>

          <div className="title-section">
            <label className="todo-label">TITLE</label>
            <input
              type="text"
              className="todo-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="TODO TITLE"
            />
          </div>
        </div>

        <div className="description-section">
          <label className="todo-label"></label>
          <textarea
            className="todo-textarea"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Task description..."
            rows={6}
          />
        </div>
        

        <div className="todo-actions">
          <button className="update-btn" onClick={handleUpdate}>
            UPDATE
          </button>
          <button className="delete-btn" onClick={() => setShowConfirm(true)}>
            DELETE
          </button>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to delete this task?</p>
            <div className="confirm-actions">
              <button className="confirm-btn yes" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="confirm-btn no" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}