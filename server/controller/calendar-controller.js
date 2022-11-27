import ApiError from '../exceptions/api-error.js';
import TokenService from '../service/token-service.js';
import Calendar from '../models/Calendar.js';
import CalendarEvent from '../models/CalendarEvent.js';
import { v4 as uuidv4 } from 'uuid';

class CalendarController {

  async getAllCalendars(req, res, next) {
    // const token = req.headers.authorization.split(' ')[1];
    try {
      // TokenService.validateAccessToken(token);

      const data = await Calendar.getAllCalendars();

      res.status(200);
      res.json({
        massage: 'Got all caledars!',
        data
      });
    } catch (e) {
      console.log("pizda calendary: getAllCalendars")
      next(e);
    }
  }

  async getAllCalendarsForUser(req, res, next) {
    // const token = req.headers.authorization.split(' ')[1];
    try {
      // TokenService.validateAccessToken(token);
      const { user_id } = req.params;
      const data = await Calendar.getAllCalendarsForUserId(user_id);

      res.status(200);
      res.json({
        massage: 'Got all caledars for user!',
        data
      });
    } catch (e) {
      console.log("pizda calendary: getAllCalendarsForUser " + e)
      next(e);
    }
  }

  async getAllEventsForCalendar(req, res, next) {
    // const token = req.headers.authorization.split(' ')[1];
    try {
      // TokenService.validateAccessToken(token);
      const { calendar_id } = req.params;
      console.log("pizdos");
      console.log(calendar_id);

      const data = await CalendarEvent.getAllEventsForCalendarId(calendar_id);

      res.status(200);
      res.json({
        massage: 'Got all events for calendar!',
        data,
      });
    } catch (e) {
      next(e);
    }
  }

  async addCalendar(req, res, next) {
    // const token = req.headers.authorization.split(' ')[1];
    try {
      // TokenService.validateAccessToken(token);
      const { user_id } = req.params;
      console.log(req.body);

      const { title, description } = req.body;
      const id = uuidv4();
      const created_at = new Date().toISOString().replace(/T.*$/, '');
      await Calendar.addCalendar({ id, user_id, title, description, created_at });

      res.status(200);
      res.json({ massage: "calendar created successfully" });
    } catch (e) {
      console.log("pizda calendary: addCalendar " + e)
      next(e);
    }
  }

  async addCalendarEvent(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const userData = TokenService.validateAccessToken(token);
      const { calendar_id } = req.params;
      console.log(req.body);

      const { title, description, color, event_start, event_end } = req.body;
      const id = uuidv4();
      const created_at = new Date().toISOString().replace(/T.*$/, '');
      await CalendarEvent.addCalendarEvent({ id, user_id: userData.id, calendar_id, title, description, color, created_at, event_start, event_end });
      
      res.status(200);
      res.json({ massage: "event created successfully" });
    } catch (e) {
      next(e);
    }
  }

  async updateCalendarEvent(req, res, next) {
    // const token = req.headers.authorization.split(' ')[1];
    try {
      // TokenService.validateAccessToken(token);
      const { event_id } = req.params;
      console.log(req.body);

      const { user_id, title, description, color, event_start, event_end } = req.body;
      await CalendarEvent.updateCalendarEvent({ event_id, user_id, title, description, color, event_start, event_end });
      
      res.status(200);
      res.json({ massage: "event updated successfully" });
    } catch (e) {
      next(e);
    }
  }
}

export default new CalendarController();
