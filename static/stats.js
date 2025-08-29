function fetchStats() {
    fetch('/stats')
        .then(response => response.json())
        .then(data => {
            // Assign data to local variables
            const cpu_percent = data.cpu_percent;
            const mem_percent = data.mem_percent;
            const wg_interface = data.wg_interface;
            const rx_bytes = data.rx_bytes;
            const tx_bytes = data.tx_bytes;
            const message = data.message;

            //update cpu chart with new info
            updateChart(cpuChart, cpu_percent, 10);

            // Update the DOM
            document.getElementById('mem').textContent = mem_percent + '%';
            document.getElementById('iface').textContent = wg_interface;
            document.getElementById('rx').textContent = rx_bytes;
            document.getElementById('tx').textContent = tx_bytes;
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
                    max: 100,
                    ticks: {
                      stepSize: 10
                    }
                },
                x: {
                    display: true,
                    title: {
                      display: true,
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

    //update y scale
    let max = 0;
    for(const value of chart.data.datasets[0].data){
        if(value>max){
            max = value;
        }
    }
    
    let chart_max = Math.ceil(max*1.5 / 5) * 5;
    if (chart_max >= 100){
        chart_max = 100;   
    }

    chart.options.scales.y = {
        max: chart_max,
    }

    //publish changes
    chart.update();
}

let cpuChart;
const maxDataPoints = 30; 

window.onload = () => {
    cpuChart = createChart('cpu_chart', 'CPU Usage (%)');
    fetchStats(); // get initial data
    setInterval(fetchStats, 1000); // update every second
};


