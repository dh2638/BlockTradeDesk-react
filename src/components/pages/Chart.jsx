import React from "react";
import {apiMethods} from "../Common";
import DarkDotImage from "./../../static/images/dark-dots.svg";
import Config from "../Global";

import moment from "moment";
import Highcharts from "highcharts/highstock";
let {UserTransactions} = require('./UserTransactions');
let {UserCurrency} = require('./UserCurrency');

export class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: false,
            chart_data: false,
            is_draw: false,
            coins_data: undefined,

        };
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    }

    coins_dict() {
        let coins_data = localStorage.getItem('coins_data');
        if (coins_data) {
            coins_data = JSON.parse(coins_data)
        }
        else {
            coins_data = {
                current: {},
                last: {},
                last_date: moment().subtract(30, 'd').utc().format()
            };
            const event = this;
            let data = getcurrencyType().then(function (data) {
                    data['results'].map(function (item) {
                        coins_data['current']['KRAKEN_SPOT_' + item.code + '_USD'] = 0;
                        coins_data['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST'] = 0
                    });
                }
            );
        }
        this.setState({'coins_data': coins_data});
        localStorage.setItem('coins_data', JSON.stringify(coins_data));
    }

    getCoinsRates() {
        let coins_data = localStorage.getItem('coins_data');
        if (!coins_data) {
            coins_data = this.coins_dict();
        }
        else {
            coins_data = JSON.parse(coins_data)
        }
        if (coins_data)
            return coins_data

    }

    getCurrencyAmount(code) {
        const {coins_data} = this.state;
        return coins_data['current']['KRAKEN_SPOT_' + code + '_USD']
    }

    getCurrenciesTypes() {
        const {currencies} = this.state;
        return currencies
    }

    drawGraph(item, chart_data = [], key) {
        let event = this;
        Highcharts.stockChart(item + '-chart', {
            rangeSelector: {
                buttons: [{
                    type: 'second',
                    count: 5,
                    text: 'Live'
                }, {
                    type: 'minute',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'minute',
                    count: 60,
                    text: '1h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1w'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1M'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                inputEnabled: true,
                selected: 3
            },
            title: {
                text: item + ' Price'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                maxZoom: 2 * 1000
            },
            credits: {
                enabled: false
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
                            const {coins_data} = event.state;
                            let x = (new Date()).getTime(), // current time
                                y = coins_data['current'][key];
                            series.addPoint([x, y], true, false);
                        }, 5000);
                    }
                }
            },
        });
        return true
    }

    websocketConfig() {
        const {coins_data} = this.state;
        let event = this;
        let ws = new WebSocket(Config['api']['stream_websocket']);
        ws.onopen = function () {
            ws.send(JSON.stringify({
                "type": "hello",
                "apikey": Config['coin_key'],
                "heartbeat": false,
                "subscribe_data_type": ["trade"],
                "subscribe_filter_symbol_id": Object.keys(coins_data['current'])
            }));
        };
        ws.onclose = function () {
            // websocket is closed.
        };
        ws.onmessage = function (evt) {
            let received_msg = JSON.parse(evt.data);
            if (received_msg['price']) {
                event.setState(prevState => ({
                    coins_data: {
                        ...prevState.coins_data,
                        current: {
                            ...prevState.coins_data.current,
                            [received_msg['symbol_id']]: received_msg['price']
                        }
                    }
                }));
                const {coins_data} = event.state;
                localStorage.setItem('coins_data', JSON.stringify(coins_data));
            }
        };
        window.onbeforeunload = function () {
            ws.close();
        };
    }

    componentWillMount() {
        this.coins_dict();
        this.AllCurrencies();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !nextState['is_draw']
    }

    componentDidUpdate() {
        const {chart_data, currencies, is_draw, coins_data} = this.state;
        let status = false;
        let event = this;
        if (currencies && Object.keys(chart_data).length === currencies.length && !is_draw) {
            currencies.map(function (item) {
                if (chart_data[item.name] && document.getElementById(item.name + '-chart')) {
                    status = event.drawGraph(item.name, chart_data[item.name], "KRAKEN_SPOT_" + item.code + "_USD");
                }
            });
            if (status) {
                this.setState({is_draw: true});
                this.websocketConfig()
            }
        }
    }

    AllCurrencies() {
        let event = this;
        getcurrencyType().then(
            data => {
                if (data) {
                    let currency_type = [];
                    let chart_data = {};
                    data['results'].map(function (item) {
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
                                        coins_data: {
                                            ...prevState.coins_data,
                                            current: {
                                                ...prevState.coins_data.current,
                                                ["KRAKEN_SPOT_" + item.code + "_USD"]: coinrate[coinrate.length - 1]['price_open'],
                                            },
                                            last: {
                                                ...prevState.coins_data.last,
                                                ["KRAKEN_SPOT_" + item.code + "_USD_LAST"]: coinrate[0]['price_open']
                                            }
                                        }
                                    }));
                                    const {coins_data} = event.state;
                                    localStorage.setItem('coins_data', JSON.stringify(coins_data));
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
        ).catch(function () {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_first_name');
            localStorage.removeItem('user_last_name');
            window.location.hash = "#/"
        });
    }

    render() {
        const {currencies, coins_data} = this.state;
        if (coins_data && currencies) {
            return (
                <div>
                    <div className="whiteBox">
                        <div className="whiteBoxHead">
                            <div className="pull-right">
                                <div className="actionMain dropdownSlide">
                                    {currencies.length > 3 &&
                                    <div className="dropClick actionBtn trans">
                                        <img src={"../" + DarkDotImage} alt=""/>
                                    </div>
                                    }
                                    <div className="dropdown_box">
                                        <ul>
                                            {currencies && currencies.map(function (item, index) {
                                                if (index > 2) {
                                                    return (<li key={index}>
                                                        <a className="currency-dropdown darkdots"
                                                           data-type={item.name.toLowerCase()}
                                                           data-code={item.name.toUpperCase()} data-name={item.name}
                                                           data-value={coins_data['current']['KRAKEN_SPOT_' + item.code + '_USD'].toFixed(2)}
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
                                            return (
                                                <li key={index} className={index === 0 ? 'coinTabActive' : ''}
                                                    data-coin={item.name.toLowerCase()}>
                                                    <span>{item.name} </span>
                                                    ${coins_data['current']['KRAKEN_SPOT_' + item.code + '_USD'].toFixed(2)}
                                                </li>
                                            )
                                        }
                                    })}
                                </ul>
                            </div>
                        </div>
                        {currencies && currencies.map(function (item, index) {
                            let amount = 0;
                            if (coins_data['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST']) {
                                amount = 100 - (coins_data['current']['KRAKEN_SPOT_' + item.code + '_USD'] / (coins_data['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST'])) * 100;
                            }
                            return (<div id={item.name.toLowerCase()} key={index} data-coin={item.name.toLowerCase()}
                                         className={'boxInner coinTabBody' + (index === 0 ? ' coinTabActive' : '')}>
                                <div className="priceBoxes">
                                    <div className="priceBox">
                                        <strong>$ {coins_data['current']['KRAKEN_SPOT_' + item.code + '_USD'].toFixed(2)}</strong>
                                        <span>{item.name.toUpperCase()} PRICE</span></div>
                                    <div className="priceBox downArrow">
                                        <strong>{coins_data['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST'] ?
                                            "$ " + coins_data['last']['KRAKEN_SPOT_' + item.code + '_USD_LAST'].toFixed(2) : "Not available"}</strong>
                                        <span>since last month (USD)</span>
                                    </div>
                                    <div className={'priceBox' + (amount > 0 ? ' downArrow' : ' upArrow')}>
                                        <strong>{-amount.toFixed(2)} %</strong> <span>since last month (%)</span></div>
                                </div>
                                <div className="chartMain">
                                    <div id={item.name + "-chart"} className="barChart"/>
                                </div>
                            </div>)
                        })}
                    </div>
                    <UserCurrency ref="amount" getCurrenciesTypes={() => this.getCurrenciesTypes()}
                                  getCurrencyValue={(code) => this.getCurrencyAmount(code)}/>
                    <UserTransactions setAmount={() => this.refs.amount.totalAmount()}/>
                </div>
            )
        }
        else {
            return (<div/>)
        }
    }
}

function getcurrencyType() {
    let API_URL = Config['api']['currency_type'];
    let requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}

function getcurrencyData(code) {
    let API_URL = '/v1/ohlcv/KRAKEN_SPOT_' + code + '_USD/latest?period_id=1HRS&limit=768';
    return apiMethods.coinapi(API_URL)
}

