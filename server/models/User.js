import client from '../client.js';
import ApiError from '../exceptions/api-error.js';

class User {
  constructor() {
    this.guest = false;
  }

  async findUserId(id) {
    const data = await client('users')
      .select('id', 'login', 'email', 'active', 'created_at')
      .where('id', '=', id);
    if (data.length === 0) {
      throw ApiError.NotFound('user not found');
    }
    return data[0];
  }

  async getAllUsers() {
    // ya tak ponimau ti eto spizdil iz usofa ibo zapros hyinya
    // const data = await client('users')
    //   .join('roles', 'users.id', '=', 'roles.user_id')
    //   .select(
    //     'users.id',
    //     'users.login',
    //     'users.full_name',
    //     'users.email',
    //     'users.profile_pic',
    //     'users.rating',
    //     'roles.role'
    //   );
    const data = await client('users')
      .select(
        'users.id',
        'users.login',
        'users.email',
        'users.password',
        'users.link_event',
        'users.active',
        'users.created_at'
      );
    return data;
  }

  async saveUser({ id, login, password, email, link, active }) {
    try {
      await client('users').insert({
        id,
        login,
        password,
        email,
        link_event: link,
        active,
      });
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw err;
      }
    }
  }
  async isEqualLogin(login) {
    try {
      const data = await client('users')
        .select({
          name: 'login',
          email: 'email',
        })
        .where('login', '=', login);
      return data.length !== 0;
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        throw new Error(err.code + ': ' + err.message);
      }
    }
  }

  async isEqualEmail(email) {
    try {
      const data = await client('users')
        .select({
          email: 'email',
        })
        .where('email', '=', email);
      return data.length !== 0;
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        throw new Error(err.code + ': ' + err.message);
      }
    }
  }

  async initUser(columnName, value) {
    try {
      const data = await client('users')
        .select('id', 'login', 'password', 'email', 'created_at')
        .where(columnName, '=', value);
      if (data.length === 0) {
        throw ApiError.UnknowUser('User does not exist');
      }
      return { ...data[0] };
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(id, nameColumn, value) {
    console.log(id, nameColumn, value);
    try {
      await client('users').where('id', '=', id).update(nameColumn, value);
    } catch (err) {
      throw err;
    }
  }

  async updateUserDate(id, date) {
    try {
      await client('users').where('id', '=', id).update({
        login: date.login,
        // password: date.password,
        full_name: date.fullName,
        email: date.email,
        profile_pic: date.avatar,
      });
    } catch (err) {
      throw err;
    }
  }

  async dropUser(id) {
    try {
      await client('users').where('id', '=', id).del();
    } catch (err) {
      throw err;
    }
  }
  async logout(id) {
    try {
      await client('users').where('id', '=', id).update('token', null);
    } catch (err) {
      throw err;
    }
  }

  async deleteLink(id) {
    try {
      await client('users').where('id', '=', id).update('link_event', null);
    } catch (err) {
      throw err;
    }
  }

  async setActive(id) {
    try {
      await client('users').where('id', '=', id).update('active', true);
    } catch (err) {
      throw err;
    }
  }

  async setLink(id, link) {
    try {
      await client('users').where('id', '=', id).update('link_event', link);
    } catch (err) {
      throw err;
    }
  }

  async getValue(id, search) {
    const data = await client('users').select(search).where('id', '=', id);
    return { ...data[0] };
  }
}

export default new User();
