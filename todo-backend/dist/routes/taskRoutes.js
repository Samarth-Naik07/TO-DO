import { Router } from "express";
import Task from "../models/Task.js";
const router = Router();
// ✅ GET all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
});
// GET single task
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ error: "Task not found" });
        res.json(task);
    }
    catch (err) {
        res.status(400).json({ error: "Error fetching task" });
    }
});
// ✅ POST new task
router.post("/", async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const newTask = new Task({ title, description, status });
        await newTask.save();
        res.status(201).json(newTask);
    }
    catch (err) {
        res.status(400).json({ error: "Error creating task" });
    }
});
// ✅ PUT update task
router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask)
            return res.status(404).json({ error: "Task not found" });
        res.json(updatedTask);
    }
    catch (err) {
        res.status(400).json({ error: "Error updating task" });
    }
});
// ✅ DELETE task
router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask)
            return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    }
    catch (err) {
        res.status(400).json({ error: "Error deleting task" });
    }
});
export default router;
