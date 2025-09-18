// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import "./home.css";


type Task = {
  _id: string;
  title : string;
  status: "Completed" | "Pending";
  description: string;
  createdAt: string; 
};

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All"); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("https://to-do-po4f.onrender.com/tasks") 
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, []);

      const filteredTasks = tasks.filter((task) => {
         if (filter === "All") return true;
        if (filter === "Completed") return task.status === "Completed";
        if (filter === "Pending") return task.status !== "Completed";
        return true;
      });


  if (loading) return <p className="loading">Loading tasks...</p>;

  return (
    <div className="home-container">
      <h1 className="title">
        TODO <span className="highlight">LIST</span>
      </h1>

     
      <div className="filter-container">
        <label htmlFor="filter">SORT BY </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Complete</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks available. Add a new one!</p>
        ) : (
          filteredTasks.map((task) => (
            <div className="task-card" key={task._id}>
        <span
          className={`status-icon ${
           task.status === "Completed" ? "Completed" : "Pending"
          }`}
          >
          {task.status === "Completed" ? "✔" : "○"}
        </span>

        <div className="task-info">
        <h4>{task.title.toUpperCase()}</h4>
        <p>
          {task.description.length > 70
             ? task.description.substring(0, 70) + "..." // show first 100 chars
             : task.description}
        </p>
       </div>

        <button
                className="details-button"
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                View
              </button>

        <div className="task-date">
          {new Date(task.createdAt).toLocaleDateString()}
          </div>
          </div>

          ))
        )}
      </div>

      <div className="footer">
        <Link to="/" className="view-all">
          View All
        </Link>
        <Link to="/add" className="add-btn">
          ➕ Add Todo
        </Link>
      </div>
    </div>
  );
};

export default Home;
