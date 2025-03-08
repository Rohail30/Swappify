import React from 'react';
import './Doughnut.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import apiRequest from '../../config/apiRequest';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [itemCount, setItemCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [banUserCount, setbanUserCount] = useState(0);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await apiRequest.get('/api/items/');
        setItemCount(res.data.items.length);
      } catch (error) {
        console.log('Error fetching item details:', error);
      }
    };
    fetchItemDetails();
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiRequest.get('/api/admin/users');

        setUserCount(res.data.users.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiRequest.get('/api/admin/users');
        const filteredUsers = res.data.users.filter((user) => user.isBan);
        setbanUserCount(filteredUsers.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  });

  const data = {
    labels: ['Items', 'Users', 'Banned Users'],
    datasets: [
      {
        label: 'Total',
        data: [itemCount, userCount, banUserCount],
        backgroundColor: ['#73B5EB', '#112299', '#1891FF'],
        borderColor: ['#73B5EB', '#112299', '#1891FF'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="donut">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
