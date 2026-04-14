const db = require('../config/db');

// Get archival logs (joined with EVENTS)
exports.getArchivedLogs = async (req, res) => {
    try {
        const { user_id } = req.query;
        
        // Check if admin
        let isAdmin = false;
        if (user_id) {
            const [userRows] = await db.execute('SELECT username FROM USERS WHERE user_id = ?', [user_id]);
            isAdmin = userRows.length > 0 && userRows[0].username === 'kebcanque';
        }

        let query = `
            SELECT a.archive_id, a.archived_at, e.title, e.location, e.event_date 
            FROM ARCHIVES a
            JOIN EVENTS e ON a.event_id = e.event_id
        `;
        let params = [];

        if (!isAdmin && user_id) {
            query += ' WHERE e.user_id = ?';
            params.push(user_id);
        }

        query += ' ORDER BY a.archived_at DESC';

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove from archives (but keep event or delete?)
// Usually "see the table" just means viewing.
