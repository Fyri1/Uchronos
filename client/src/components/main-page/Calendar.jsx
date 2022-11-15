import React, { useState } from 'react';
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from '../../utils/event-utils.js';

const handleDateSelect = (selectInfo) => {
  console.log(selectInfo);
  let title = prompt('Please enter a new title for your event');
  let calendarApi = selectInfo.view.calendar;

  calendarApi.unselect(); // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
  }
};

const handleEventClick = (clickInfo) => {
  console.log(clickInfo);
  if (
    confirm(
      `Are you sure you want to delete the event '${clickInfo.event.title}'`
    )
  ) {
    clickInfo.event.remove();
  }
};

const renderEventContent = (eventInfo) => {
  console.log(eventInfo);
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
};

const renderSidebarEvent = (event) => {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
};

const Calendar = () => {
  const [state, setState] = useState({
    weekendsVisible: true,
    currentEvents: [],
  });
  const handleWeekendsToggle = () => {
    setState({
      weekendsVisible: !weekendsVisible,
    });
  };
  const handleEvents = (events) => {
    setState({
      currentEvents: events,
    });
  };

  const views = {
    timelineCustom: {
      type: 'timeline',
      buttonText: 'Year',
      dateIncrement: { years: 1 },
      slotDuration: { months: 1 },
      visibleRange: function (currentDate) {
        return {
          start: currentDate.clone().startOf('year'),
          end: currentDate.clone().endOf('year'),
        };
      },
    },
  };

  return (
    <div className="demo-app ">
      {/* {renderSidebar()} */}
      <div className="demo-app-main">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'year,dayGridMonth,timeGridWeek,timeGridDay,listYear',
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={state.weekendsVisible}
          initialEvents={INITIAL_EVENTS}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>
    </div>
  );
};

export default Calendar;
