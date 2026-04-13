const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
const eventRoutes = require('./routes/events');

// Use routes
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Event Planner API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
