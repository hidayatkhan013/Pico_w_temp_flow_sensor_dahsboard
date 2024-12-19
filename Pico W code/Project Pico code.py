import time
import random
from machine import Pin, I2C
import network
import ujson
from umqtt.simple import MQTTClient
from bmp280 import BMP280  # BMP280 library

# WiFi Configuration
WIFI_SSID = 'Hidayat ur Rehman'
WIFI_PASSWORD = 'WIFIPASS'

# MQTT Configuration
BROKER = '192.168.244.11'  # Replace with your PC's IP running the MQTT broker
TOPIC = 'smart_water_system/data'

# GPIO and I2C Setup for BMP280
i2c = I2C(0, scl=Pin(1), sda=Pin(0))  # Update pins as per your wiring
bmp280 = BMP280(i2c)

led = Pin("LED", Pin.OUT)

# Flow Sensor Pin
FLOW_SENSOR_PIN = 15

# GPIO Setup
try:
    flow_sensor = Pin(FLOW_SENSOR_PIN, Pin.IN)
    flow_sensor_present = True
except Exception as e:
    print("Flow sensor not detected:", e)
    flow_sensor_present = False

# Connect to WiFi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    print("Connecting to WiFi...", end="")
    while not wlan.isconnected():
        time.sleep(0.5)
        print(".", end="")
    print("\nConnected to WiFi:", wlan.ifconfig())


# Determine the flow rate based on availability of sensor
def get_flow_rate():
    if flow_sensor_present:
        return read_flow_sensor()


# Pin configuration for the flow sensor
FLOW_SENSOR_PIN = 21  # GPIO pin connected to the sensor's signal pin

# Global variables
flow_frequency = 0
flow_rate = 0
last_call_time = 0

# Interrupt handler
def callback(pin):
    global flow_frequency
    flow_frequency += 1

# Setup flow sensor pin and interrupt
flow_sensor = Pin(FLOW_SENSOR_PIN, Pin.IN, Pin.PULL_UP)
flow_sensor.irq(trigger=Pin.IRQ_RISING, handler=callback)

# Function to calculate flow rate
def read_flow_sensor():
    """
    Reads the YF-S201 flow sensor and calculates the flow rate in liters per hour (L/h).
    Returns the flow rate in liters per minute (L/min) for better granularity.
    """
    global flow_frequency, flow_rate, last_call_time

    # Check if 1 second has passed
    if (time.ticks_ms() - last_call_time) > 1000:
        # Calculate flow rate in liters per hour
        flow_rate = (flow_frequency * 60 / 7.5)  # Adjust 7.5 if necessary for calibration
        flow_frequency = 0  # Reset the counter
        last_call_time = time.ticks_ms()
        flow_rate_lpm = flow_rate / 60  # Convert to liters per minute
        #print("Flow Rate: {:.2f} L/min".format(flow_rate_lpm))
        return round(flow_rate_lpm, 2)
    return None  # If 1 second has not passed, return None



# Read temperature from BMP280
def read_temperature():
    try:
        temperature = bmp280.temperature
        return round(temperature, 2)  # Temperature in Celsius
    except Exception as e:
        print("Error reading BMP280:", e)
        return None

def publish_data(flow_rate, temperature):
    client = MQTTClient(f"pico_w_{int(time.time())}", BROKER, port=6000)
    try:
        client.connect()
        data = {
            "flow_rate": flow_rate,
            "temperature": temperature,
            "timestamp": time.time()
        }
        client.publish(TOPIC, ujson.dumps(data))
        print("Published:", data)
    except Exception as e:
        print("Error connecting to MQTT broker:", e)
    finally:
        client.disconnect()


# Main Loop
def main():
    connect_wifi()
    while True:
        # Get flow sensor data (real or simulated)
        flow_rate = get_flow_rate()
        # Read temperature from BMP280
        temperature = read_temperature()
        if temperature is not None:  # Only publish valid temperature data
            # Publish to MQTT
            publish_data(flow_rate, temperature)
            led.toggle()
        # Delay
        time.sleep(3)

if __name__ == "__main__":
    main()

