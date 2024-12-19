const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// SQLite Database Connection
const db = new sqlite3.Database('./data/sensor.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the SQLite database');
    db.run(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flow_rate REAL,
        temperature REAL,
        timestamp INTEGER
      )
    `);
  }
});

// Helper Functions
const formatTimestamp = (unixTimestamp) => {
  const timestamp = parseInt(unixTimestamp);
  return isNaN(timestamp) ? new Date().toISOString() : new Date(timestamp * 1000).toISOString();
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getMonthName = (monthNumber) => monthNames[parseInt(monthNumber, 10) - 1];

// Endpoints
app.get('/api/latest-reading', (req, res) => {
  db.get(
    `SELECT flow_rate, temperature, timestamp 
     FROM sensor_data 
     ORDER BY timestamp DESC 
     LIMIT 1`,
    (err, row) => {
      if (err) {
        res.status(500).json({ error: `Database error: ${err.message}` });
        return;
      }
      res.json({
        flow_rate: row?.flow_rate || 0,
        temperature: row?.temperature || 0,
        timestamp: formatTimestamp(row?.timestamp)
      });
    }
  );
});

app.get('/api/sensor-history/:type', (req, res) => {
  const { type } = req.params;
  const hours = 24;
  const cutoffTime = Math.floor(Date.now() / 1000) - (hours * 3600);

  const column = type.toLowerCase().includes('flow') ? 'flow_rate' : 'temperature';

  db.all(
    `SELECT ${column} as value, timestamp 
     FROM sensor_data 
     WHERE timestamp < ?
     ORDER BY timestamp ASC`,
    [cutoffTime],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: `Database error: ${err.message}` });
        return;
      }
      if (!rows.length) {
        res.json({ message: 'No data available for the specified period.' });
        return;
      }
      const data = rows.map(row => ({
        value: row.value,
        time: formatTimestamp(row.timestamp)
      }));
      res.json(data);
    }
  );
});

app.get('/api/monthly-expenses', (req, res) => {
  const PRICE_PER_UNIT = 1.5;

  db.all(
    `SELECT 
      strftime('%m', datetime(timestamp, 'unixepoch')) as month,
      AVG(flow_rate) FILTER (WHERE flow_rate IS NOT NULL) as avg_flow_rate
     FROM sensor_data 
     WHERE timestamp <= strftime('%s', 'now', '-6 months')
     GROUP BY month
     ORDER BY month ASC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: `Database error: ${err.message}` });
        return;
      }
      const data = rows.map(row => ({
        month: getMonthName(row.month),
        cost: parseFloat((row.avg_flow_rate * PRICE_PER_UNIT).toFixed(2))
      }));
      res.json(data.reverse());
    }
  );
});

// Start Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
