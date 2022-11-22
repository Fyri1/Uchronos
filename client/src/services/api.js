import axios from 'axios';

// Проверим в самом начале, есть ли токен в хранилище
const JWTToken = localStorage.getItem('jwt');
const BASE_URL = 'http://localhost:8080';
// Создать инстанс axios
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

function apiSetHeader(name, value) {
  if (value) {
    api.defaults.headers[name] = value;
  }
}

// Если токен есть, то добавим заголовок к запросам
if (JWTToken) {
  apiSetHeader('Authorization', `Bearer ${JWTToken}`);
}

api.interceptors.request.use(
  (config) => {
    // Если пользователь делает запрос и у него нет заголовка с токеном, то...
    // if (!config?.defaults.headers['Authorization']) {
    //   console.log('redirect');
    //   return;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export { apiSetHeader };
