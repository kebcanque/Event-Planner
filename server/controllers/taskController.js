const db = require('../config/db');

// Get all tasks for an event
exports.getTasksByEvent = async (req, res) => {
    try {
        const { event_id } = req.params;
        const [rows] = await db.execute('SELECT * FROM TASKS WHERE event_id = ?', [event_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a task
exports.addTask = async (req, res) => {
    try {
        const { event_id, task_description, due_date } = req.body;
        const [result] = await db.execute(
            'INSERT INTO TASKS (event_id, task_description, due_date) VALUES (?, ?, ?)',
            [event_id, task_description, due_date]
        );
        res.status(201).json({ id: result.insertId, message: 'Task added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a task (including completion status)
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { task_description, due_date, is_completed } = req.body;
        await db.execute(
            'UPDATE TASKS SET task_description = ?, due_date = ?, is_completed = ? WHERE task_id = ?',
            [task_description, due_date, is_completed, id]
        );
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM TASKS WHERE task_id = ?', [id]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
