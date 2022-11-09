import jwt from 'jsonwebtoken';
import ApiError from '../exceptions/api-error.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15s',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30s',
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
      throw ApiError.TokenKiller("token invalid, probably you haven't logged into your account for a long time");
    }
  }

  validateAccessToken(token) {
    console.log(token);
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      throw ApiError.TokenKiller('token invalid, authorization repeat pleas');
    }
  }
}

export default new TokenService();
