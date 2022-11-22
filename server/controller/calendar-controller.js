import ApiError from '../exceptions/api-error.js';
import TokenService from '../service/token-service.js';

class Calendar {
  addEventCalendar(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      TokenService.validateAccessToken(token);
      console.log(req.body);
      res.end('OK');
    } catch (e) {
      next(e);
    }
  }
}

export default new Calendar();
