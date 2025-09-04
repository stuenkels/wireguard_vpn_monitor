import psutil 
import subprocess
from flask import Flask, render_template, jsonify
import configparser
from monitor import NetMonitor

monitor = NetMonitor(interface='wg0')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/stats')
def stats():
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        mem_percent = psutil.virtual_memory().percent
        wg_interface = subprocess.check_output(["wg", "show", "interfaces"]).decode().strip()

        rx_bytes, tx_bytes = monitor.get_throughput()
        
        success = 'true'

    except:
        success = 'false'
        cpu_percent = 0
        mem_percent = 0
        wg_interface = 0
        rx_bytes = 0
        tx_bytes = 0

    
    return jsonify({
        "webserver_status": success,
        "cpu_percent": cpu_percent,
        "mem_percent": mem_percent,
        "wg_interface": wg_interface,
        "rx_bytes": rx_bytes,
        "tx_bytes": tx_bytes,
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')