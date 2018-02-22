import React from "react";
import {apiMethods} from "../Common";
import DarkDotImage from "./../../static/images/dark-dots.svg";

let Config = require('../Global');
let ws = new WebSocket(Config['api']['stream_websocket']);
let moment = require('moment');
let Highcharts = require('highcharts/highstock');

export class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: false,
            chart_data: false,
            status: null,
            is_draw: false,
            coins: this.getCoinsRates()

        };
    }

    coins_dict() {
        return {
            current: {
                KRAKEN_SPOT_BTC_USD: 0,
                KRAKEN_SPOT_LTC_USD: 0,
                KRAKEN_SPOT_ETH_USD: 0,
                KRAKEN_SPOT_DASH_USD: 0,
                KRAKEN_SPOT_XRP_USD: 0,
            },
            last: {
                KRAKEN_SPOT_BTC_USD_LAST: 0,
                KRAKEN_SPOT_LTC_USD_LAST: 0,
                KRAKEN_SPOT_ETH_USD_LAST: 0,
                KRAKEN_SPOT_DASH_USD_LAST: 0,
                KRAKEN_SPOT_XRP_USD_LAST: 0,
            },
            last_date: moment().subtract(30, 'd').utc().format()
        };
    }

    getCoinsRates() {
        let coins_data = localStorage.getItem('coins_data');
        if (!coins_data) {
            coins_data = this.coins_dict();
            localStorage.setItem('coins_data', JSON.stringify(coins_data));
        }
        else {
            coins_data = JSON.parse(coins_data)
        }
        return coins_data

    }

    getCurrencyAmount(code){
        const {coins} = this.state
        return coins['current']['KRAKEN_SPOT_'+code+'_USD']
    }
    drawGraph(item, chart_data = [], key) {
        let event = this;

        Highcharts.stockChart(item + '-chart', {
            rangeSelector: {
                selected: 1
            },
            title: {
                text: item + ' Price'
            },
            series: [{
                name: item,
                data: chart_data,
                tooltip: {
                    valueDecimals: 2
                }
            }],
            chart: {
                events: {
                    load: function () {
                        // set up the updating of the chart each second
                        let series = this.series[0];
                        setInterval(function () {
                            const {coins} = event.state;
                            let x = (new Date()).getTime(), // current time
                                y = coins['current'][key];
                            series.addPoint([x, y], true, false);
                        }, 5000);
                    }
                }
            },

        });
        return true
    }


    componentWillMount() {
        this.AllCurrencies();
        const {coins} = this.state;
        let event = this;
        ws.onopen = function () {
            // Web Socket is connected, send data using send()
            ws.send(JSON.stringify({
                "type": "hello",
                "apikey": Config['coin_key'],
                "heartbeat": false,
                "subscribe_data_type": ["trade"],
                "subscribe_filter_symbol_id": Object.keys(coins['current'])
            }));
        };


        ws.onclose = function () {
            // websocket is closed.
        };

        window.onbeforeunload = function (event) {
            socket.close();
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const {chart_data, currencies, is_draw, coins} = this.state;
        let status = false;
        let event = this;

        if (currencies && Object.keys(chart_data).length === currencies.length && !is_draw) {
            currencies.map(function (item, index) {
                if (chart_data[item.name] && document.getElementById(item.name + '-chart')) {
                    status = event.drawGraph(item.name, chart_data[item.name], "KRAKEN_SPOT_" + item.code + "_USD");
                }
            });
            if (status) {
                this.setState({is_draw: true});
            }
        }
        ws.onmessage = function (evt) {
            let received_msg = JSON.parse(evt.data);
            if (received_msg['price']) {
                event.setState(prevState => ({
                    coins: {
                        ...prevState.coins,
                        current: {
                            ...prevState.coins.current,
                            [received_msg['symbol_id']]: received_msg['price']
                        }
                    }
                }));
                localStorage.setItem('coins_data', JSON.stringify(coins));
            }
        };

    }


    AllCurrencies(start_date, end_date) {
        let event = this;
        getcurrencyType().then(
            data => {
                if (data) {
                    let currency_type = [];
                    let chart_data = {};
                    let reverse = false;
                    data['results'].map(function (item, index) {
                        currency_type.push(item);
                        getcurrencyData(item.code).then(
                            coinrate => {
                                if (coinrate) {
                                    coinrate = coinrate.reverse();
                                    coinrate.map(function (obj) {
                                        if (!(item.name in chart_data)) {
                                            chart_data[item.name] = []
                                        }
                                        chart_data[item.name].push([moment(obj['time_open']).valueOf(), obj['price_open']])
                                    });
                                    event.setState(prevState => ({
                                        coins: {
                                            ...prevState.coins,
                                            current: {
                                                ...prevState.coins.current,
                                                ["KRAKEN_SPOT_" + item.code + "_USD"]: coinrate[coinrate.length - 1]['price_open'],
                                            },
                                            last: {
                                                ...prevState.coins.last,
                                                ["KRAKEN_SPOT_" + item.code + "_USD_LAST"]: coinrate[0]['price_open']
                                            }
                                        }
                                    }));
                                }
                                else {
                                    chart_data[item.name] = []
                                }
                            }
                        );
                    });
                    this.setState({chart_data: chart_data});
                    this.setState({currencies: currency_type});
                }
            }
        ).catch(function (ex) {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_first_name');
            localStorage.removeItem('user_last_name');
            window.location.hash = "#/"
        });
    }


    render() {
        const {chart_data, currencies, status, coins} = this.state;
        return (
            <div className="whiteBox">
                <div className="whiteBoxHead">
                    <div className="pull-right">
                        <div className="actionMain dropdownSlide">

                            <div className="dropClick actionBtn trans">
                                <img src={"../" + DarkDotImage} alt=""/>
                            </div>
                            <div className="dropdown_box">
                                <ul>
                                    {currencies && currencies.map(function (item, index) {
                                        if (index > 2) {
                                            return (<li key={index}>
                                                <a className="currency-dropdown darkdots"
                                                   data-type={item.name.toLowerCase()}
                                                   data-code={item.name.toUpperCase()} data-name={item.name}
                                                   data-value={coins['current']['KRAKEN_SPOT_' + item.code + '_USD']}
                                                   title="Test">{item.name}</a></li>)
                                        }
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="coinList">
                        <ul>
                            {currencies && currencies.map(function (item, index) {
                                if (index < 3) {
                                    return (<li key={index} className={index === 0 ? 'coinTabActive' : ''}
                                                data-coin={item.name.toLowerCase()}>
                                            <span>{item.name}</span>
                                            $ {coins['current']['KRAKEN_SPOT_' + item.code + '_USD']}
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                    </div>
                </div>
                {currencies && currencies.map(function (item, index) {
                    let amount = 0
                    if (coins['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST']) {
                        amount = 100 - (coins['current']['KRAKEN_SPOT_' + item.code + '_USD'] / (coins['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST'])) * 100;
                    }
                    return (<div id={item.name.toLowerCase()} key={index} data-coin={item.name.toLowerCase()}
                                 className={'boxInner coinTabBody' + (index === 0 ? ' coinTabActive' : '')}>
                        <div className="priceBoxes">
                            <div className="priceBox">
                                <strong>$ {coins['current']['KRAKEN_SPOT_' + item.code + '_USD']}</strong>
                                <span>{item.name.toUpperCase()} PRICE</span></div>
                            <div className="priceBox downArrow">
                                <strong>{coins['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST'] ?
                                    "$ " + coins['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST'] : "Not available"}</strong>
                                <span>since last month (USD)</span>
                            </div>
                            <div className={'priceBox' + (amount > 0 ? ' downArrow' : ' upArrow')}>
                                <strong>{-amount.toFixed(2)} %</strong> <span>since last month (%)</span></div>
                        </div>
                        <div className="chartMain">
                            <div id={item.name + "-chart"} className="barChart"></div>
                        </div>
                    </div>)
                })}

            </div>
        )
    }
}

function getAllCurrencies(start_date, end_date) {
    let API_URL = Config['api']['currencies_hour_data'];
    let requestData = {};
    if (start_date && end_date) {
        requestData = {'start_date': start_date, 'end_date': end_date};
    }
    return apiMethods.get(API_URL, requestData, true)
}

function getcurrencyType() {
    let API_URL = Config['api']['currency_type'];
    let requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}

function currentCoinRate(code, time) {
    let API_URL = '/v1/exchangerate/' + code + '/USD';
    if (time) {
        API_URL = API_URL + '?time=' + time
    }
    console.log(API_URL);
    return apiMethods.coinapi(API_URL)
}

function getcurrencyData(code) {
    let API_URL = '/v1/ohlcv/KRAKEN_SPOT_' + code + '_USD/latest?period_id=1HRS&limit=720';
    return apiMethods.coinapi(API_URL)
}

