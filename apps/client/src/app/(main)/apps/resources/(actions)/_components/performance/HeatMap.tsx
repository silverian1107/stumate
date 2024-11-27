import 'react-calendar-heatmap/dist/styles.css';
import './style/heatmap.css';

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

import Introduction from './Introduction';

const HeatMap = () => {
  const today = new Date();
  const values = [
    { date: '2024-11-01', count: 1 },
    { date: '2024-11-02', count: 2 },
    { date: '2024-11-03', count: 3 }
    // Add more data points here
  ];

  return (
    <div className="w-full max-h-fit px-4 bg-white flex justify-center">
      <div className="flex items-end justify-center w-fit ">
        <Introduction />
        <div className="w-full h-40 py-2 ">
          <CalendarHeatmap
            values={values}
            startDate={new Date(today.getFullYear(), today.getMonth() - 6, 1)}
            endDate={today}
            classForValue={(value) =>
              !value
                ? 'color-empty'
                : value.count >= 5
                  ? 'color-scale-4'
                  : value.count >= 4
                    ? 'color-scale-3'
                    : value.count >= 3
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
