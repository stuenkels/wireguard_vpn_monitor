# Flask Webserver to Monitor a Wireguard VPN

Python webserver based on Flask which monitors the status of a Wireguard VPN 

This is very much a work in progress, please do not deploy this on anything, I am working on packaging this up into a nice little deb package

### Systemd Unit Configuration File 
Currently only supports ```wg0``` interface, working on adding dyanmic support.

Make sure vpn_monitor user or whatever user runs the service has correct permissions, also make sure /venv has execute permissions.
```
[Unit]
Description=VPN Monitoring Webpage
After=network.target wg-quick@wg0.service
Requires=wg-quick@wg0.service

[Service]
User=vpn_monitor
Group=vpn_monitor
WorkingDirectory=/opt/vpn_monitor
Environment="PATH=/opt/vpn_monitor/venv/bin:/usr/sbin:/usr/bin:/bin"
ExecStart=/opt/vpn_monitor/venv/bin/gunicorn --workers 3 --bind unix:/opt/vpn_monitor/vpn_monitor.sock app:app

[Install]
WantedBy=multi-user.target
```


