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
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import type { AdminStatisticResponse } from '@/service/rootApi';
import { useGetStatisticsAdminQuery } from '@/service/rootApi';

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
  const [, setSocket] = useState<any>(null);
  const [statistics, setStatistics] = useState<AdminStatisticResponse | null>(
    null
  );

  const response = useGetStatisticsAdminQuery();

  useEffect(() => {
    if (response.isSuccess) {
      setStatistics(response.data);
    }
    const newSocket = io('http://127.0.0.1:3000', {
      auth: {
        token: Cookies.get('access_token')
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000
    });
    newSocket.on('connect', () => {
      console.log('Connected to server via Socket.IO');
    });

    newSocket.on('update-user-statistic', (updatedStatistics: any) => {
      console.log('Received updated statistics:', updatedStatistics);
      setStatistics(updatedStatistics);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server.');
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [response, response.isSuccess]);

  return (
    <div className="flex flex-col gap-5 p-5 flex-1 size-full">
      <Items
        overview={
          statistics?.data?.overview || {
            totalAccounts: 0,
            totalNotes: 0,
            totalFlashcards: 0,
            totalQuizzes: 0
          }
        }
      />
      {statistics?.data?.monthlyStatisticsChart && (
        <RevenueChart
          monthlyStatisticsChart={statistics.data.monthlyStatisticsChart}
        />
      )}
    </div>
  );
};

export default DashboardPage;
