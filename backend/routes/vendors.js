const express = require('express');
const router = express.Router();
const db = require('../db');

// Register vendor
// POST /vendors
router.post('/', async (req, res) => {
    try {
        const { name, shop_name, location, auth_id, avatar_url } = req.body;

        // Input validation
        if (!name || !shop_name || !location) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newVendor = await db.query(
            'INSERT INTO vendors (name, shop_name, location, auth_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, shop_name, location, auth_id || null, avatar_url || null]
        );

        res.status(201).json(newVendor.rows[0]);
    } catch (err) {
        console.error('Error in POST /vendors:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// List vendors
// GET /vendors
router.get('/', async (req, res) => {
    try {
        const allVendors = await db.query('SELECT * FROM vendors ORDER BY created_at DESC');
        res.status(200).json(allVendors.rows);
    } catch (err) {
        console.error('Error in GET /vendors:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
