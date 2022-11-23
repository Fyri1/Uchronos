import React, { useState, useContext } from 'react';
import $api from '../../services/api.js';
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS } from '../../utils/event-utils.js';
import { v4 as uuidv4 } from 'uuid';
import ModalsContext from '../../contex/modalsContext.js';
import EventModal from '../modals/EventModal.jsx';

const handleDateSelect = async (selectInfo) => {
  let title = prompt('Please enter a new title for your event');
  let calendarApi = selectInfo.view.calendar;
  console.log(selectInfo.view);
  calendarApi.unselect(); // clear date selection
  if (title) {
    try {
      const initialEvents = {
        id: uuidv4(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        backgroundColor: 'red',
      };
      await $api.post('/calendar/event', initialEvents);
      calendarApi.addEvent(initialEvents);
    } catch (e) {
      console.log('401!');
    }
  }
};

const handleEventClick = (clickInfo) => {
  console.log(clickInfo.event._context.getCurrentData());
  if (
    confirm(
      `Are you sure you want to delete the event '${clickInfo.event.title}'`
    )
  ) {
    clickInfo.event.remove();
  }
};

const renderEventContent = (eventInfo) => {
  // console.log(eventInfo);
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
  const { setAnchorEl } = useContext(ModalsContext);
  
  const handleEvents = (events) => {
    setState({
      currentEvents: events,
    });
  };


  return (
    <div className="demo-app ">
      {/* {renderSidebar()} */}
      <div className="demo-app-main">
        <EventModal />
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
          weekends={true}
          initialEvents={INITIAL_EVENTS}
          select={(selectInfo) => {
            handleDateSelect(selectInfo);
            // console.log(selectInfo.jsEvent.target);
            // setAnchorEl(selectInfo.jsEvent.target);
          }}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>
    </div>
  );
};

export default Calendar;
