import ApiError from '../exceptions/api-error.js';
import User from '../models/User.js';
import TokenService from '../service/token-service.js';

export default (req, res, next) => {
  const { token } = req.params;
  const { role } = TokenService.validateAccessToken(token);
  if (!User.isAdmin(role)) {
    next(ApiError.AccessDenied('This feature is only available for admin'));
  }
  next();
};
