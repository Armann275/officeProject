const pkg = require('pg')

const { Client } = pkg;

const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'poker123',
    database: 'postgres',
  });
async function connectDB() {
  

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // Test query
    const res = await client.query('SELECT NOW() AS current_time;');
    console.log('🕒 Server time:', res.rows[0].current_time);

  } catch (err) {
    console.error('❌ Connection error:', err.message);
  } 
}

// connectDB();
module.exports = {connectDB,client}