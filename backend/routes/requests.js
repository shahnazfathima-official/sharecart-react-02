const express = require('express');
const router = express.Router();
const db = require('../db');

// Get only surplus items (with optional near expiry filtering)
// GET /surplus?near_expiry=true
router.get('/surplus', async (req, res) => {
    try {
        const { near_expiry } = req.query;
        let query = `
            SELECT p.*, v.name as vendor_name, v.shop_name, v.location 
            FROM products p
            LEFT JOIN vendors v ON p.vendor_id = v.id
            WHERE p.is_surplus = true
        `;
        let queryParams = [];

        // Bonus: near expiry filter (e.g., expiring within next 7 days)
        if (near_expiry === 'true') {
            query += ` AND p.expiry_date <= CURRENT_DATE + INTERVAL '7 days' AND p.expiry_date >= CURRENT_DATE`;
        }

        query += ` ORDER BY p.expiry_date ASC`;

        const surplusProducts = await db.query(query, queryParams);
        res.status(200).json(surplusProducts.rows);
    } catch (err) {
        console.error('Error in GET /surplus:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Request surplus item
// POST /request-product
router.post('/request-product', async (req, res) => {
    try {
        const { product_id, requester_vendor_id } = req.body;

        // Input validation
        if (!product_id || !requester_vendor_id) {
            return res.status(400).json({ error: "Missing required fields: product_id, requester_vendor_id" });
        }

        // Verify product exists and is surplus
        const productCheck = await db.query('SELECT * FROM products WHERE id = $1 AND is_surplus = true', [product_id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: "Product not found or not marked as surplus" });
        }

        // Ensure requester is not the vendor who owns the product
        if (productCheck.rows[0].vendor_id === requester_vendor_id) {
            return res.status(400).json({ error: "You cannot request your own product" });
        }

        // Insert new request
        const newRequest = await db.query(
            'INSERT INTO requests (product_id, requester_vendor_id) VALUES ($1, $2) RETURNING *',
            [product_id, requester_vendor_id]
        );

        res.status(201).json(newRequest.rows[0]);
    } catch (err) {
        console.error('Error in POST /request-product:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
