const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todoapp',
    port: 3306
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Routes
// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get single task
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    try {
        const [result] = await pool.execute(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            [title.trim(), description || null]
        );
        
        const [newTask] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
    const { title, description, is_completed } = req.body;
    const taskId = req.params.id;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    try {
        const [result] = await pool.execute(
            'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?',
            [title.trim(), description || null, is_completed || false, taskId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const [updatedTask] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [taskId]
        );
        
        res.json(updatedTask[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Toggle task completion status
app.patch('/api/tasks/:id/toggle', async (req, res) => {
    const taskId = req.params.id;
    
    try {
        const [result] = await pool.execute(
            'UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?',
            [taskId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const [updatedTask] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [taskId]
        );
        
        res.json(updatedTask[0]);
    } catch (error) {
        console.error('Error toggling task:', error);
        res.status(500).json({ error: 'Failed to toggle task' });
    }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    
    try {
        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ?',
            [taskId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});