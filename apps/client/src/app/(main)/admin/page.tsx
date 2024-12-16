'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React from 'react';

import Items from './_components/dashboard/Items';
import RevenueChart from './_components/dashboard/RevenueChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  // const [revenueYear, setRevenueYear] = useState(2024);
  // const [postYear, setPostYear] = useState(2024);
  // const [data, setData] = useState([]);
  // const [revenueData, setRevenueData] = useState([]);
  // const [topPostCompany, setTopPostCompany] = useState([]);
  // const [chartPostData, setChartPostData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  // const formatNumber = (number: number) => {
  //   if (!number) return 0;
  //   return Number(number).toLocaleString('vi-VN');
  // };

  return (
    <div className="flex flex-col gap-5 p-5 flex-1 size-full">
      <Items />
      <RevenueChart />
    </div>
  );
};

export default DashboardPage;
