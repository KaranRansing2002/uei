import React, { useEffect, useState, useRef } from 'react';

const Histogram = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('https://ueib.onrender.com/institute/7457112');
        const json = await response.json();
        const schoolDetails = json.resp.instituteinfos;

        // Convert SGPA to percentage
        const convertedData = schoolDetails.map((school) => {
          const aggregate = school.aggregate;
          const isSGPA = aggregate.includes('sgpa');

          if (isSGPA) {
            const sgpaValue = parseFloat(aggregate.split(' ')[0]);
            const percentage = sgpaValue * 9.5;
            return {
              Class: school.Class,
              aggregate: `${percentage} percentage`,
            };
          } else {
            return {
              Class: school.Class,
              aggregate,
            };
          }
        });
        setData(convertedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};