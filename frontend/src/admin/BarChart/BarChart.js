import React, { useEffect, useState } from 'react';
import './BarChart.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import apiRequest from '../../config/apiRequest';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchItemsByLocation = async () => {
      try {
        const res = await apiRequest.get('/api/items/');
        const items = res.data.items;

        const locationCounts = items.reduce((acc, item) => {
          const loc = item.location;
          acc[loc] = (acc[loc] || 0) + 1;
          return acc;
        }, {});

        const locations = Object.keys(locationCounts);
        const counts = Object.values(locationCounts);

        const backgroundColors = locations.map(
          () => 'rgba(151, 213, 200, 0.6)'
        );
        const borderColors = locations.map(() => 'rgba(151, 213, 200, 1)');

        setChartData({
          labels: locations,
          datasets: [
            {
              label: 'Number of Items per Location',
              data: counts,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching items by location:', error);
      }
    };

    fetchItemsByLocation();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Items' },
      },
      x: {
        title: { display: true, text: 'Locations' },
      },
    },
  };

  return (
    <div className="barchart">
      <div style={{ width: '100%', height: '100%', margin: '0 auto' }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default BarChart;
