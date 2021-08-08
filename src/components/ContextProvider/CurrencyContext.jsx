import React, {useState, useEffect} from 'react';
import axios from 'axios';

// create new context object, let other component can subscribe by using useContext
const CurrencyContext = React.createContext();

const CurrencyProvider = (props) => {
    const [currencyList, setCurrencyList] = useState([]);
    const [showList, setShowList] = useState(false);
    const [switchChange, setSwitchChange] = useState(false);
    const [currencies, setCurrencies] = useState([]);
    const [defaultSwitch, setDefaultSwitch] = useState({
        dSwitchLeft: null,
        dSwitchRight: null,
        dSwitchResultL: "",
        dSwitchResultR: ""
    })
    const [inputVal, setInputVal] = useState("100.00");
    const [rate, setRate] = useState({
        leftRate: null,
        rightRate: null,
        convertResult: ""
    })

    const [currency, setCurrency] = useState({
        from: "CAD",
        to: "USD"
    });

    const [switchRate, setSwitchRate] = useState({
        from: "",
        to: "",
        switchLeftRate: null,
        switchRightRate: null,
        switchResultAfter: "",
        switchResultBefore: ""
    })

    const [historyRate, setHistoryRate] = useState([]);

    const [fromHistoryTo, setFromHistoryTo] = useState({
        from: "",
        to: "",
        leftRate: null,
        rightRate: null
    })

    const currencyData = async() => {
        try{
            const sourceData = await axios.get('currency.json');
            const sourceMoney = sourceData.data[0].currencies;
            setCurrencyList(sourceMoney);
        }catch(err){
            console.log(err)
        }
    }

    const defaultRate = async() => {
        try{
            const fetchSource = await axios.get(`http://api.currencylayer.com/live?access_key=${process.env.REACT_APP_API_KEY}`);
            const fetchResult = fetchSource.data.quotes;
            const defaultInput = document.querySelector("#amount-left").getAttribute("value")
            const defaultRateUSD = fetchResult.USDUSD;
            const defaultRateCAD = fetchResult.USDCAD;
            setRate({
                leftRate: (defaultRateUSD/ defaultRateCAD).toFixed(5),
                rightRate: (defaultRateCAD/ defaultRateUSD).toFixed(5),
                convertResult: (defaultInput * (defaultRateUSD/ defaultRateCAD)).toFixed(3)
            })
            setDefaultSwitch({
                dSwitchLeft: (defaultRateUSD/ defaultRateCAD).toFixed(5),
                dSwitchRight: (defaultRateCAD/ defaultRateUSD).toFixed(5),
                dSwitchResultL: (defaultInput * (defaultRateUSD/ defaultRateCAD)).toFixed(3),
                dSwitchResultR: (defaultInput * (defaultRateCAD/ defaultRateUSD)).toFixed(3)
            })
            let newArr = [];
            // Iterate through an object (with array destructure)
            Object.entries(fetchResult).forEach(([key, value]) => {
                newArr.push([`${key.slice(3)}`, value]);
                setCurrencies(newArr)
            })
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        currencyData();
        defaultRate();
    },[])

    const convertRate = (val) => {
        let leftCurrency = document.querySelector(".left-flag").getAttribute('value');
        let rightCurrency = document.querySelector(".right-flag").getAttribute('value');
        for(let i = 0; i < currencies.length; i++){
            for(let j = 0; j < currencies.length; j++){
                if(leftCurrency === currencies[i][0] && rightCurrency === currencies[j][0]){
                    let leftRate = currencies[i][1];
                    let rightRate = currencies[j][1];
                    let resultLeftRate = parseFloat(rightRate/ leftRate).toFixed(5);
                    let resultRightRate = parseFloat(leftRate/ rightRate).toFixed(5);
                    let finalAmount = val * resultLeftRate;
                    setRate({
                        leftRate: resultLeftRate,
                        rightRate: resultRightRate,
                        convertResult: finalAmount.toFixed(3)
                    })
                    let switchAmountAfter = val * resultRightRate;
                    let switchAmountBefore = val * resultLeftRate;
                    setSwitchRate({
                        from: leftCurrency,
                        to: rightCurrency,
                        switchLeftRate: resultLeftRate,
                        switchRightRate: resultRightRate,
                        switchResultAfter: switchAmountAfter.toFixed(3),
                        switchResultBefore: switchAmountBefore.toFixed(3)
                    })
                }
            }
        }
    } 

    const handleLeftOption = () => {
        setShowList(!showList);
        const getHideShow = document.querySelector('.left-options-wrapper');
        let btnImg = document.querySelector("#show-btn-left");
        const showRateLeft = document.querySelector(".show-history-rate-left");
        const showRateRight = document.querySelector(".show-history-rate-right");
        if(showList){
            btnImg.setAttribute('src', "https://img.icons8.com/windows/18/000000/delete-sign.png");
            getHideShow.classList.add('showLeft');
            showRateLeft.classList.remove("show-rate");
            showRateRight.classList.remove("show-rate");
        }else{
            btnImg.setAttribute('src', "https://img.icons8.com/material-outlined/24/000000/expand-arrow--v1.png");
            getHideShow.classList.remove('showLeft');
            window.addEventListener('mouseup', ()=>{
                getHideShow.classList.remove('showLeft');
                btnImg.setAttribute('src', "https://img.icons8.com/material-outlined/24/000000/expand-arrow--v1.png");
            })
        }
    }

    const handleRightOption = () => {
        setShowList(!showList);
        const getHideShow = document.querySelector('.right-options-wrapper');
        let btnImg = document.querySelector("#show-btn-right");
        const showRateLeft = document.querySelector(".show-history-rate-left");
        const showRateRight = document.querySelector(".show-history-rate-right");
        if(showList){
            btnImg.setAttribute('src', "https://img.icons8.com/windows/18/000000/delete-sign.png");
            getHideShow.classList.add('showRight');
            showRateLeft.classList.remove("show-rate");
            showRateRight.classList.remove("show-rate");
        }else{
            btnImg.setAttribute('src', "https://img.icons8.com/material-outlined/24/000000/expand-arrow--v1.png");
            getHideShow.classList.remove('showRight')
            window.addEventListener('mouseup', ()=>{
                getHideShow.classList.remove('showRight')
                btnImg.setAttribute('src', "https://img.icons8.com/material-outlined/24/000000/expand-arrow--v1.png");
            })
        }
    }

    const handleLeftCurrency = async(e) => {
        await setCurrency({ 
            ...currency,
            from: e.target.getAttribute('value')
        })   
        let currencyVal = document.querySelector("#amount-left").getAttribute('value');
        convertRate(currencyVal);
    }

    const handleRightCurrency = async(e) => {
        await setCurrency({ 
            ...currency,
            to: e.target.getAttribute('value')
        });
        let currencyVal = document.querySelector("#amount-left").getAttribute('value');
        convertRate(currencyVal);
    }

    const handleLeftInput = (e) => {
        setInputVal(parseFloat(e.target.value).toFixed(2));
        convertRate(e.target.value)
    }
    
    const handleSwitchCurrency = () => {
        setSwitchChange(!switchChange);
        const arrow = document.querySelector("#rotate");
        if(!switchChange){
            setCurrency({
                from: switchRate.to ? switchRate.to : "USD",
                to: switchRate.from ? switchRate.from : "CAD"
            })
            setRate({
                leftRate: switchRate.switchRightRate ? switchRate.switchRightRate : defaultSwitch.dSwitchRight,
                rightRate: switchRate.switchLeftRate ? switchRate.switchLeftRate : defaultSwitch.dSwitchLeft,
                convertResult: switchRate.switchResultAfter ? switchRate.switchResultAfter : defaultSwitch.dSwitchResultR
            })
            arrow.style.transform = "rotate(180deg)"
            arrow.style.transition = ".5s"
        }else{
            setCurrency({
                from: switchRate.from ? switchRate.from : "CAD",
                to: switchRate.to ? switchRate.to : "USD"
            })
            setRate({
                leftRate: switchRate.switchLeftRate ? switchRate.switchLeftRate : defaultSwitch.dSwitchLeft,
                rightRate: switchRate.switchRightRate ? switchRate.switchRightRate : defaultSwitch.dSwitchRight,
                convertResult: switchRate.switchResultBefore ? switchRate.switchResultBefore : defaultSwitch.dSwitchResultL
            })
            arrow.style.transform = "rotate(0deg)"
            arrow.style.transition = ".5s"
        }
    }

    const getHistoricalRate = async() => {
        const chooseDate = document.querySelector('.getDate').value;
        const historyRates = await axios.get(`http://api.currencylayer.com/historical?access_key=${process.env.REACT_APP_API_KEY}&date=${chooseDate.split("-")[0]}-${chooseDate.split("-")[1]}-${chooseDate.split("-")[2]}`);
        const historyResult = historyRates.data.quotes;
        const showRateLeft = document.querySelector(".show-history-rate-left");
        const showRateRight = document.querySelector(".show-history-rate-right");
        let leftCurrency = document.querySelector(".left-flag").getAttribute('value');
        let rightCurrency = document.querySelector(".right-flag").getAttribute('value');
        let newArr = [];
        Object.entries(historyResult).forEach(([keys, values]) => {
            newArr.push([`${keys.slice(3)}`, values])
            setHistoryRate(newArr)
        })
        for(let i = 0; i < historyRate.length; i++){
            for(let j = 0; j < historyRate.length; j++){
                if(leftCurrency === historyRate[i][0] && rightCurrency === historyRate[j][0]){
                    let leftRate = historyRate[i][1];
                    let rightRate = historyRate[j][1];
                    let resultLeftRate = parseFloat(rightRate/ leftRate).toFixed(5);
                    let resultRightRate = parseFloat(leftRate/ rightRate).toFixed(5);
                    setFromHistoryTo({
                        from: leftCurrency,
                        to: rightCurrency,
                        leftRate: resultLeftRate,
                        rightRate: resultRightRate
                    })
                }
            }
        }
            showRateLeft.classList.add("show-rate");
            showRateRight.classList.add("show-rate");
    }

    return (
        // provide values to decendant consumer that using useContext
        <CurrencyContext.Provider 
            value={{
            currencyList, inputVal, rate, currency, handleLeftOption, handleRightOption,
            handleLeftCurrency, handleRightCurrency, handleLeftInput, handleSwitchCurrency,
            getHistoricalRate, fromHistoryTo}}>
            {props.children}
        </CurrencyContext.Provider>
    )
}

export {CurrencyProvider, CurrencyContext}
