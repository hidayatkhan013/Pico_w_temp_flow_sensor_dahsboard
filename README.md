# Smart Water Monitoring System

A comprehensive IoT solution for monitoring water flow and temperature using Raspberry Pi Pico W, with real-time data visualization and analysis.

### Default credentails ``` admin admin ```

## System Architecture

![System Architecture]("./images/achi.png")

## System Flow

![System Flow]("./images/flow.png")

## System Sequence Diagram

![System Sequence]("./images/seq.png")

This system consists of several key components:
- **Hardware Layer**: Pico W microcontroller with BMP280 temperature sensor and YF-S201 flow sensor
- **Data Collection**: MQTT broker for real-time data transmission
- **Backend**: SQLite database and Express.js API server
- **Frontend**: Web-based dashboard for real-time monitoring

## Features

- Real-time water flow monitoring
- Temperature tracking
- Historical data analysis
- Monthly cost calculations
- RESTful API endpoints
- Web-based dashboard

## Hardware Requirements

- Raspberry Pi Pico W
- BMP280 Temperature Sensor
- YF-S201 Water Flow Sensor
- Basic wiring components

## Software Prerequisites

1. Install [Node.js](https://nodejs.org/) (v14 or higher)
2. Install [Python 3.7+](https://www.python.org/downloads/)
3. Install [MQTT Broker (Mosquitto)](https://mosquitto.org/download/)
4. Download [SQLite](https://www.sqlite.org/download.html)
5. Download [Thonny IDE](https://thonny.org/) for Pico W programming

## Installation

### 1. Hardware Setup

Connect the sensors to Pico W:
```
BMP280:
- SDA -> GPIO 0
- SCL -> GPIO 1
- VCC -> 3.3V
- GND -> GND

Flow Sensor:
- Signal -> GPIO 15
- VCC -> 5V
- GND -> GND
```

### 2. Pico W Setup

1. Connect Pico W to your computer and open Thonny IDE
2. Install MicroPython:
   - Hold BOOTSEL button while connecting Pico W
   - Download MicroPython UF2 file from [official website](https://micropython.org/download/rp2-pico-w/)
   - Drag and drop the UF2 file to the RPI-RP2 drive

3. Copy the following files to Pico W using Thonny:
   ```
   pico_code/
   ├── main.py
   ├── bmp280.py
   ```
4. Update Wi-Fi credentials

### 3. MQTT Broker Setup (Windows)

1. Install Mosquitto from the [official website](https://mosquitto.org/download/)
2. Add Mosquitto to System Path:
   - Right-click on 'This PC' > Properties > Advanced system settings
   - Environment Variables > System Variables > Path
   - Add `C:\Program Files\Mosquitto`

3. Configure Mosquitto:
   - Open `C:\Program Files\Mosquitto\mosquitto.conf`
   - Add these lines:
     ```
     listener 6000
     allow_anonymous true
     ```

4. Start Mosquitto Service:
   - Open Command Prompt as Administrator
   ```cmd
   net start mosquitto
   ```
5. Start Mosquitto Suscriber:
   - Open Command Prompt
   ```cmd
   Python Broker.py
   ```

### 4. Backend Setup

1. Clone the repository using Git Bash or download ZIP:
   ```bash
   git https://github.com/hidayatkhan013/Pico_w_temp_flow_sensor_dahsboard.git
   cd Pico_w_temp_flow_sensor_dahsboard
   ```

2. Run Backend Express API:
   ```cmd
   cd Backend
   node Server.cjs
   ```
   Server will run on http://localhost:3001

### 5. Frontend Setup

1. Install dependencies:
   ```cmd
   cd frontend
   npm install or npm i
   ```

2. Start the development server:
   ```cmd
   npm run dev
   ```
   Frontend will run on http://localhost:8080

## API Endpoints

### GET /api/latest-reading
Returns the most recent sensor reading

### GET /api/sensor-history/:type
Returns historical data for specified sensor type (flow or temperature)

### GET /api/monthly-expenses
Returns monthly water usage costs

## Database Schema

```sql
CREATE TABLE sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flow_rate REAL,
    temperature REAL,
    timestamp INTEGER
);
```

## Troubleshooting

### Common Issues:

1. **MQTT Connection Issues**:
   - Ensure Mosquitto service is running
   - Check if port 6000 is not blocked by firewall
   - Verify mosquitto.conf settings

2. **Pico W Connection**:
   - Verify COM port in Device Manager
   - Check Wi-Fi credentials in config.py
   - Ensure proper power supply

3. **Database Issues**:
   - Check if database path exists
   - Verify write permissions in the data directory

4. **Node.js Issues**:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and run `npm install` again

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- BMP280 library for MicroPython
- Express.js community
- MQTT community