const apiPath = 'http://localhost:8080/api';

export default {
  loginPath: () => [apiPath, 'auth', 'login'].join('/'),
  registerPath: () => [apiPath, 'auth', 'register'].join('/'),
  logoutPath: () => [apiPath, 'auth', 'logout'].join('/'),
  sendMailResetPassword: () => [apiPath, 'auth', 'password-reset'].join('/'),
  resetPassword: (token) =>
    [apiPath, 'auth', 'password-reset', token].join('/'),
  confirmEmail: (token) => [apiPath, 'auth', 'active', token].join('/'),
};
