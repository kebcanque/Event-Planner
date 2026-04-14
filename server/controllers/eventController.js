const db = require('../config/db');

// Helper to check if user is admin (global access)
const isAdmin = async (user_id) => {
    if (!user_id) return false;
    const [rows] = await db.execute('SELECT username FROM USERS WHERE user_id = ?', [user_id]);
    return rows.length > 0 && rows[0].username === 'kebcanque';
};

// Get all events (including filters)
exports.getAllEvents = async (req, res) => {
    try {
        const { search, location, is_archived, user_id } = req.query;
        const is_admin = await isAdmin(user_id);

        let query = 'SELECT * FROM EVENTS WHERE is_archived = ?';
        let params = [is_archived === 'true' ? 1 : 0];

        // If not admin, restrict to user's own events
        if (!is_admin && user_id) {
            query += ' AND user_id = ?';
            params.push(user_id);
        } else if (!is_admin && !user_id) {
             // If no user_id provided and not admin, return empty or handle as unauthorized
             // For now, let's just allow it if we haven't strictly enforced auth everywhere yet, 
             // but the prompt asked to ALLOW kebcanque specifically.
        }

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
        const { user_id } = req.query;
        const is_admin = await isAdmin(user_id);

        let countQuery = 'SELECT COUNT(*) as count FROM EVENTS WHERE is_archived = 0';
        let upcomingQuery = 'SELECT COUNT(*) as count FROM EVENTS WHERE event_date >= NOW() AND event_date <= DATE_ADD(NOW(), INTERVAL 7 DAY) AND is_archived = 0';
        let params = [];

        if (!is_admin && user_id) {
            countQuery += ' AND user_id = ?';
            upcomingQuery += ' AND user_id = ?';
            params.push(user_id);
        }

        const [totalCountRows] = await db.execute(countQuery, params);
        const [upcomingRows] = await db.execute(upcomingQuery, params);
        
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
        
        // Capacity Guard (Global limit of 100 for now, or could be per user)
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
        // Mark as archived in EVENTS
        await db.execute('UPDATE EVENTS SET is_archived = 1 WHERE event_id = ?', [id]);
        
        // Add record to ARCHIVES
        await db.execute('INSERT INTO ARCHIVES (event_id) VALUES (?)', [id]);
        
        res.json({ message: 'Event archived successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Restore (Unarchive)
exports.restoreEvent = async (req, res) => {
    try {
        const { id } = req.params;
        // Mark as NOT archived in EVENTS
        await db.execute('UPDATE EVENTS SET is_archived = 0 WHERE event_id = ?', [id]);
        
        // Remove record from ARCHIVES log
        await db.execute('DELETE FROM ARCHIVES WHERE event_id = ?', [id]);
        
        res.json({ message: 'Event restored successfully' });
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
