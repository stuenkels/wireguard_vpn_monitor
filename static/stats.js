function fetchStats() {
    fetch('/stats')
        .then(response => response.json())
        .then(data => {
            //settup vars
            let cpu_percent;
            let mem_percent;
            let wg_interface;
            let rx_bytes;
            let tx_bytes;

            //Is response valid? 
            const webserver_status = data.webserver_status;
            if(webserver_status == "true"){
                // Assign data to local variables
                cpu_percent = data.cpu_percent;
                mem_percent = data.mem_percent;
                wg_interface = data.wg_interface;
                rx_bytes = data.rx_bytes;
                tx_bytes = data.tx_bytes;
                //update charts with new info
                updateChart(cpuChart, cpu_percent, 20);
                updateChart(memChart, mem_percent, 50);
                updateNetworkChart(networkChart, tx_bytes, rx_bytes)
                document.getElementById('status').textContent = "";
                document.getElementById('status_message').textContent = ""

            }
            else if(webserver_status == "false"){
                document.getElementById('status').textContent = "Server Fault";
                document.getElementById('status_message').textContent = "server failed to provide data"
                cpu_percent = "0";
                mem_percent = "0";
                wg_interface = "null";
                rx_bytes = "0";
                tx_bytes = "0";
            }

                        
        })
        .catch(error => console.error('Error fetching stats:', error));
}

function createChart(id, title){
    const ctx = document.getElementById(id);
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(30).fill(''), // timestamps or sample count
            datasets: [{
                label: title,
                data: Array(30).fill(null),  // Fill with nulls for now
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(200, 200, 200, 0.3)',
                tension: 0.1,
                pointRadius: 2,
            }]
        },
        options: {
            responsive: true,
            animation: false,
            scales: {
                y: {
                    min: 0,
                    // max: 100,
                    ticks: {
                      stepSize: 10
                    }
                },
                x: {
                    display: true,
                    title: {
                      display: false,
                      text: 'Time'
                    }
                }
            }
        }
    });
}

function updateChart(chart, data, alertThreashold){
    const date = new Date();
    const time = date.toLocaleTimeString();
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(data);

    //remove old data points
    if (chart.data.labels.length > maxDataPoints) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
    }
    //alert color
    if(data>alertThreashold){
        chart.data.datasets[0].borderColor = 'rgb(220, 53, 69)';
        chart.data.datasets[0].backgroundColor = 'rgba(220, 53, 69, 0.3)';

    }else{
        chart.data.datasets[0].borderColor = 'rgb(75, 192, 192)';
        chart.data.datasets[0].backgroundColor = 'rgba(200, 200, 200, 0.3)';

    }
    
    chart.update();
}

function updateNetworkChart(chart, data1, data2){
    const date = new Date();
    const time = date.toLocaleTimeString();

    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(data1/1000); //return kilobytes of throughput
    chart.data.datasets[1].data.push(data2/1000); 
    //remove old data points
    if (chart.data.labels.length > maxDataPoints) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
    }
    //alert color
    // if(data>alertThreashold){
    //     chart.data.datasets[0].borderColor = 'rgb(220, 53, 69)';
    //     chart.data.datasets[0].backgroundColor = 'rgba(220, 53, 69, 0.3)';

    // }else{
    //     chart.data.datasets[0].borderColor = 'rgb(75, 192, 192)';
    //     chart.data.datasets[0].backgroundColor = 'rgba(200, 200, 200, 0.3)';

    // }

    //update y scale
   

    
    //publish changes
    chart.update();
}

function createNetworkChart(id, title1, title2){
    const ctx = document.getElementById(id);
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(30).fill(''), // timestamps or sample count
            datasets: [{
                label: title1,
                data: Array(30).fill(null),  // Fill with nulls for now
                fill: true,
                borderColor: 'rgb(18, 65, 112)',
                backgroundColor: 'rgba(38, 102, 127,0.3)',
                tension: 0.1,
                pointRadius: 2,
            }, {
                label:title2,
                data: Array(30).fill(null),  // Fill with nulls for now
                fill: true,
                borderColor: 'rgb(103, 192, 144)',
                backgroundColor: 'rgba(221, 244, 231,0.3)',
                tension: 0.1,
                pointRadius: 2, 
            }]
        },
        options: {
            responsive: true,
            animation: false,
            scales: {
                y: {
                    min: 0,
                    ticks: {
                      stepSize: 10
                    }
                },
                x: {
                    display: true,
                    title: {
                      display: false,
                      text: 'Time'
                    }
                }
            }
        }
    });
}



let cpuChart;
let memChart;
let networkChart;
const maxDataPoints = 30; 


window.onload = () => {
    cpuChart = createChart('cpu_chart', 'CPU Usage (%)');
    memChart = createChart('mem_chart', 'Memory Usage (%)');
    networkChart = createNetworkChart('net_chart', 'VPN TX', 'VPN RX');
    fetchStats(); // get initial data
    setInterval(fetchStats, 1000); // update every second
};


