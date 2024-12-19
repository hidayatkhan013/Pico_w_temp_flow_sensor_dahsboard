# Server.js API Documentation

This project provides an Express.js server implementation for managing and retrieving sensor data from a SQLite database. Below is the detailed documentation for setting up and using the server.

---

## Table of Contents
1. [Installation](#installation)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
   - [GET /api/latest-reading](#get-apilatest-reading)
   - [GET /api/sensor-history/:type](#get-apisensor-historytype)
   - [GET /api/monthly-expenses](#get-apimonthly-expenses)
4. [Helper Functions](#helper-functions)

---

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/hidayatkhan013/Pico_w_temp_flow_sensor_dahsboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Pico_w_temp_flow_sensor_dahsboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.cjs
   ```
5. The server will run on `http://localhost:3001`.

---

## Database Schema
The SQLite database includes a single table, `sensor_data`:

```sql
CREATE TABLE IF NOT EXISTS sensor_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flow_rate REAL,
  temperature REAL,
  timestamp INTEGER
);
```

### Fields
- `id`: Auto-incrementing unique identifier for each record.
- `flow_rate`: The flow rate reading (in liters per minute).
- `temperature`: The temperature reading (in Celsius).
- `timestamp`: The UNIX timestamp for when the data was recorded.

---

## API Endpoints

### GET /api/latest-reading
Fetches the most recent sensor reading.

#### Response
```json
{
  "flow_rate": 10.5,
  "temperature": 25.3,
  "timestamp": "2024-12-18T10:41:05.000Z"
}
```

#### Error Handling
Returns a `500` status with an error message if the query fails.

---

### GET /api/sensor-history/:type
Fetches sensor readings for the last 24 hours, filtered by `type`.

#### Parameters
- `type`: Either `flow` or `temperature`.

#### Response
```json
[
  {
    "value": 10.5,
    "time": "2024-12-18T10:00:00.000Z"
  },
  {
    "value": 12.3,
    "time": "2024-12-18T11:00:00.000Z"
  }
]
```

#### Error Handling
- Returns a `500` status with an error message if the query fails.
- Returns an empty array if no data is found.

---

### GET /api/monthly-expenses
Calculates and returns the average flow rate and corresponding costs for the past 6 months.

#### Response
```json
[
  {
    "month": "Jun",
    "cost": 15.75
  },
  {
    "month": "Jul",
    "cost": 12.30
  }
]
```

#### Error Handling
- Returns a `500` status with an error message if the query fails.
- Returns an empty array if no data is found.

---

## Helper Functions

### formatTimestamp
Converts a UNIX timestamp to an ISO string.

```javascript
const formatTimestamp = (unixTimestamp) => {
  const timestamp = parseInt(unixTimestamp);
  return isNaN(timestamp) ? new Date().toISOString() : new Date(timestamp * 1000).toISOString();
};
```

### getMonthName
Maps a numeric month to its abbreviated name.

```javascript
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getMonthName = (monthNumber) => monthNames[parseInt(monthNumber, 10) - 1];
```

---