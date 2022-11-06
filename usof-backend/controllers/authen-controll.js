import jwt from 'jsonwebtoken';
import TokenService from '../service/tokenServ.js';

class Authorization {
    async authActiveEmail(req, res, next) {
        try {
          const { token } = req.params;
          const tokenData = TokenService.validToken(token);
          await User.saveUser(tokenData);
          res.status(201);
          res.json({
            massage: ' creating account blyad',
          });
        } 
        catch (err) {
          next(err);
        }
      }

}
export default Authorization;