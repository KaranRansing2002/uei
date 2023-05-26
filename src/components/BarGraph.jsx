import React from 'react';
import { Bar } from 'react-chartjs-2';

function BarGraph({ ratingsData }) {
  const data = {
    labels: Object.keys(ratingsData),
    datasets: [
      {
        label: 'Ratings',
        data: Object.values(ratingsData),
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Change the color here
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return (
    // <div className='h-full border w-full flex'>
      <Bar data={data} options={options} />
    // </div>
  );
}
 
export default BarGraph;
