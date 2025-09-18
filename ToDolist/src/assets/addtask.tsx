import React, { useState } from "react";
import "./AddTask.css";
import { useNavigate } from "react-router";

// Define type for Task
interface Task {
  title: string;
  description: string;
  status?: "Completed" | "Pending";
}

// Props are optional if you only want to call backend
interface AddTaskProps {
  onAdd?: (task: Task) => void; 
}


export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = { title, description };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const savedTask = await response.json();
      console.log("Task added:", savedTask);

      // Update parent state if onAdd is passed
      if (onAdd) {
        onAdd(savedTask);
      }

      // Reset form
      
      navigate("/");
    } catch (err) {
      console.error("Error adding task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addtask-container">
      <h1 className="addtask-heading">
        TODO <span>LIST</span>
      </h1>
      <form onSubmit={handleSubmit} className="addtask-card">
        <label className="addtask-label">TITLE</label>
        <input
          type="text"
          className="addtask-input"
          placeholder="Enter Todo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="addtask-label">DESCRIPTION</label>
        <textarea
          className="addtask-textarea"
          placeholder="Enter Todo Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit" className="addtask-btn add" disabled={loading}>
          {loading ? "ADDING..." : "ADD"}
        </button>
      </form>
    </div>
  );
}
