import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const PieChart = ({ data ,name,color}) => {
    // console.log(data) 
    const len = Object.entries(data.tags).length
    const chartData = {
        labels: Object.keys(data.tags),
        datasets: [
            {
                data: Object.values(data.tags),
                backgroundColor: len <= 5 ?
                    [
                        '#A45DB3',
                        '#FF867C',
                        'lightgreen',
                    ]
                : [
                    '#A45DB3',
                    '#FF867C',
                    '#FF77A9',
                    '#8E99F3',
                    'lightgreen',
                    '#135e96',
                    '#E75154',
                    'cyan',
                    '#F3DB9A',
                    'grey',
                    '#3C4372',
                    '#0C2D37',
                    '#E1ECF6',
                    '#F3DB9A',
                    '#E56864',
                    '#F7F7F0',
                    '#6EAEE4'
                    // Add more colors for additional data
                ],
                borderColor: 'transparent'

            },
        ],
    };
    const chartOptions = {
        plugins: {
            legend: {
                display: false, // Set to false to hide the legend
            },
        },
    };

    const legendItems = Object.entries(data.tags).map(([key, value], index) => (
        <div key={key} className="flex items-center mb-2">
            <div className={`w-4 h-4 rounded-full bg-[${chartData.datasets[0].backgroundColor[index]}] mr-2`}></div>
            <div>{key}</div>
            <div className="font-bold ml-2">{value}</div>
        </div>
    ));

    return (
        <div className={`grid grid-cols-2 justify-evenly  m-2 p-4 gap-16 border-blue-400 bg-[${color}]`}>
            <Doughnut data={chartData} options={chartOptions} />
            <div className={`${'overflow-y-scroll'} ml-4`}>
                {legendItems}
            </div>
        </div>
    );
};

export default PieChart;
