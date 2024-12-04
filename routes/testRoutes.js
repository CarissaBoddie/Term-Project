const express = require('express');
const router = express.Router();
const db = require('../Database/db');

router.get('/dbtest', (req, res) => {
    try {
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to the database.' });
    }
});

module.exports = router;
