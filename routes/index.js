const express = require('express');
const router = express.Router();
const Task = require('../models/taskSchema');

router.get('/', async (req, res) => {
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

    res.render('index.ejs', {
        date,
        tasks,
        totalTasks,
        completedTasks,
        progress
    });
});


router.post('/tasks/add', async (req, res) => {
    const { taskName } = req.body;

    if (taskName) {
        const newTask = new Task({
            name: taskName,
            completed: false
        });

        await newTask.save();  
        res.redirect('/'); 
    } else {
        res.json({ success: false, error: 'Task name is required' });
    }
});


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
        res.json({ success: false, error });
    }
});




// Route to delete a task
router.delete('/tasks/delete/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error });
    }
});

module.exports = router;
