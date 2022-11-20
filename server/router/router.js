import Express from 'express';
import { body } from 'express-validator';
import Users from '../controller/users-controller.js';
import Calendar from '../controller/calendar-controller.js';
import Authorization from '../controller/authentication-controller.js';
import TokenService from '../service/token-service.js';
import checkValidation from '../middlewares/check-validation.js';
import checkAccessDenied from '../middlewares/check-access-enied.js';

const router = Express.Router();

router.post(
  '/auth/register/',
  body('login').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 }).trim(),
  body('passwordConfirm').isLength({ min: 6 }).trim(),
  body('email').isEmail().normalizeEmail().trim(),
  checkValidation,
  Authorization.authRegister
);
router.post(
  '/auth/login/',
  body('login').isLength({ min: 6, max: 30 }).trim(),
  body('password').not().isEmpty().trim(),
  Authorization.authLogin
);
router.post('/auth/logout/', Authorization.authLogout);
router.post(
  '/auth/password-reset',
  body('email').isEmail().normalizeEmail().trim(),
  Authorization.authSendPasswordReset
);
router.post(
  '/auth/password-reset/:link',
  body('resetPassword').not().isEmpty().trim(),
  body('resetConfirmPassword').not().isEmpty().trim(),
  Authorization.authPasswordReset
);
router.get('/auth/refresh', Authorization.refreshToken);
router.get('/auth/confirm-email/:link', Authorization.authActiveEmail);

router.post('/calendar/event', Calendar.addEventCalendar);

export default router;
