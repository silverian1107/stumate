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
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

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
interface Options {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      position: 'top' | 'left' | 'right' | 'bottom' | 'center' | 'chartArea';
    };
    title: {
      display: boolean;
      text: string;
      font: {
        size: number; // Đổi từ string thành number
      };
      color: string;
    };
  };
}

const RevenueChart = () => {
  const [showYear, setShowYear] = useState(false);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );
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
  const data = {
    labels,
    datasets: [
      {
        label: 'Accounts',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Logs',
        data: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Notes',
        data: [12, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        fill: false,
        borderColor: 'rgb(19, 234, 29)',
        tension: 0.1
      },
      {
        label: 'Flashcards',
        data: [12, 11, 10, 9, 8, 13, 6, 5, 4, 3, 2, 1],
        fill: false,
        borderColor: 'rgb(130, 23, 136)',
        tension: 0.1
      },
      {
        label: 'Quizzes',
        data: [12, 11, 10, 9, 8, 7, 6, 5, 30, 3, 2, 1],
        fill: false,
        borderColor: 'rgb(31, 177, 217)',
        tension: 0.1
      }
    ]
  };

  const options: Options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' // Đảm bảo giá trị nằm trong tập hợp được hỗ trợ
      },
      title: {
        display: true,
        text: 'Statistics',
        font: {
          size: 30 // Giá trị phải là số
        },
        color: 'hsl(247 45.1% 20%)'
      }
    }
  };

  const handleChangeYear = (year: number) => {
    setActiveYear(year);
  };

  return (
    <div className="bg-white rounded-lg p-5 flex-1 w-full">
      <div className="flex flex-col gap-5 rounded-lg w-full ">
        <Line className="w-full max-h-[55vh]  " options={options} data={data} />
      </div>
      <div className="flex items-center gap-2 mt-5">
        <button
          className="flex h-full items-center gap-2 text-sm cursor-pointer hover:text-primary"
          onClick={() => setShowYear(!showYear)}
          type="button"
        >
          <span>Year</span>
          <ChevronDown className="size-[10px] transition-transform duration-300 rotate-[270deg]" />
        </button>
        <div
          className={`flex items-center justify-start gap-2 transition-all duration-300 ease-in-out ${
            showYear
              ? 'opacity-100 max-h-20 translate-x-0'
              : 'opacity-0 max-h-0 translate-x-full overflow-hidden'
          }`}
        >
          {years.map((year) => (
            <button
              type="button"
              key={year}
              className={`text-sm cursor-pointer decoration-primary ${
                activeYear === year ? '!text-primary underline' : ''
              }`}
              onClick={() => handleChangeYear(year)}
            >
              Year {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
