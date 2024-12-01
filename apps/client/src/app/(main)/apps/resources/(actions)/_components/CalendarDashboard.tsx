import './calendar/style/calendar.css';

import Calendar from 'react-calendar';

import TodayEvents from './TodayEvents';

const CalendarDashboard = () => {
  const today = new Date();
  return (
    <div className="flex flex-col bg-white rounded-lg h-full box-border border border-primary-100 ">
      <Calendar
        className="bg-white rounded-lg  p-2 flex flex-col gap-2 items-center h-1/2 mb-2"
        tileClassName={({ date, view }) => {
          if (
            view === 'month' &&
            date.toDateString() === today.toDateString()
          ) {
            return 'today-highlight';
          }
          return null;
        }}
      />
      <TodayEvents />
    </div>
  );
};

export default CalendarDashboard;
