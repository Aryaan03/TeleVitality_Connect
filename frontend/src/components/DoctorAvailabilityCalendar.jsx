import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const DoctorAvailabilityCalendar = ({ availability, bookings = [] }) => {
  // Convert availability into calendar events with 30-minute slots
  const events = [];
  
  // Process each day's availability
  Object.keys(availability).forEach(day => {
    if (availability[day] && availability[day].enabled) {
      const timeSlots = availability[day].timeSlots;
      
      // Process each time range
      timeSlots.forEach(slot => {
        if (slot.enabled) {
          // Get the next occurrence of this day
          const nextDate = getNextDate(day);
          
          // Create 30-minute slots within the time range
          const slotEvents = create30MinuteSlots(
            nextDate, 
            slot.startTime, 
            slot.endTime
          );
          
          events.push(...slotEvents);
          
          // Add events for the next few weeks
          for (let i = 1; i <= 3; i++) {
            const futureDate = getFutureDate(day, i);
            const futureSlotEvents = create30MinuteSlots(
              futureDate, 
              slot.startTime, 
              slot.endTime
            );
            events.push(...futureSlotEvents);
          }
        }
      });
    }
  });
  
  // Function to create 30-minute slots
  function create30MinuteSlots(date, startTime, endTime) {
    const slots = [];
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    
    let currentSlotStart = new Date(start);
    
    while (currentSlotStart < end) {
      // Calculate slot end time (30 minutes later)
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + 30);
      
      // Don't create slots that go beyond the end time
      if (currentSlotEnd > end) {
        break;
      }
      
      // Check if this slot is already booked
      const isBooked = isTimeSlotBooked(
        date, 
        formatTime(currentSlotStart), 
        formatTime(currentSlotEnd),
        bookings
      );
      
      slots.push({
        title: isBooked ? 'Booked' : 'Available',
        start: currentSlotStart.toISOString(),
        end: currentSlotEnd.toISOString(),
        backgroundColor: isBooked ? '#F44336' : '#4CAF50',
        borderColor: isBooked ? '#D32F2F' : '#388E3C',
        extendedProps: {
          isAvailable: !isBooked
        }
      });
      
      // Move to next slot
      currentSlotStart = currentSlotEnd;
    }
    
    return slots;
  }
  
  // Check if a time slot is already booked
  function isTimeSlotBooked(date, startTime, endTime, bookings) {
    return bookings.some(booking => 
      booking.date === date && 
      booking.startTime === startTime && 
      booking.endTime === endTime
    );
  }
  
  // Format time as HH:MM
  function formatTime(date) {
    return date.toTimeString().substring(0, 5);
  }

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
  
  // Helper function to get future dates for recurring availability
  function getFutureDate(dayName, weeksAhead) {
    const nextDate = getNextDate(dayName);
    const date = new Date(nextDate);
    date.setDate(date.getDate() + (7 * weeksAhead));
    return date.toISOString().split('T')[0];
  }
  
  // Handle a click on a time slot
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    if (event.extendedProps.isAvailable) {
      // Here you would open a booking modal or navigate to booking page
      alert(`Book appointment for ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`);
    } else {
      alert('This slot is already booked');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height="auto"
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        slotDuration="00:30:00"
        businessHours={{
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
          startTime: '08:00',
          endTime: '20:00',
        }}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }}
      />
    </div>
  );
};

export default DoctorAvailabilityCalendar;