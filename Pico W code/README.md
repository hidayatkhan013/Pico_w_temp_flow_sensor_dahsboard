# IoT Water Monitoring System Documentation

This project implements an IoT-based smart water monitoring system using a Raspberry Pi Pico W, BMP280 sensor, flow sensor, and MQTT communication.

---

## Table of Contents
1. [Hardware Requirements](#hardware-requirements)
2. [Software Requirements](#software-requirements)
3. [Installation](#installation)
4. [Code Overview](#code-overview)
   - [WiFi Configuration](#wifi-configuration)
   - [MQTT Configuration](#mqtt-configuration)
   - [Sensor Configuration](#sensor-configuration)
   - [Helper Functions](#helper-functions)
   - [Main Loop](#main-loop)
5. [Usage](#usage)

---

## Hardware Requirements
- Raspberry Pi Pico W
- BMP280 sensor (for temperature readings)
- YF-S201 Flow Sensor
- Breadboard and connecting wires
- WiFi connection

---

## Software Requirements
- MicroPython firmware
- MQTT broker (e.g., Mosquitto)
- Python library for BMP280 sensor

---

## Installation

### 1. Flash MicroPython onto the Pico W
- Follow [MicroPython documentation](https://micropython.org/download/rp2-pico/) to flash the firmware.

### 2. Install MQTT Broker
- Set up an MQTT broker on your local machine or use a cloud-based broker.

### 3. Deploy the Script
- Copy the `main.py` script to the Pico W using tools like Thonny IDE or rshell.

---

## Code Overview

### WiFi Configuration
Connects the Pico W to a specified WiFi network.

```python
WIFI_SSID = 'YourSSID'
WIFI_PASSWORD = 'YourPassword'
```

### MQTT Configuration
Sets up the connection to the MQTT broker.

```python
BROKER = '192.168.1.10'  # Replace with your broker's IP
TOPIC = 'smart_water_system/data'
```

### Sensor Configuration
- **BMP280**: Reads temperature data.
- **Flow Sensor**: Measures flow rate in liters per minute (L/min).

#### BMP280 Setup
```python
i2c = I2C(0, scl=Pin(1), sda=Pin(0))
bmp280 = BMP280(i2c)
```

#### Flow Sensor Setup
```python
FLOW_SENSOR_PIN = 21  # GPIO pin for the flow sensor
flow_sensor = Pin(FLOW_SENSOR_PIN, Pin.IN, Pin.PULL_UP)
flow_sensor.irq(trigger=Pin.IRQ_RISING, handler=callback)
```

### Helper Functions

#### `connect_wifi()`
Connects the Pico W to WiFi and prints the IP configuration.

#### `read_temperature()`
Reads and returns temperature data from the BMP280 sensor in Celsius.

#### `read_flow_sensor()`
Calculates and returns the flow rate from the flow sensor in L/min.

#### `publish_data()`
Publishes the temperature and flow rate data to the MQTT broker.

### Main Loop
The `main()` function continuously:
1. Connects to WiFi.
2. Reads flow rate and temperature data.
3. Publishes the data to the MQTT broker.
4. Toggles the LED as a visual indicator.

---

## Usage
1. Power up the Raspberry Pi Pico W.
2. Ensure the MQTT broker is running and accessible.
3. Monitor the MQTT topic (`smart_water_system/data`) for incoming data:
   ```bash
   mosquitto_sub -h 192.168.1.10 -t "smart_water_system/data" -v
   ```
4. The output will include JSON data similar to:
   ```json
   {
     "flow_rate": 2.5,
     "temperature": 24.8,
     "timestamp": 1671234567
   }
   ```

---

