import jwt from 'jsonwebtoken';
import ApiError from '../exceptions/api-error.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  generateTokensResetPassword(payload) {
    const resetToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15d',
    });
    return resetToken;
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      throw ApiError.TokenKiller(
        "token invalid, probably you haven't logged into your account for a long time"
      );
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      throw ApiError.UnauthorizedError('Authorization pleas');
    }
  }
}

export default new TokenService();
