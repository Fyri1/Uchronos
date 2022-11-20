class Calendar {
  addEventCalendar(req, res, next) {
    console.log(req.body); // название ивента, дата( на весь дениь или на промедуток), цвет должен быть , начало и конец 
    res.end('OK');//ok
  }
}

export default new Calendar();
