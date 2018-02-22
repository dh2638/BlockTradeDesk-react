import React from 'react';
import {apiMethods} from "../Common";

let Config = require('../Global');
let moment = require('moment');


export class UserCurrency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_currency: '',
            user_currency_day: 7,
            user_total_amount: 0
        };
    }

    componentWillMount() {
        this.userCurrencies();
    }

    getCurrenctRate(code){
        return this.props.getCurrencyValue(code);
    }

    userCurrencies(start_date, end_date) {
        const event = this;
        getUserCurrencies(start_date, end_date).then(
            data => {
                if (data) {
                    this.setState({user_currency: data});
                    let total = 0;
                    data['results'].map(function (item) {
                        let current_rate = event.getCurrenctRate(item.currency.code);
                        total += item.amount * current_rate
                    });
                    this.setState({user_total_amount: total})
                }
            },
        );
    }

    userCurrenciesClick(day) {
        let dateTo = moment().unix();
        let dateFrom = moment().subtract(day, 'd').unix();
        this.userCurrencies(dateFrom, dateTo);
        this.setState({user_currency_day: day});
    }

    totalAmount() {
        const {user_total_amount} = this.state;
        return user_total_amount
    }

    render() {
        const {user_currency} = this.state;
        const event= this
        if (user_currency) {
            return (
                <div className="whiteBox secBox">
                    {/*{user_currency_day === 7 ?*/}
                    {/*<div className="actionMain dropdownSlide">*/}
                    {/*<div className="dropClick paging actionBtn trans"><span*/}
                    {/*onClick={() => this.userCurrenciesClick(7)}>Past 7 days</span> <img*/}
                    {/*src={require('./../../static/images/dark-dots.svg')} alt=""/></div>*/}
                    {/*<div className="dropdown_box">*/}
                    {/*<ul>*/}
                    {/*<li><a title="Past 30 days" className="darkdots"*/}
                    {/*onClick={() => this.userCurrenciesClick(30)}>Past 30 days</a></li>*/}
                    {/*</ul>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*:*/}
                    {/*<div className="actionMain dropdownSlide">*/}
                    {/*<div className="dropClick paging actionBtn trans"><span*/}
                    {/*onClick={() => this.userCurrenciesClick(30)}>Past 30 days</span> <img*/}
                    {/*src={require('./../../static/images/dark-dots.svg')} alt=""/></div>*/}
                    {/*<div className="dropdown_box">*/}
                    {/*<ul>*/}
                    {/*<li><a title="Past 7 days" className="darkdots"*/}
                    {/*onClick={() => this.userCurrenciesClick(7)}>Past*/}
                    {/*7 days</a></li>*/}
                    {/*</ul>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*}*/}
                    <div className="secTitleMain">
                        <div className="secTitle">Your Portfolio</div>
                        <div className="subTitle">Total Value: <strong>$ {this.totalAmount()}</strong></div>
                    </div>
                    <ul className="tableRow">
                        {user_currency['results'].map(function (item, index) {
                            let current_rate = event.getCurrenctRate(item.currency.code);
                            return (<li key={index}>
                                <div className="col-1 coinName">{item.currency.name}</div>
                                <div className="col-2"><span
                                    className="priceTag">$ {current_rate}</span>{item.amount}
                                </div>
                            </li>)
                        })}

                    </ul>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }
}


function getUserCurrencies(start_date, end_date) {
    let API_URL = Config['api']['user_currencies'];
    if (start_date && end_date) {
        API_URL = API_URL + "?start_date=" + start_date + "&end_date=" + end_date;
    }
    const requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}