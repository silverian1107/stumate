import React from 'react';

const TodayEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Seminar IT',
      time: '7:00 AM - 9:00 AM',
      color: 'bg-green-500',
    },
    {
      id: 2,
      title: 'Mathematics class',
      time: '9:15 AM - 11:15 AM',
      color: 'bg-red-500',
    },
    {
      id: 3,
      title: 'Lunch',
      time: '11:30 AM - 12:00 PM',
      color: 'bg-yellow-500',
    },
    {
      id: 4,
      title: 'Doing project',
      time: '1:00 PM - 4:00 PM',
      color: 'bg-red-500',
    },
    {
      id: 5,
      title: 'Meeting some friends',
      time: '7:00 PM - 9:00 PM',
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="max-w-full  bg-white rounded-b-lg px-2 border-t-[1px] border-primary-100  box-border pb-2 h-full ">
      <p className="text-lg font-bold text-center text-primary-950 mb-4">
        Today Event
      </p>
      <div className="overflow-auto h-20 py-2">
        <ul className="space-y-2  ">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center justify-between border-b border-gray-200 pb-2"
            >
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full  ${event.color} mr-3`}
                ></span>
                <span className="text-xs font-medium text-gray-700 truncate max-w-xs">
                  {event.title}
                </span>
              </div>
              <span className="text-xs text-gray-500">{event.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodayEvents;
