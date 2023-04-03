import React from 'react';
//import ReactDOM from 'react-dom';
import * as reactDOMClient from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import configureStore from './store';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
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
