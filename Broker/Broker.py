import sqlite3
import json
import paho.mqtt.client as mqtt

# MQTT Configuration
BROKER = "127.0.0.1"  # Change to your broker's address
TOPIC = "smart_water_system/data"

# SQLite Database Configuration
DATABASE = "./aqua-energy-visualizer/data/sensor.db"

# Create Database Connection
def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flow_rate REAL,
            temperature REAL,
            timestamp INTEGER
        )
    ''')
    conn.commit()
    conn.close()

# Save MQTT Data to Database
def save_to_db(flow_rate, temperature, timestamp):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO sensor_data (flow_rate, temperature, timestamp)
        VALUES (?, ?, ?)
    ''', (flow_rate, temperature, timestamp))
    conn.commit()
    conn.close()
    print("Data saved to database:", flow_rate, temperature, timestamp)

# MQTT Callback Functions
def on_connect(client, userdata, flags, rc):
    print("Connected to broker with result code", rc)
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode('utf-8'))
        flow_rate = data['flow_rate']
        temperature = data['temperature']
        timestamp = data['timestamp']
        save_to_db(flow_rate, temperature, timestamp)
    except Exception as e:
        print("Error processing message:", e)

# Main MQTT Client
def main():
    init_db()
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, 6000)
    client.loop_forever()

if __name__ == "__main__":
    main()
