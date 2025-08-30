import psutil
import time


class NetMonitor:
    def __init__(self, interface='wg0'):
        self.interface = interface
        self.prev_counters = psutil.net_io_counters(pernic=True)[interface]
        self.prev_time = time.monotonic()
    
    def get_throughput(self):
        current_counters = psutil.net_io_counters(pernic=True)[self.interface]
        current_time = time.monotonic()
        time_diff = current_time - self.prev_time
        if time_diff == 0:
            return 0.0, 0.0

        rx = (current_counters.bytes_recv - self.prev_counters.bytes_recv) / time_diff
        tx = (current_counters.bytes_sent - self.prev_counters.bytes_sent) / time_diff

        self.prev_counters = current_counters
        self.prev_time = current_time

        return rx, tx  # bytes/sec