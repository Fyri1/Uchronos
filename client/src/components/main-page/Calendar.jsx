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

export const handleDateSelect = async (selectInfo, values, setPopupActive) => {
  let calendarApi = selectInfo.view.calendar;
  calendarApi.unselect();
  let start = '';
  let end = '';
      if (typeof values.range.start !== 'string') {
        start = `${values.range.start.$d.getFullYear()}-${values.range.start.$d.getMonth() + 1}-${values.range.start.$d.getDate() < 10
            ? `0${values.range.start.$d.getDate()}`
            : values.range.start.$d.getDate()
          }`;
      } else {
        start = values.range.start;
      }
      if (typeof values.range.end !== 'string') {
        end = `${values.range.end.$d.getFullYear()}-${values.range.end.$d.getMonth() + 1}-${values.range.end.$d.getDate() < 10
            ? `0${values.range.end.$d.getDate()}`
            : values.range.end.$d.getDate()
          }`;
      } else {
        end = values.range.end;
      }
  try {
    const initialEvents = {
      title: values.title,
      description: values.description,
      color: values.color,
      start,
      end,
    };
    console.log(initialEvents);

    // Check if such event was already created
    if (selectInfo.event?.id) {
      selectInfo.id = values.id;
      selectInfo.title = values.title;
      selectInfo.description = values.description;
      selectInfo.color = values.color;
      selectInfo.start = start;
      selectInfo.end = end;

      await $api.patch('/calendar/event/' + selectInfo.event.id, initialEvents);
      calendarApi.getEventById(selectInfo.event.id).remove();
      calendarApi.addEvent(selectInfo);
    } else {
      await $api.post('/calendar/event/' + values.id, initialEvents);
      calendarApi.addEvent(initialEvents);
    }

    setPopupActive(false);
  } catch (e) {
    console.log('401! ' + e);
  }
};

export const handleDateDelete = async (selectInfo, setPopupActive) => {
  try {
    await $api.delete('/calendar/event/' + selectInfo.event.id);

    setPopupActive(false);
    let calendarApi = selectInfo.view.calendar;
    calendarApi.getEventById(selectInfo.event.id).remove();
  } catch (e) {
    console.log('401! ' + e);
  }
};

const searchButtonHandle = async (
  testFullCalendar,
  eventsElements,
  holidaysElements
) => {
  console.log('pidoras handle');
  let removeEvents = testFullCalendar.getEventSources();
  removeEvents.forEach((event) => {
    event.remove();
  });
  testFullCalendar.removeAllEvents();
  eventsElements
    .filter((event, i, arr) => {
      return event.title.includes(document.getElementById('searchInput').value);
    })
    .forEach((eventElement) => testFullCalendar.addEvent(eventElement));
  holidaysElements
    .filter((event, i, arr) => {
      return event.title.includes(document.getElementById('searchInput').value);
    })
    .forEach((holidayElement) => testFullCalendar.addEvent(holidayElement));
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
    searchParam: '',
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
        events: events.data.data,
      });
      setEventsElements(
        displayedCalendarData.events.map((event, i, arr) => {
          return {
            id: event.id,
            title: event.title,
            start: event.event_start,
            color: event.color,
            description: event.description,
            end: event.event_end,
          };
        })
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const renderCalendarEvents = (eventsArr) => {
    console.log('remove govna')
    let removeEvents = testFullCalendar.getEventSources();
    removeEvents.forEach((event) => {
      event.remove();
    });
    testFullCalendar.removeAllEvents();

    eventsArr.forEach(events => {
      console.log('render govna');
      events.forEach((eventElement) => testFullCalendar.addEvent(eventElement));
    })
  }

  const handleEvent = async (event) => {
    console.log('ya pidoras');
    console.log(event);
    try {
      await $api.patch('/calendar/event/' + event.event.id, {
        start: event.event.startStr,
        end: event.event.endStr,
      });
    } catch (e) {
      console.log('401! ' + e);
    }
  };

  const handleCalendarAdd = async () => {
    try {
      console.log('dobavit pizdec');
    } catch (e) {
      console.log('401! ' + e);
    }
  }

  const handleCalendarChange = async (event) => {
    try {
      console.log('ishy pizdec');
      const selectedCalendar = calendarsList.find(
        (calendar) => calendar.title === event.currentTarget.id
      );
      console.log(selectedCalendar.id);
      const events = await $api.get('/calendar/event/' + selectedCalendar.id);
      
      console.log(events.data.data);

      setDisplayedCalendarData({
        id: selectedCalendar.id,
        title: selectedCalendar.title,
        events: events.data.data,
        searchParam: ''
      });
      
      const parsedElements = events.data.data.length
        ?
        events.data.data.map((event, i, arr) => {
          return {
            id: event.id,
            title: event.title,
            start: event.event_start,
            color: event.color,
            description: event.description,
            end: event.event_end,
          };
        })
        :
        []
        setEventsElements(
          parsedElements
        );
      
      //// OSTAVIT IBO MOZET NE RABOTAT
      // if (events.data.data.length) {
      //   renderCalendarEvents([holidaysElements, parsedElements]);
      // } else {
      //   renderCalendarEvents([holidaysElements])
      // }
      renderCalendarEvents([holidaysElements, parsedElements]);
      console.log(selectedCalendar.title);
    } catch (e) {
      console.log('401! ' + e);
    }
  };

  const calendarsElements = calendarsList.map((calendar, i, arr) => {
    return (
      <div>
        <div className="sidebar" id={calendar.title} onClick={handleCalendarChange}>
          { calendar.title === displayedCalendarData.title ? (
            <div className="all_list">{calendar.title}</div>
          ) : (
            <div className="">{calendar.title}</div>
          )}
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
    console.log('ebat handle events');
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
        {!loading && initialEvents && initialEvents.length ? (
          <div>
            <Popup active={popupActive} setActive={setPopupActive}>
              <CreateEvent
                newEventInfo={newEventInfo}
                eventsElements={eventsElements}
                setPopupActive={setPopupActive}
                active={popupActive}
              />
            </Popup>

            <div className="img">
              <img src="../public/photo/logo.jpg"></img>
            </div>
            <div className="main_context">
              <div className="sidebar" id="mainId">
                {/* Search */}
                <div className="d1">
                        <div className="koko2"></div>
                        <input
                          id="searchInput"
                          placeholder="Enter event name"
                        ></input>
                        <button
                          onClick={() => {
                            searchButtonHandle(
                              testFullCalendar,
                              eventsElements,
                              holidaysElements
                            );
                          }}
                        ></button>
                </div>


                <div className="border1">
                  <div>
                    <div>
                      <div className="sidebar" id='addCalendar' onClick={handleCalendarAdd}>
                        <div className="all_list">Add calendar</div>
                      </div>
                    </div>
                    {calendarsElements}
                  </div>

                </div>
                  <button class="btn">Add</button>
                  <button class="btn" disabled>Disabled</button>

              </div>

              <div className="demo-app-main">
                <div className="day_calendar" id="calendar">
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
        ) : null}
      </div>
    </div>
  );
};

export default Calendar;
