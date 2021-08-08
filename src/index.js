import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {CurrencyProvider} from './components/ContextProvider/CurrencyContext';

ReactDOM.render(
  // <React.StrictMode>
  // provide context to App and it's decendant
    <CurrencyProvider>
      <App />
    </CurrencyProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
