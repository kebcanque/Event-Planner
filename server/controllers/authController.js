const db = require('../config/db');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const [rows] = await db.execute(
            'SELECT * FROM USERS WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = rows[0];
        // In a real app, we'd use JWT here. For now, we'll just return user info.
        res.json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                username: user.username
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
