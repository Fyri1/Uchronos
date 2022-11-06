import jwt from 'jsonwebtoken';

class TokenService {
    generToken(payload) {
      const accesToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '30d',
      });
      return accesToken;
    }
    validToken(token) {
      try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return userData;
      } catch (e) {
        console.log("PIZDA POST Login catch " + e);
      }
    }
    generResetPasswordToken(payload) {
      const resetToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
      });
      return resetToken;
    }
}
export default new TokenService();