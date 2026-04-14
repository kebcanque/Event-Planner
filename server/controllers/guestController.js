const db = require('../config/db');

// Get all guests for an event
exports.getGuestsByEvent = async (req, res) => {
    try {
        const { event_id } = req.params;
        const [rows] = await db.execute('SELECT * FROM GUESTS WHERE event_id = ?', [event_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a guest
exports.addGuest = async (req, res) => {
    try {
        const { event_id, name, emails, rsvp_status } = req.body;
        const [result] = await db.execute(
            'INSERT INTO GUESTS (event_id, name, emails, rsvp_status) VALUES (?, ?, ?, ?)',
            [event_id, name, emails, rsvp_status || 'Tentative']
        );
        res.status(201).json({ id: result.insertId, message: 'Guest added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a guest
exports.updateGuest = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, emails, rsvp_status } = req.body;
        await db.execute(
            'UPDATE GUESTS SET name = ?, emails = ?, rsvp_status = ? WHERE guest_id = ?',
            [name, emails, rsvp_status, id]
        );
        res.json({ message: 'Guest updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a guest
exports.deleteGuest = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM GUESTS WHERE guest_id = ?', [id]);
        res.json({ message: 'Guest removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
