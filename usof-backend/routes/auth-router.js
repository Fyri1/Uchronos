import  loginController  from "../controllers/auth-controller.js";
import express from "express";
import Authorization from '../controllers/authen-controll.js';


const router = express.Router();
router.post('/register', loginController.Register);
router.get('/emailact/:token', loginController.EmailActiv);
router.post('/login', loginController.Login);
router.post('/logout', loginController.Logout);

router.post('/password-reset', loginController.SendPasswordReset);
router.get('/password-reset/:token',loginController.AuthControllerPassResetConfirm);
router.post('/auth/password-reset/:token', loginController.AuthControllerPassResetApply);

  
export default router;

