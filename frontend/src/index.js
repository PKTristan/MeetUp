import React from 'react';
//import ReactDOM from 'react-dom';
import * as reactDOMClient from 'react-dom/client';
import *  as sessionActions from './store/session';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { restoreCSRF, csrfFetch } from './store/csrf';
import App from './App';

import configureStore from './store';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

reactDOMClient.createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
