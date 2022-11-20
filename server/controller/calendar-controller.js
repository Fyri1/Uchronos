class Calendar {
  addEventCalendar(req, res, next) {
    console.log(req.body);
    res.end('OK');
  }
}

export default new Calendar();
