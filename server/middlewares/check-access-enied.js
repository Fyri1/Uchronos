import ApiError from '../exceptions/api-error.js';
import User from '../models/User.js';
import TokenService from '../service/token-service.js';

export default async (req, _res, next) => {
  try {
    if (req.method === 'DELETE' && req.route.path === '/users/:id/:token') {
      const { id, token } = req.params;
      const tokenDats = TokenService.validateAccessToken(token);
      if (id !== tokenDats.id) {
        next(ApiError.AccessDenied('Access denied'));
      }
    } else {
      const token = req.params.token;
      if (!token) {
        next(ApiError.UnauthorizedError());
      }
      const { id } = TokenService.validateAccessToken(token);
      const userToken = await User.getValue(id, 'token');
      if (userToken.token !== token) {
        next(ApiError.UnauthorizedError());
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};
