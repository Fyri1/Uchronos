import client from '../client.js';
import ApiError from '../exceptions/api-error.js';

class CalendarEvent {

	async getAllEvents() {
		try {
			const data = await client('calendar_events')
      .select(
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
      .select('id',
				'user_id',
				'calendar_id',
				'title',
				'description',
				'color',
				'created_at',
				'event_start',
				'event_end'
			).where('calendar_id', '=', calendar_id);
    if (data.length === 0) {
      throw ApiError.NotFound('calendar not found');
    }
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
		event_end
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
				event_end
      });
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
	}

}

export default new CalendarEvent();
