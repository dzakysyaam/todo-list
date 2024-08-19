const express = require('express');
const router = express.Router();
const Task = require('../models/taskSchema');

// GET route for homepage
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

        const date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        res.render('index', {
            date,
            tasks,
            totalTasks,
            completedTasks,
            progress
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Server Error");
    }
});

// POST route to add a new task
router.post('/tasks/add', async (req, res) => {
    const { taskName } = req.body;

    if (taskName) {
        try {
            const newTask = new Task({
                name: taskName,
                completed: false
            });

            await newTask.save();  
            res.redirect('/'); 
        } catch (error) {
            console.error("Error adding task:", error);
            res.status(500).send("Server Error");
        }
    } else {
        res.json({ success: false, error: 'Task name is required' });
    }
});

// PATCH route to toggle task completion
router.patch('/tasks/complete/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.json({ success: false, error: 'Task not found' });
        }
        task.completed = !task.completed;
        await task.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating task:", error);
        res.json({ success: false, error: 'Server Error' });
    }
});

// DELETE route to remove a task
router.delete('/tasks/delete/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
