const pg = require('pg');

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'comicbookstore',
  password: 'root',
  port: 5432, // Default PostgreSQL port
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Current time:', res.rows[0].now);
  }
  pool.end(); // Optional: Close the pool when done
});

