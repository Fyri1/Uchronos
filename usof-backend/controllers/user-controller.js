

class UserController {

  async getAllUsers(req, res, next) {
    try {

      res.status(200);
      res.json({ message: "Got user list" });
    } catch (err) {
      console.log(err);
    }
  }

}

export default new UserController();
