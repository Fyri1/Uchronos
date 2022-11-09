import client from '../client.js';
import ApiError from '../exceptions/api-error.js';

class Token {
  async saveToken(id, refreshToken) {
    try {
      await client('refresh_token').insert({
        user_id: id,
        refresh_token: refreshToken,
      });
    } catch (err) {
      throw err;
    }
  }
  async updateToken(id, refreshToken) {
    try {
      await client('refresh_token')
        .where('user_id', '=', id)
        .update('refresh_token', refreshToken);
    } catch (err) {
      throw err;
    }
  }

  async deleteToken(params, value) {
    try {
      await client('refresh_token').where(params, '=', value).delete();
    } catch (err) {
      throw err;
    }
  }
}
export default new Token();
