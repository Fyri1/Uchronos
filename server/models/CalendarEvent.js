import client from '../client.js';
import ApiError from '../exceptions/api-error.js';

class CalendarEvent {
  async getAllEvents() {
    try {
      const data = await client('calendar_events').select(
        'calendar_events.id',
        'calendar_events.user_id',
        'calendar_events.calendar_id',
        'calendar_events.title',
        'calendar_events.description',
        'calendar_events.color',
        'calendar_events.created_at'
      );
      return data;
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
  }

  async getAllEventsForCalendarId(calendar_id) {
    const data = await client('calendar_events')
      .select(
        'id',
        'user_id',
        'calendar_id',
        'title',
        'description',
        'color',
        'created_at',
        'event_start',
        'event_end'
      )
      .where('calendar_id', '=', calendar_id);

    return data;
  }

  async addCalendarEvent({
    id,
    user_id,
    calendar_id,
    title,
    description,
    color,
    created_at,
    event_start,
    event_end,
  }) {
    try {
      await client('calendar_events').insert({
        id,
        user_id,
        calendar_id,
        title,
        description,
        color,
        created_at,
        event_start,
        event_end,
      });
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
	}

  async updateCalendarEvent({
		event_id,
		user_id,
		title,
		description,
		color,
		event_start,
		event_end
	}) {
		try {

      let itemsToUpdate = {};
      if (user_id) {
        itemsToUpdate = { ...itemsToUpdate, user_id };
      }
      if (title) {
        itemsToUpdate = { ...itemsToUpdate, title };
      }
      if (description) {
        itemsToUpdate = { ...itemsToUpdate, description };
      }
      if (color) {
        itemsToUpdate = { ...itemsToUpdate, color };
      }
      if (event_start) {
        itemsToUpdate = { ...itemsToUpdate, event_start };
      }
      if (event_end) {
        itemsToUpdate = { ...itemsToUpdate, event_end };
      }
      
      console.log(itemsToUpdate);
      await client('calendar_events').update(itemsToUpdate).where('id', '=', event_id);
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
	}

  async deleteCalendarEvent(event_id) {
    try {
      console.log(event_id);
      await client('calendar_events').where('id', '=', event_id).del();
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
  }

}

export default new CalendarEvent();
