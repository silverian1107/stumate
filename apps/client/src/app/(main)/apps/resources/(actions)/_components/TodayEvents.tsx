import React from 'react';

interface Event {
  id: number;
  title: string;
  time: string;
  color: string;
}

const TodayEvents = ({ dailyTaskList }: { dailyTaskList: Event[] }) => {
  return (
    <div className="max-w-full  bg-white rounded-b-lg px-2 border-t border-primary-100  box-border pb-2 h-full ">
      <p className="text-lg font-bold text-center text-primary-950 mb-4">
        Today Event
      </p>
      <div className="overflow-auto h-20 py-2">
        {(dailyTaskList || []).length ? (
          <ul className="space-y-2  ">
            {(dailyTaskList || []).map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between border-b border-gray-200 pb-2"
              >
                <div className="flex items-center">
                  <span
                    className={`size-2 rounded-full  ${event.color} mr-3`}
                  />
                  <span className="text-xs font-medium text-gray-700 truncate max-w-xs">
                    {event.title}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{event.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No event today</p>
        )}
      </div>
    </div>
  );
};

export default TodayEvents;
