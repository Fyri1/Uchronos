import User from '../models/User.js';
import ApiError from '../exceptions/api-error.js';
import { validationResult } from 'express-validator';

export default async (req, _res, next) => {
  const { login, password, passwordConfirm, email } = req.body;
  const errors = validationResult(req);
  if (await User.isEqualEmail(email)) {
    errors.errors.push({
      value: email,
      msg: 'Already exist',
      param: 'email',
      location: 'body',
    });
  }
  if (await User.isEqualLogin(login)) {
    errors.errors.push({
      value: login,
      msg: 'Already exist',
      param: 'login',
      location: 'body',
    });
  }
  if (password !== passwordConfirm) {
    errors.errors.push({
      value: 'password',
      msg: 'Passwords do not match',
      param: 'password',
      location: 'body',
    });
  }
  if (!errors.isEmpty()) {
    return next(ApiError.BadRequest('Validation error', errors.array()));
  }
  next();
};
