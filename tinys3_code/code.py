import time, gc, os
import neopixel
import board, digitalio
import tinys3
import adafruit_hcsr04
from adafruit_ble import BLERadio
from adafruit_ble_beacon import iBeaconAdvertisement


# Say hello
print("\nHello from TinyS3!")
print("------------------\n")

# Show available memory
print("Memory Info - gc.mem_free()")
print("---------------------------")
print("{} Bytes\n".format(gc.mem_free()))

flash = os.statvfs('/')
flash_size = flash[0] * flash[2]
flash_free = flash[0] * flash[3]
# Show flash size
print("Flash - os.statvfs('/')")
print("---------------------------")
print("Size: {} Bytes\nFree: {} Bytes\n".format(flash_size, flash_free))

print("Pixel Time!\n")

# Create a colour wheel index int
color_index = 0

# Turn on the power to the NeoPixel
tinys3.set_pixel_power(True)

sonar = adafruit_hcsr04.HCSR04(trigger_pin=board.D5, echo_pin=board.D2)
ble = BLERadio()
advertisement = iBeaconAdvertisement()
advertisement.uuid = b"CircuitPython123"
advertisement.major = 1
advertisement.minor = 32
advertisement.beacon_tx_power = -20

is_toilet_start = 0
is_toilet = False
PAUSE_INTERVAL = 10 #seconds
ADVERTISE_INTERVAL = 10 #seconds
DISTANCE_PING_INTERVAL = 3 #seconds
DISTANCE = 30.0 #centimeters

# Rainbow colours on the NeoPixel
while True:
    try:
        dist = sonar.distance
        print(sonar.distance)
        if dist < DISTANCE:
            if not is_toilet:
                # mark toilet state
                is_toilet = True
                is_toilet_start = time.time()

                # advertise, then sleep
                print('advertising now')
                ble.start_advertising(advertisement)
                time.sleep(ADVERTISE_INTERVAL)
                ble.stop_advertising()
        else:
            # I have this if-else set up so that we don't advertise while
            # the user is still on the toilet.
            if time.time() > is_toilet_start + PAUSE_INTERVAL:
                is_toilet = False
    except RuntimeError:
        print("Retrying!")
        if time.time() > is_toilet_start + PAUSE_INTERVAL:
            is_toilet = False

    # ping distance sensor every 3 seconds
    time.sleep(DISTANCE_PING_INTERVAL)

