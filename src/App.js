import React, {useContext} from 'react';
import logo from './image/logo.png';
import {CurrencyContext} from './components/ContextProvider/CurrencyContext';
import './App.css';

const App = () => {
  const contextData = useContext(CurrencyContext);
  const {currencyList, inputVal, rate, currency, handleLeftOption, handleRightOption, 
  handleLeftCurrency, handleRightCurrency, handleLeftInput, handleSwitchCurrency,
  getHistoricalRate, fromHistoryTo} = contextData;

  return (
    <div className="App">
      <header>
        <img src={logo} alt="logo" className="logo"/>
        <nav>
          <ul className="nav-unorder">
            <li className="nav-list">Send Money</li>
            <li className="nav-list">Tools</li>
            <li className="nav-list">About</li>
          </ul>
        </nav>
      </header>

      <div>
        <div className="option-area">
          <div className="option-wrapper">
            <label className="title">From</label>
            <div className="option-section">
              <div className="display-left-option" onClick={handleLeftOption}>
                {currencyList.map((content, index) => (
                  <div key={index} className="display-outside-wrapper">
                    <div className="left-flag" value={currency.from}>
                      {content.code === currency.from ? content.emoji : null}
                    </div>
                    <div className="update-option">
                      {content.code === currency.from ? content.name : null}
                      {content.code === currency.from ? " (" + content.code + ")" : null}
                    </div>
                  </div>
                ))}
                <div><img src="https://img.icons8.com/material-outlined/24/000000/expand-arrow--v1.png" id="show-btn-left" alt="expand-btn" onClick={handleLeftOption}/></div>
              </div>
              <div className="left-options-wrapper">
                {currencyList.map((item, index) => (
                  <div key={index} value={item.code} className="country-codes" onClick={(e) => handleLeftCurrency(e)}>
                    <div className="flag">{item.emoji}</div>
                    {item.name}({item.code})
                  </div>
                ))}
              </div>
              <div className="amount-section">
                  <span className="amount-wrapper">
                    <span className="dollar-sign">$</span>
                    <input type="text" id="amount-left" className="amount" onChange={handleLeftInput} value={inputVal} maxLength="15"/>
                  </span>
                  <span className="show-rate">Rate: {rate.leftRate}</span>
              </div>
            </div>
          </div>

          <button className="transfer" id="rotate" onClick={handleSwitchCurrency}></button>

          <div className="option-wrapper">
            <label className="title">To</label>
            <div className="option-section">
              <div className="display-right-option" onClick={handleRightOption}>
                {currencyList.map((content, index) => (
                  <div key={index} className="display-outside-wrapper">
                    <div className="right-flag" value={currency.to}>
                      {content.code === currency.to ? content.emoji : null}
                    </div>
                    <div className="update-option">
                      {content.code === currency.to ? content.name : null}
                      {content.code === currency.to ? " (" + content.code + ")" : null}
                    </div>
                  </div>
                ))}
                <div><img src="https://img.icons8.com/material-outlined/24/000000/expand-arrow--v1.png" id="show-btn-right" alt="expand-btn" onClick={handleRightOption}/></div>
              </div>
              <div className="right-options-wrapper">
                {currencyList.map((item, index) => (
                  <div key={index} value={item.code} className="country-codes" onClick={(e) => handleRightCurrency(e)}>
                    <div className="flag">{item.emoji}</div>
                    {item.name}({item.code})
                  </div>
                ))}
              </div>
              <div className="amount-section">
                <span className="amount-wrapper">
                  <span className="dollar-sign">$</span>
                  <input type="text" id="amount-right" className="amount" value={rate.convertResult} readOnly/>
                </span>
                <span className="show-rate">Rate: {rate.rightRate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="history-rate">
          <h2>Check specfic date historical rate</h2>
          <span className="notice">(Need to click twice)</span>
          <input type="date" className="getDate"/>
          <button type="button" className="check-btn" onClick={getHistoricalRate}>Check Rate</button>
          <p className="show-history-rate-left">1 {fromHistoryTo.from} = {fromHistoryTo.leftRate} {fromHistoryTo.to}</p>
          <p className="show-history-rate-right">1 {fromHistoryTo.to} = {fromHistoryTo.rightRate} {fromHistoryTo.from}</p>
      </div>
      </div>
    </div>
  );
}

export default App;
