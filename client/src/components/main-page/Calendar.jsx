import React, { useState, useContext } from 'react';
import $api from '../../services/api.js';
import axios from 'axios';
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from './EventPopup.jsx';
import CreateEvent from '../extentions/CreateEvent.jsx';

import '../css-files/Calendar.css';

const handleDateSelect = async (
  selectInfo,
  displayedCalendarData,
  setPopupActive
) => {
  let calendarApi = selectInfo.view.calendar;
  calendarApi.unselect(); // clear date selection
  try {
    const initialEvents = {
      //// NADO DETO NARIT EBANII ID USERA
      // user_id: '8f0a0cd0-c74b-46aa-9a67-13d88076a36f',
      title: document.getElementById('titleInput').value,
      description: document.getElementById('descriptionInput').value,
      color: document.getElementById('colorInput').value,
      start: selectInfo.startStr,
      end: document.getElementById('event_endInput').value
        ? document.getElementById('event_endInput').value
        : selectInfo.endStr,
    };

    // Check if such event was already created
    if (selectInfo.event?.id) {
      await $api.patch('/calendar/event/' + selectInfo.event.id, initialEvents);
      //// TEMP HYINYA
      //// YA XZ KAK ESHE SDELAT SHOB PO KRASOTE POETOMY DELAEM PO PACANSKI
      if (document.getElementById('titleInput').value) {
        selectInfo.title = document.getElementById('titleInput').value;
      } else {
        selectInfo.title = selectInfo.event.title;
      }

      if (document.getElementById('descriptionInput').value) {
        selectInfo.description =
          document.getElementById('descriptionInput').value;
      }

      if (document.getElementById('colorInput').value) {
        selectInfo.color = document.getElementById('colorInput').value;
      } else {
        selectInfo.color = selectInfo.event.backgroundColor;
      }

      selectInfo.start = selectInfo.event.startStr;
      selectInfo.end = selectInfo.event.endStr;
      calendarApi.getEventById(selectInfo.event.id).remove();
      calendarApi.addEvent(selectInfo);
    } else {
      await $api.post(
        '/calendar/event/' + displayedCalendarData.id,
        initialEvents
      );
      calendarApi.addEvent(initialEvents);
    }

    setPopupActive(false);
    calendarApi.rerenderEvents();
  } catch (e) {
    console.log('401! ' + e);
  }
};

const handleDateDelete = async (selectInfo, setPopupActive) => {
  try {
    await $api.delete('/calendar/event/' + selectInfo.event.id);

    setPopupActive(false);
    let calendarApi = selectInfo.view.calendar;
    calendarApi.getEventById(selectInfo.event.id).remove();
  } catch (e) {
    console.log('401! ' + e);
  }
};

const searchButtonHandle = async (testFullCalendar, eventsElements, holidaysElements) => {
  console.log('pidoras handle');
  let removeEvents = testFullCalendar.getEventSources();
  removeEvents.forEach(event => {
    event.remove();
  });
  testFullCalendar.removeAllEvents();
  eventsElements.filter((event, i, arr) => {
    return event.title.includes(document.getElementById('searchInput').value);
  }).forEach(eventElement => testFullCalendar.addEvent(eventElement));
  holidaysElements.filter((event, i, arr) => {
    return event.title.includes(document.getElementById('searchInput').value);
  }).forEach(holidayElement => testFullCalendar.addEvent(holidayElement));
};

const renderEventContent = (eventInfo) => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
};

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [calendarsList, setCalendarsList] = useState([]);
  const [displayedCalendarData, setDisplayedCalendarData] = useState({
    id: '',
    events: [],
    searchParam: ''
  });
  const [holidays, setHolidays] = useState([]);
  const [popupActive, setPopupActive] = useState();
  const [newEventInfo, setNewEventInfo] = useState();
  const [testFullCalendar, setTestFullCalendar] = useState();
  const [eventsElements, setEventsElements] = useState();

  const [state, setState] = useState({
    weekendsVisible: true,
    currentEvents: [],
  });

  React.useEffect(() => {
    console.log('Getting user calendars');
    OnLoad();

  }, [loading]);

  async function OnLoad() {
    try {
      const calendars = await $api.get('/calendar/');
      setCalendarsList([...calendars.data.data]);
      const holidays = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/en.ukrainian%23holiday%40group.v.calendar.google.com/events?key=AIzaSyAQvFrMKbaO9Jptp9aMvjLaHeGIIkFgY2k'
      );
      setHolidays(holidays.data.items);
      const events = await $api.get(
        '/calendar/event/' + calendars.data.data[0].id
      );
      setDisplayedCalendarData({
        ...calendars.data.data[0],
        events: events.data.data
      });
      setEventsElements(displayedCalendarData.events.map((event, i, arr) => {
        return {
          id: event.id,
          title: event.title,
          start: event.event_start,
          color: event.color,
          description: event.description,
          end: event.event_end,
        };
      }));

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const handleEvent = async (event) => {
    console.log('ya pidoras');
    console.log(event);
    try {
      await $api.patch('/calendar/event/' + event.event.id, {
        event_start: event.event.startStr,
        event_end: event.event.endStr
      });
    } catch (e) {
      console.log('401! ' + e);
    }
  };

  const handleCalendarChange = async (event) => {
    try {
      console.log("ishy pizdec");
      console.log(displayedCalendarData);
      const selectedCalendar = calendarsList.find(calendar => calendar.title === event.currentTarget.id);
      console.log(selectedCalendar.id);
      const events = await $api.get('/calendar/event/' + selectedCalendar.id);
      console.log("pizos");

      setDisplayedCalendarData({
        ...selectedCalendar,
        events: events.data.data
      });
    } catch (e) {
      console.log('401! ' + e);
    }
  }

  // TEMP
  const calendarsElements = calendarsList.map((calendar, i, arr) => {
    return (
      <div>
        <div className="sidebar" id={calendar.title} onClick={handleCalendarChange}>
          {
           calendar.title === displayedCalendarData.title
            ?
            <div className="all_list">{calendar.title}</div>
            :
            <div className="" >{calendar.title}</div>
          }
        </div>
      </div>
    );
  });

  const holidaysElements = holidays.map((e) => ({
    id: e.id,
    title: e.summary,
    start: e.start.date,
    color: 'blue',
    description: e.description,
    end: e.end.date,
  }));
  const initialEvents = eventsElements;
  const handleEvents = async (events) => {
    console.log("ebat handle events");
    if (!testFullCalendar) {
      setTestFullCalendar(events[0]._context.calendarApi);
    }
    setState({
      currentEvents: events,
    });
  };

  return (
    <div className="kokon">
      <div className="demo-app ">
        {
          !loading && initialEvents && initialEvents.length
          ?
          <div>
            <Popup active={popupActive} setActive={setPopupActive}>
              <CreateEvent
                newEventInfo={newEventInfo}
                eventsElements={eventsElements}
                setPopupActive={setPopupActive}
                active={popupActive}
              />
            </Popup>
            
            <div className='img'><img src="../public/photo/logo.jpg"></img></div>
            <div className='main_context'>
              
              <div className='sidebar' id ="mainId">
                  <div className='border1'>
                    <div >{calendarsElements}</div>
                    <div class="d1">
                      <div className='koko2'></div>
                      <input id='searchInput' placeholder='Enter event name'></input>
                      <button onClick={() => { searchButtonHandle(testFullCalendar, eventsElements, holidaysElements) }}></button>
                    </div>
                  </div>
              </div>

              <div className="demo-app-main" >
                <div className="day_calendar" id='calendar'>
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
                      right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    initialEvents={[...initialEvents, ...holidaysElements]}
                    select={(selectInfo) => {
                      setNewEventInfo(selectInfo);
                      setPopupActive(true);
                    }}
                    eventContent={renderEventContent}
                    eventClick={(selectInfo) => {
                      setNewEventInfo(selectInfo);
                      setPopupActive(true);
                    }}
                    eventDrop={handleEvent}
                    eventResize={handleEvent}
                    eventsSet={handleEvents}
                  />
                </div>
              </div>
            </div>
          </div>
          :
          null
        }
      </div>
    </div>
  );
};

export default Calendar;
