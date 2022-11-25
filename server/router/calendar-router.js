import Express from 'express';
import { body } from 'express-validator';
import Users from '../controller/users-controller.js';
import CalendarController from '../controller/calendar-controller.js';
import TokenService from '../service/token-service.js';
import checkValidation from '../middlewares/check-validation.js';
import checkAccessDenied from '../middlewares/check-access-enied.js';

const router = Express.Router();

router.get('/', CalendarController.getAllCalendars);
router.get('/:user_id', CalendarController.getAllCalendarsForUser);
router.post('/:user_id', CalendarController.addCalendar);

router.get('/event/:calendar_id', CalendarController.getAllEventsForCalendar);
router.post('/event/:calendar_id', CalendarController.addCalendarEvent);
router.patch('/event/:event_id', CalendarController.updateCalendarEvent);


export default router;
