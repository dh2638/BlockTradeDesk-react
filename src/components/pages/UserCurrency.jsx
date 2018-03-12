import React from "react";
import {apiMethods} from "../Common";
import {utils} from "../UtilMethods";
let Config = require('../Global');

export class UserCurrency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_currency: undefined,
            user_total_amount: undefined,
            is_render: false
        };
    }

    componentWillMount() {
        this.userCurrencies();
    }

    componentWillUpdate() {
        const {user_currency, user_total_amount} = this.state;
        this.CalculateTotal()
    }

    getCurrenctRate(code) {
        return this.props.getCurrencyValue(code);
    }

    userCurrencies(start_date, end_date) {
        const event = this;
        getUserCurrencies(start_date, end_date).then(
            data => {
                this.setState({user_currency: data});
                this.CalculateTotal()
            },
        );
    }

    CalculateTotal() {
        const {user_currency} = this.state;
        const event = this;
        if (user_currency) {
            let total = 0;
            user_currency['results'].map(function (item) {
                let current_rate = event.getCurrenctRate(item.code);
                let amount = item.amount ? item.amount : 0.0;
                total += amount * current_rate;
            });
            this.setState((prevState) => {
                if (prevState.user_total_amount !== total) {
                    return {user_total_amount: total}
                }
            });
            return total
        }
    }

    totalAmount() {
        const {user_total_amount} = this.state;
        if (!(user_total_amount === undefined)) {
            return user_total_amount
        }
        else {
            return this.CalculateTotal()
        }
    }

    render() {
        const {user_currency, user_total_amount} = this.state;
        const event = this;
        if (user_currency && user_total_amount !== undefined) {
            return (
                <div className="whiteBox secBox">
                    <div className="secTitleMain">
                        <div className="secTitle">Your Portfolio</div>
                        <div className="subTitle">Total Value:
                            <strong> ${utils.convertPrice(user_total_amount)}</strong></div>
                    </div>
                    <ul className="tableRow">
                        {user_currency['results'].map(function (item, index) {
                            let current_rate = event.getCurrenctRate(item.code);
                            return (<li key={index}>
                                <div className="col-1 coinName">{item.name}</div>
                                <div className="col-2">
                                    <span className="priceTag"> ${utils.convertPrice(item.amount * current_rate)}</span>
                                    {utils.convertPrice(item.amount)} {item.code}
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