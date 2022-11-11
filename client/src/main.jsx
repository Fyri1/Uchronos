import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import store from './slices/index.js';
import { Provider } from 'react-redux';
import './input.css';
import './i18next.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fullback="loading">
      <Provider store={store}>
        <App />
      </Provider>
    </React.Suspense>
  </React.StrictMode>
);
