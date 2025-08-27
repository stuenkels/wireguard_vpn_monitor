import psutil 
import subprocess
from flask import Flask, render_template
import json

app = Flask(__name__)

@app.route('/')
def index():
    cpu_percent = psutil.cpu_percent(interval=1)
    mem_percent = psutil.virtual_memory().percent
    wg_interface = subprocess.check_output(["wg", "show", "interfaces"]).decode().strip()
    net_io = psutil.net_io_counters()

    
    interface_output = subprocess.check_output(["ip", "-s", "-j", "link", "show", wg_interface])
    interface_output_json = json.loads(interface_output)
    rx_bytes = interface_output_json[0]["stats64"]["rx"]["bytes"]
    tx_bytes = interface_output_json[0]["stats64"]["tx"]["bytes"]

    message = None
    if cpu_percent > 80:
        message = "High CPU Usage"
    elif mem_percent > 80:
        message = "High Memory Usage"    
    return render_template("index.html",
        cpu_percent=cpu_percent,
        mem_percent=mem_percent,
        wg_interface=wg_interface,
        rx_bytes = rx_bytes,
        tx_bytes = tx_bytes,
        message=message
    )

if __name__ == '__main__':
    app.run(debug=False, host='10.0.0.1')