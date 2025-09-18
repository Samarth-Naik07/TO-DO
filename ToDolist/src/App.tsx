// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/home";
import AddTask from "./assets/addtask"; 
import TaskDetails from "./assets/taskdetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTask/>} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
