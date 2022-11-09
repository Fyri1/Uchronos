export default class Guest {
  constructor() {
    this.guest = true;
  }
  isAdmin() {
    return false;
  }
  isGuest() {
    return this.guest;
  }
}
