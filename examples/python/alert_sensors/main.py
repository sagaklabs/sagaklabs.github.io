import serial.tools.list_ports
import threading
from pynput import keyboard
import threading
import serial
import clr
from pyuac import main_requires_admin

openhardwaremonitor_hwtypes = ['Mainboard','SuperIO','CPU','RAM','GpuNvidia','GpuAti','TBalancer','Heatmaster','HDD']
openhardwaremonitor_sensortypes = ['Voltage','Clock','Temperature','Load','Fan','Flow','Control','Level','Factor','Power','Data','SmallData']
sensor_results = {}



def initialize_openhardwaremonitor():
    file = 'OpenHardwareMonitorLib'
    clr.AddReference(file)

    from OpenHardwareMonitor import Hardware

    handle = Hardware.Computer()
    handle.MainboardEnabled = True
    handle.CPUEnabled = True
    handle.RAMEnabled = True
    handle.GPUEnabled = True
    handle.HDDEnabled = True
    handle.Open()
    return handle



def fetch_stats(handle):
    for i in handle.Hardware:
        i.Update()
        for sensor in i.Sensors:
            parse_sensor(sensor)
        for j in i.SubHardware:
            j.Update()
            for subsensor in j.Sensors:
                parse_sensor(subsensor)


def parse_sensor(sensor):
        if sensor.Value is not None:
            if type(sensor).__module__ == 'OpenHardwareMonitor.Hardware':
                sensortypes = openhardwaremonitor_sensortypes
                hardwaretypes = openhardwaremonitor_hwtypes
            else:
                return

            if sensor.SensorType.value__ == sensortypes.index('Temperature'):
                print(u"%s %s Temperature Sensor #%i %s - %s\u00B0C" % (hardwaretypes[sensor.Hardware.HardwareType], sensor.Hardware.Name, sensor.Index, sensor.Name, sensor.Value))
                sensor_results[sensor.Name] = str(sensor.Value)
                print(sensor.Name)



class SerialReaderThread(threading.Thread):
    def run(self):
        ser = serial.Serial('COM3', baudrate = 115200, timeout = 20)
        while True:
            print("I am reading line from serial port:")
            result = ser.readline().decode('utf-8')
            print("printing from serial thread\n" + result )
            if "execute" in result:
                gpu_message =  ''
                cpu_message =  ''
                if sensor_results['GPU Core']:
                    gpu_message =  'gpu:'+sensor_results['GPU Core']
                if sensor_results['CPU Package']:
                    cpu_message =  '\n\rcpu:'+sensor_results['CPU Package']
                t = 'alert ' + gpu_message + cpu_message +'\n\r'
                ser.write(t.encode())

class KeyboardThread(threading.Thread):
    def run(self):
        def on_press(key):
            try:
                print('alphanumeric key {0} pressed'.format(key.char))

                # quit when q is pressed
                if key.char == "q":
                    exit()
            except AttributeError:
                print('special key {0} pressed'.format(key))

        def on_release(key):
            print('{0} released'.format(
                key))
            if key == keyboard.Key.esc:
                return False


        with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
            listener.join()

        listener = keyboard.Listener(on_press=on_press, on_release=on_release)
        listener.start()



@main_requires_admin
def main():
    print("OpenHardwareMonitor:")
    HardwareHandle = initialize_openhardwaremonitor()
    fetch_stats(HardwareHandle)
    ports = serial.tools.list_ports.comports()
    for port, desc, hwid in sorted(ports):
            print("{}: {} [{}]".format(port, desc, hwid))

    serial_thread = SerialReaderThread()
    keyboard_thread = KeyboardThread()

    serial_thread.start()
    keyboard_thread.start()
    serial_thread.join()
    keyboard_thread.join()

if __name__ == "__main__":
    main()