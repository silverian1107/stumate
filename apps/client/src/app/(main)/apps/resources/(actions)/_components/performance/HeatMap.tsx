import 'react-calendar-heatmap/dist/styles.css';
import './style/heatmap.css';

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

import Introduction from './Introduction';

const HeatMap = () => {
  const today = new Date();
  const values = [
    { date: '2024-10-01', count: 5 },
    { date: '2024-10-10', count: 8 },
    { date: '2024-10-15', count: 3 },
    { date: '2024-10-20', count: 7 },
    { date: '2024-10-25', count: 6 },
    { date: '2024-11-01', count: 1 },
    { date: '2024-11-02', count: 2 },
    { date: '2024-11-03', count: 3 },
    { date: '2024-11-10', count: 4 },
    { date: '2024-11-20', count: 9 },
    { date: '2024-11-25', count: 2 },
    { date: '2024-12-01', count: 5 },
    { date: '2024-12-05', count: 3 },
    { date: '2024-12-10', count: 7 },
    { date: '2024-12-15', count: 4 },
    { date: '2024-12-20', count: 8 },
    { date: '2024-12-25', count: 6 }
  ];
  return (
    <div className="w-full max-h-fit px-4 bg-white flex justify-center">
      <div className="flex items-end justify-between w-fit ">
        <Introduction />
        <div className="w-full h-40 py-2 ">
          <CalendarHeatmap
            values={values}
            startDate={new Date(today.getFullYear(), today.getMonth() - 8, 1)}
            endDate={today}
            classForValue={(value) =>
              !value
                ? 'color-empty'
                : value.count >= 10
                  ? 'color-scale-4'
                  : value.count >= 8
                    ? 'color-scale-3'
                    : value.count >= 4
                      ? 'color-scale-2'
                      : value.count >= 2
                        ? 'color-scale-1'
                        : 'color-empty'
            }
            gutterSize={6}
          />
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
