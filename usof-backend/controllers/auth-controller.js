import { v4 as uuidv4 } from 'uuid';


class AuthController {
  async Register(req, res, next) {
    try {
      const id = uuidv4();

      res.status(201);
      res.json({ message: "User created successfully, activation link sent", id: id });
    } catch (err) {
      console.log(err);
    }
  }

}

export default new AuthController();
