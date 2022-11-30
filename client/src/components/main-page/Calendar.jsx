import React, { useState, useContext } from 'react';
import $api from '../../services/api.js';
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
// import bootstrapPlugin from '@fullcalendar/bootstrap';

const handleDateSelect = async (selectInfo, displayedCalendarData, setPopupActive) => {
  let calendarApi = selectInfo.view.calendar;

  // console.log(selectInfo);
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
           ?
           document.getElementById('event_endInput').value
           :
           selectInfo.endStr
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
        selectInfo.description = document.getElementById('descriptionInput').value;
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
      await $api.post('/calendar/event/' + displayedCalendarData.id, initialEvents);
      calendarApi.addEvent(initialEvents);
    }
    
    setPopupActive(false);
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

const searchButtonHandle = async () => {
  try {
    
  } catch (e) {
    console.log('401! ' + e);
  }
}

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
    id: "",
    events: []
  });
  const [popupActive, setPopupActive] = useState();
  const [newEventInfo, setNewEventInfo] = useState();

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
      setCalendarsList([ ...calendars.data.data ]);
      
      const events = await $api.get('/calendar/event/' + calendars.data.data[0].id);
      setDisplayedCalendarData({ ...calendars.data.data[0], events: events.data.data });
      
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const { setAnchorEl } = useContext(ModalsContext);

  const handleEvent = async (event) => {
    console.log("ya pidoras");
    console.log(event);
    try {
      await $api.patch('/calendar/event/' + event.event.id, {
        event_start: event.event.startStr,
        event_end: event.event.endStr
      });
    } catch (e) {
      console.log('401! ' + e);
    }
  }
  
  const handleEvents = async (events) => {
    setState({
      currentEvents: events,
    });
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
    // Find and mark the last element of loaded posts (for endless scroll)

    // var line =calendar.title.split(":", 1);

  //   <div className="sidebar">
  //   <a className="active" href="#home">Home</a>
  //   <a href="#news">News</a>
  //   <a href="#contact">Contact</a>

  // </div>
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
    )
  });

  // TEMP
  // console.log(displayedCalendarData);
  const eventsElements = displayedCalendarData.events.map((event, i, arr) => {
    console.log("map pizdec");
    return {
      id: event.id,
      title: event.title,
      start: event.event_start,
      color: event.color,
      description: event.description,
      end: event.event_end
    }
  });
  // console.log(eventsElements);

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
                
                  <div className='border1'>
                    <div>{calendarsElements}</div>
                    <div class="d1">
      
                      {/* тимофей сказал поиск делать  */}
                      <input type="text" placeholder='Enter event name'></input>
                      <div className='koko2'></div>
                      <button className='button_search' onClick={searchButtonHandle}></button>
                      
                      {/* НЕ РАБОТАЕТ КНОПКАААА!!!!!!!! ЕЕ НЕТ! */}
                      
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
                    initialEvents={eventsElements}
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

