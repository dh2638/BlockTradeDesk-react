import React from 'react';
import {apiMethods} from "../Common";

let Config = require('../Global');

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

    getCurrenctRate(code) {
        return this.props.getCurrencyValue(code);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !!nextState['user_currency'];
    }

    userCurrencies(start_date, end_date) {
        const event = this;
        let total = 0;
        getUserCurrencies(start_date, end_date).then(
            data => {
                if (data) {
                    this.setState({user_currency: data});
                    data['results'].map(function (item) {
                        let current_rate = event.getCurrenctRate(item.currency.code);
                        total += item.amount * current_rate;
                    });
                    this.setState({user_total_amount: total})
                }
            },
        );
    }

    totalAmount() {
        const {user_total_amount} = this.state;
        return user_total_amount
    }

    render() {
        const {user_currency, user_total_amount} = this.state;
        const event = this;
        if (user_currency) {
            return (
                <div className="whiteBox secBox">
                    <div className="secTitleMain">
                        <div className="secTitle">Your Portfolio</div>
                        <div className="subTitle">Total Value:
                            <strong>$ {user_total_amount.toLocaleString('en')}</strong></div>
                    </div>
                    <ul className="tableRow">
                        {user_currency['results'].map(function (item, index) {
                            let current_rate = event.getCurrenctRate(item.currency.code);
                            return (<li key={index}>
                                <div className="col-1 coinName">{item.currency.name}</div>
                                <div className="col-2">
                                    <span className="priceTag"> ${current_rate.toLocaleString('en')}</span>{item.amount}
                                </div>
                            </li>)
                        })}

                    </ul>
                </div>
            )
        }
        else {
            return (<div/>)
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