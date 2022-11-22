export default class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static NotFound(message, errors = []) {
    return new ApiError(404, message, errors);
  }

  static TokenKiller(massage, errors = []) {
    return new ApiError(401, massage, errors);
  }

  static UnauthorizedError() {
    return new ApiError(401, 'You are already authorized');
  }

  static AccessDenied(message, errors = []) {
    return new ApiError(403, message, errors);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static ActiveEmail(message, errors = []) {
    return new ApiError(422, message, errors);
  }

  static UnknowUser(message, errors = []) {
    return new ApiError(422, message, errors);
  }

  static IncorrectData(message, errors = []) {
    return new ApiError(422, message, errors);
  }
}
