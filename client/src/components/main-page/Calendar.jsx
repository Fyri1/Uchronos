import React, { useState, useContext } from 'react';
import $api from '../../services/api.js';
import axios from 'axios';
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ModalsContext from '../../contex/modalsContext.js';
import EventModal from '../modals/EventModal.jsx';
import Popup from './EventPopup.jsx';
import '../css-files/Calendar.css';

const handleDateSelect = async (
  selectInfo,
  displayedCalendarData,
  setPopupActive
) => {
  let calendarApi = selectInfo.view.calendar;
  console.log(selectInfo);
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

const searchButtonHandle = async (testFullCalendar, eventsElements) => {
  let removeEvents = testFullCalendar.getEventSources();
  removeEvents.forEach(event => {
  event.remove(); // this will clear 
  });
  eventsElements.filter((event, i, arr) => {
  return event.title.includes(document.getElementById('searchInput').value);
  }).forEach(eventElement => testFullCalendar.addEvent(eventElement));
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
      // console.log(holidays.data.items);
      const events = await $api.get(
        '/calendar/event/' + calendars.data.data[0].id
      );
      setDisplayedCalendarData({
        ...calendars.data.data[0],
        events: events.data.data,
        // searchParam: 'eba'
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

  const { setAnchorEl } = useContext(ModalsContext);

  const handleEvent = async (event) => {
    console.log('ya pidoras');
    console.log(event);
    try {
      await $api.patch('/calendar/event/' + event.event.id, {
        event_start: event.event.startStr,
        event_end: event.event.endStr,
      });
    } catch (e) {
      console.log('401! ' + e);
    }
  };

  // TEMP
  const calendarsElements = calendarsList.map((calendar, i, arr) => {
    // Find and mark the last element of loaded posts (for endless scroll)
    return (
      <div>
        <div className="calendarName">

          <div>{calendar.title}</div>
          {
            calendar.title === displayedCalendarData.title
            ?
            <div className='selected'> - selected</div>
            :
            null
          }
        </div>
        <div className="radio">
          <label className="custom-radio">
            <input type="radio" name="color" value="indigo"/>
            <span>Indigo</span>
          </label>
        </div>
      </div>
    );
  });

  // TEMP
  
  console.log(eventsElements);

  const holidaysElements = holidays.map((e) => ({
    id: e.id,
    title: e.summary,
    start: e.start.date,
    color: 'blue',
    description: e.description,
    end: e.end.date,
  }));

  const handleEvents = async (events) => {
    console.log("ebat")
    if (!testFullCalendar) {
      setTestFullCalendar(events[0]._context.calendarApi);
    }
    setState({
      currentEvents: events,
    });
  };

  return (
    <div className='kokon'>
      <div className="demo-app ">
        {/* {renderSidebar()} */}
        {
          !loading
          ?
          <div>
            <Popup active={popupActive} setActive={setPopupActive}>
              <div className = 'Greetings'><p>Hi GERMAN PIDOR!</p></div>
              
                <div className="text-field text-field_floating-2">
                  
                  <input className='text-field__input' type="text" id='titleInput' value={newEventInfo && Object.keys(newEventInfo).length === 4 ? newEventInfo.event.title : ''}></input>
                  <label className='text-field__label'id = "title2"   htmlFor='title'>Title</label>
                </div>

                <div className="text-field text-field_floating-2">
                  
                  <input className='text-field__input' id='descriptionInput' placeholder={newEventInfo && Object.keys(newEventInfo).length === 4 && eventsElements.find(item => item.id === newEventInfo.event.id) ? eventsElements.find(item => item.id === newEventInfo.event.id).description : ''}></input>
                  <label className='text-field__label'id = "title" htmlFor='description'>Description</label>
                </div>

                <div className="text-field text-field_floating-2">
                  
                  <input className='text-field__input' id='event_endInput'></input>
                  <label className='text-field__label'id = "title" htmlFor='event_end'>Duration</label>
                </div>

                <div className="text-field text-field_floating-2">
                  {/* this will make checkbox wiyh color  */}
                  <input className='text-field__input' id='colorInput' placeholder={newEventInfo && Object.keys(newEventInfo).length === 4 ? newEventInfo.event.backgroundColor : ''}></input>
                  <label className='text-field__label' htmlFor='color'>Color</label>
                
                </div>

              <div>
                <button className='button_create' onClick={() => handleDateSelect(newEventInfo, displayedCalendarData, setPopupActive)}>
                  {
                    newEventInfo?.event?.id
                    ?
                    <div className="button_hola" id ="button_hola_create" >
                      <label>Update</label>
                    </div>
                    :
                    <div className="button_hola"  id ="button_hola_create">
                      <label>Create</label>
                    </div>
                  }
                </button>
                <button className="button_hola" id ="button_hola_cancel" onClick={() => {setPopupActive(false); console.log(Object.keys(newEventInfo).length)}}>Cancel</button>
                {
                  newEventInfo && Object.keys(newEventInfo).length === 4
                  ?
                  <button className="button_hola" id ="button_hola_delete" onClick={() => handleDateDelete(newEventInfo, setPopupActive)}>Delete</button>
                  :
                  null
                }
              </div>
            </Popup>

            <div className='main_context'>
              <div className='sidebar' id ="mainId">
                <div>
                  <div>{calendarsElements}</div>
                  
                  <div>
                    <input id='searchInput' placeholder='Enter event name'></input>
                    <button onClick={() => { searchButtonHandle(testFullCalendar, eventsElements); }}>Search</button>
                  </div>
                </div>
              </div>

              <div className="demo-app-main" >
                
                <EventModal />
                <div className="day_calendar" >
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
                    initialEvents={[...eventsElements, ...holidaysElements]}
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
          <div></div>
        }
      </div>
    </div>
  );
};

export default Calendar;
