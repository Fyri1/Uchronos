import Express from 'express';

import authController from "../controllers/auth-controller.js";


const router = Express.Router();

router.post("/register", authController.Register);


export default router;
