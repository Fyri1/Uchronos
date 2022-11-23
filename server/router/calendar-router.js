import Express from 'express';
import { body } from 'express-validator';
import Users from '../controller/users-controller.js';
import Calendar from '../controller/calendar-controller.js';
import Authorization from '../controller/authentication-controller.js';
import TokenService from '../service/token-service.js';
import checkValidation from '../middlewares/check-validation.js';
import checkAccessDenied from '../middlewares/check-access-enied.js';

const router = Express.Router();


router.post('/event', Calendar.addEventCalendar);


export default router;
