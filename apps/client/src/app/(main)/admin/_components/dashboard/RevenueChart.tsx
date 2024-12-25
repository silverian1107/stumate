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
import { Line } from 'react-chartjs-2';

import type { MonthlyStatisticsChart } from '@/service/rootApi';

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

const RevenueChart = ({
  monthlyStatisticsChart
}: {
  monthlyStatisticsChart: MonthlyStatisticsChart;
}) => {
  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  // Utility function to generate data for each dataset
  const getMonthlyData = (data: { count: number; month: number }[]) =>
    labels.map(
      (_, index) => data.find((entry) => entry.month === index + 1)?.count || 0
    );

  const datasets = [
    {
      label: 'Accounts',
      data: getMonthlyData(monthlyStatisticsChart.totalAccounts),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    },
    {
      label: 'Notes',
      data: getMonthlyData(monthlyStatisticsChart.totalNotes),
      borderColor: 'rgb(19, 234, 29)',
      tension: 0.1
    },
    {
      label: 'Flashcards',
      data: getMonthlyData(monthlyStatisticsChart.totalFlashcards),
      borderColor: 'rgb(130, 23, 136)',
      tension: 0.1
    },
    {
      label: 'Quizzes',
      data: getMonthlyData(monthlyStatisticsChart.totalQuizzes),
      borderColor: 'rgb(31, 177, 217)',
      tension: 0.1
    }
  ];

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Statistics',
        font: { size: 30 },
        color: 'hsl(247 45.1% 20%)'
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 flex-1 w-full">
      <div className="flex flex-col gap-5 rounded-lg w-full">
        <Line className="w-full max-h-[55vh]" options={options} data={data} />
      </div>
      <div className="flex items-center gap-2 mt-5">
        <span>Year: {monthlyStatisticsChart.totalAccounts[0]?.year}</span>
      </div>
    </div>
  );
};

export default RevenueChart;
