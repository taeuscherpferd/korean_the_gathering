import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { INIT_APP } from 'redux/actions/appActions';
import { store } from 'redux/store';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';


store.dispatch({ type: INIT_APP, payload: null })
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
