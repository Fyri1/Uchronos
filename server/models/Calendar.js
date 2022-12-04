import client from '../client.js';
import ApiError from '../exceptions/api-error.js';

class Calendar {

  async getAllCalendars() {
		try {
			const data = await client('calendars')
      .select(
        'calendars.id',
        'calendars.user_id',
        'calendars.title',
        'calendars.description',
        'calendars.created_at'
      );
    	return data;
		} catch (err) {
			if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
		}
		
	}

	async getAllCalendarsForUserId(user_id) {
		const data = await client('calendars')
      .select('id', 'user_id', 'title', 'description', 'created_at')
      .where('user_id', '=', user_id);
    if (data.length === 0) {
      throw ApiError.NotFound('calendars not found');
    }
    return data;
	}

	async addCalendar({ id, user_id, title, description, created_at }) {
		try {
      await client('calendars').insert({
        id,
        user_id,
        title,
        description,
				created_at
      });
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
	}

  async deleteCalendar(id) {
    try {
      console.log(id);
      await client('calendars').where('id', '=', id).del();
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
  }

}

export default new Calendar();
