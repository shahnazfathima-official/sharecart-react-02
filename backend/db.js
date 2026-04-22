const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase connections
  }
});

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Successfully connected to the PostgreSQL database.');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
