import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const DoctorAvailabilityCalendar = ({ availability }) => {
  // Convert availability into calendar events
  const events = Object.keys(availability)
    .filter((day) => availability[day])
    .map((day) => ({
      title: 'Available',
      start: getNextDate(day), // Helper function to get the next date for a day
      allDay: true,
    }));

  // Helper function to get the next date for a given day of the week
  function getNextDate(dayName) {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();
    const currentDayIndex = today.getDay();
    const targetDayIndex = daysOfWeek.indexOf(dayName);
    const daysUntilNextTarget =
      (targetDayIndex - currentDayIndex + 7) % 7 || 7;
    const nextDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + daysUntilNextTarget
    );
    return nextDate.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth" // Change this to "dayGridMonth" for month view
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
      />
    </div>
  );
};

export default DoctorAvailabilityCalendar;
