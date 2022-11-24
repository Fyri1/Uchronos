import Express from 'express';
import { body } from 'express-validator';
import Users from '../controller/users-controller.js';
import TokenService from '../service/token-service.js';
import checkValidation from '../middlewares/check-validation.js';
import checkAccessDenied from '../middlewares/check-access-enied.js';

const router = Express.Router();

router.get('/', Users.getAllUsers);
router.delete('/:id', Users.deleteUser);

export default router;
