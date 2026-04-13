const db = require('../config/db');

// Get all events (including filters)
exports.getAllEvents = async (req, res) => {
    try {
        const { search, location, is_archived } = req.query;
        let query = 'SELECT * FROM EVENTS WHERE is_archived = ?';
        let params = [is_archived === 'true' ? 1 : 0];

        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (location) {
            query += ' AND location LIKE ?';
            params.push(`%${location}%`);
        }

        query += ' ORDER BY event_date ASC';
        
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get event stats
exports.getStats = async (req, res) => {
    try {
        const [totalCountRows] = await db.execute('SELECT COUNT(*) as count FROM EVENTS WHERE is_archived = 0');
        const [upcomingRows] = await db.execute('SELECT COUNT(*) as count FROM EVENTS WHERE event_date >= NOW() AND event_date <= DATE_ADD(NOW(), INTERVAL 7 DAY) AND is_archived = 0');
        
        const totalEvents = totalCountRows[0].count;
        const upcomingThisWeek = upcomingRows[0].count;
        const remainingSlots = 100 - totalEvents;

        res.json({
            totalEvents,
            upcomingThisWeek,
            remainingSlots
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, event_date, location, budget, user_id } = req.body;
        
        // Capacity Guard
        const [countRows] = await db.execute('SELECT COUNT(*) as count FROM EVENTS WHERE is_archived = 0');
        if (countRows[0].count >= 100) {
            return res.status(400).json({ message: 'Event limit reached (100). Please archive or delete events first.' });
        }

        const [result] = await db.execute(
            'INSERT INTO EVENTS (user_id, title, description, event_date, location, budget) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id || 1, title, description, event_date, location, budget]
        );
        res.status(201).json({ id: result.insertId, message: 'Event created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, event_date, location, budget, status, is_archived } = req.body;
        
        await db.execute(
            'UPDATE EVENTS SET title = ?, description = ?, event_date = ?, location = ?, budget = ?, status = ?, is_archived = ? WHERE event_id = ?',
            [title, description, event_date, location, budget, status, is_archived, id]
        );
        res.json({ message: 'Event updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Archive (Soft delete)
exports.archiveEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('UPDATE EVENTS SET is_archived = 1 WHERE event_id = ?', [id]);
        res.json({ message: 'Event archived' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete event (Permanent)
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM EVENTS WHERE event_id = ?', [id]);
        res.json({ message: 'Event deleted permanently' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
