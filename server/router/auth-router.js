import Express from 'express';
import { body } from 'express-validator';
import Authorization from '../controller/authentication-controller.js';
import TokenService from '../service/token-service.js';
import checkValidation from '../middlewares/check-validation.js';
import checkAccessDenied from '../middlewares/check-access-enied.js';


const router = Express.Router();

router.post(
  '/register/',
  body('login').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 }).trim(),
  body('passwordConfirm').isLength({ min: 6 }).trim(),
  body('email').isEmail().normalizeEmail().trim(),
  checkValidation,
  Authorization.authRegister
);
router.post(
  '/login/',
  body('login').isLength({ min: 6, max: 30 }).trim(),
  body('password').not().isEmpty().trim(),
  Authorization.authLogin
);
router.post('/logout/', Authorization.authLogout);
router.post(
  '/password-reset',
  body('email').isEmail().normalizeEmail().trim(),
  Authorization.authSendPasswordReset
);
router.post(
  '/password-reset/:link',
  body('resetPassword').not().isEmpty().trim(),
  body('resetConfirmPassword').not().isEmpty().trim(),
  Authorization.authPasswordReset
);
router.get('/refresh', Authorization.refreshToken);
router.get('/confirm-email/:link', Authorization.authActiveEmail);


export default router;