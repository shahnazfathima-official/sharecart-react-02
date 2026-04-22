const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Route imports
const productsRouter = require('./routes/products');
const vendorsRouter = require('./routes/vendors');
const requestsRouter = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Main Routes
app.use('/products', productsRouter);
app.use('/vendors', vendorsRouter);
app.use('/', requestsRouter); // Maps /surplus and /request-product

// Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: 'ShareCart Backend API is running successfully!' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
