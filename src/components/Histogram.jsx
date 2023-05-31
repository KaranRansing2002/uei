import React, { useEffect, useState, useRef } from 'react';

const Histogram = (props) => {
    const chartRef = useRef(null);
    console.log(props.data)
    const [data, setData] = useState(props.data);

    useEffect(() => {
        // Create the histogram chart
        if (chartRef.current && data.length > 0) {
            // Extract class labels and aggregate values
            const labels = data.map((item) => item.Class);
            const aggregates = data.map((item) => parseFloat(item.aggregate.split(' ')[0]));

            // Configure the chart
            const ctx = chartRef.current.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Aggregate',
                            data: aggregates,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: 'white',
                            },
                            grid: {
                                color: 'white',
                            },
                        },
                    },
                },
            });
        }
    }, [data]);

    return <canvas ref={chartRef} style={{ height: '400px' }}/>;
};
export default Histogram;