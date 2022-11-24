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
  const [loading, setLoading] = useState(true);
  const [calendarsList, setCalendarsList] = useState([]);
  const [displayedCalendarData, setDisplayedCalendarData] = useState([]);

  const [state, setState] = useState({
    weekendsVisible: true,
    currentEvents: [],
  });

  React.useEffect(() => {
    console.log('Getting user calendars');
    OnLoad();
  }, []);

  async function OnLoad() {
    try {
      //// NADO DETO NARIT EBANII ID USERA
      // const response = await $api.get('/calendar/' + localStorage.getItem("id"));
      let response = await $api.get('/calendar/');

      setCalendarsList([ ...response.data.data ]);

      response = await $api.get('/calendar/event/' + response.data.data[0].id);
      // console.log(response);
      setDisplayedCalendarData(response.data.data);
      
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const { setAnchorEl } = useContext(ModalsContext);
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

  // TEMP
  const calendarsElements = calendarsList.map((calendar, i, arr) => {
    // Find and mark the last element of loaded posts (for endless scroll)
    return (
      <div className="calendarName">
        <div>{calendar.title}</div>
        {
          calendar.title === displayedCalendarData.title
          ?
          <div> - selected</div>
          :
          <div></div>
        }
      </div>
    )
  });

  // TEMP
  const eventsElements = displayedCalendarData.map((event, i, arr) => {
    return {
      id: event.id,
      title: event.title,
      start: event.event_start,
      // end: event.event_end,
    }
  });


  return (
    <div className="demo-app ">
      {/* {renderSidebar()} */}
      {
        !loading
        ?
        <div>
          <div className='sidebar'>
            <div>
              <div>{calendarsElements}</div>
            </div>
          </div>

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
              initialEvents={eventsElements}
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
        :
        <div></div>
      }
    </div>
  );
};

export default Calendar;
