import React from "react";
import {apiMethods} from "../Common";
import {utils} from "../UtilMethods";


import DarkDotImage from "./../../static/images/dark-dots.svg";

let Config = require('../Global');
let moment = require('moment');


export class UserTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: '',
            transaction_day: localStorage.getItem('transaction_day') ? localStorage.getItem('transaction_day') : 7,
        };
    }

    componentWillMount() {
        const {transaction_day} = this.state;
        this.transactionClick(transaction_day)
    }

    transactions(start_date, end_date) {
        getTransaction(start_date, end_date).then(
            data => {
                if (data) {
                    this.setState({transaction: data});
                }
            },
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !!nextState['transaction']
    }

    transactionClick(day) {
        let dateTo = moment().unix();
        let dateFrom = moment().subtract(day, 'd').unix();
        this.transactions(dateFrom, dateTo);
        this.setState({transaction_day: day});
        localStorage.setItem('transaction_day', day);
    }

    render() {
        const {transaction, transaction_day} = this.state;
        let types = ['SOLD', 'BOUGHT', "SENT", "RECEIVED"];
        let transdict = {'SOLD': [], 'BOUGHT': [], 'SENT': [], 'RECEIVED': []};
        let days_list = [7, 30, 60, 90];
        const event = this;
        if (transaction) {
            transaction['results'].map(function (item) {
                transdict[item.transaction_type].push(item)
            });
            return (<div className="whiteBox secBox" id="transations">
                {<div className="actionMain dropdownSlide">
                    <div className="dropClick paging actionBtn trans">
                    <span data-days={transaction_day}
                          onClick={() => this.transactionClick(transaction_day)}>Past {transaction_day} days</span>
                        <img src={"../" + DarkDotImage} alt=""/></div>
                    <div className="dropdown_box">
                        <ul>
                            {days_list.map(function (item, index) {
                                if (item !== transaction_day) {
                                    return (
                                        <li key={index}>
                                            <a data-days={item} className="darkdots"
                                               onClick={() => event.transactionClick(item)}
                                               title={"Past " + item + " days"}>Past {item} days</a>
                                        </li>)
                                }
                            })}
                        </ul>
                    </div>
                </div>}
                <div className="secTitleMain">
                    <div className="secTitle">Recent Transactions</div>
                </div>
                <ul className="tabList">
                    <li data-type='ALL' className="tabActive">ALL</li>
                    {types.map(function (type, index) {
                        return (<li key={index} data-type={type} className="">{type}</li>)
                    })}
                </ul>
                <div className="tabMain">
                    <div id="ALL" className="tabBody tableRow tabActive">
                        {transaction['results'].length ?
                            <table className="tableMain" width="100%">
                                <tbody>
                                {transaction['results'].map(function (item, index) {
                                    return (<tr key={index}>
                                        <td width="150px" valign="middle"
                                            className="nameField">{item.created}</td>
                                        <td width="100px" valign="middle"><span
                                            className="simbole">{item.currency.code}</span></td>
                                        <td width="200px" valign="middle"><p>{item.currency.name}</p></td>
                                        <td width="200px" valign="middle"><p>{item.transaction_type}</p></td>
                                        <td width="200px" valign="middle"><span
                                            className="table_price">${utils.convertPrice(item.price)}</span><span
                                            className="wasPrice"> {utils.convertPrice(item.amount)} {item.currency.code}</span></td>
                                        <td width="350px" valign="middle"><p>{item.message}</p></td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>
                            :
                            <p className="text-center">No record found</p>
                        }
                    </div>
                    {types.map(function (type, index) {
                        return (
                            <div id={type} key={index}
                                 className="tabBody tableRow">
                                {transdict[type].length ?
                                    <table className="tableMain" width="100%">
                                        <tbody>
                                        {transdict[type].map(function (item, index) {
                                            return (<tr key={index}>
                                                <td width="150px" valign="middle"
                                                    className="nameField">{item.created}</td>
                                                <td width="100px" valign="middle"><span
                                                    className="simbole">{item.currency.code}</span></td>
                                                <td width="200px" valign="middle"><p>{item.currency.name}</p></td>
                                                <td width="200px" valign="middle"><span
                                                    className="table_price">${utils.convertPrice(item.price)}</span><span
                                                    className="wasPrice"> {utils.convertPrice(item.amount)} {item.currency.code}</span></td>
                                                <td width="350px" valign="middle"><p>{item.message}</p></td>
                                            </tr>)
                                        })}
                                        </tbody>
                                    </table>
                                    :
                                    <p className="text-center">No record found</p>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>)
        }
        else {
            return (<div/>)
        }
    }
}


function getTransaction(start_date, end_date) {
    let API_URL = Config['api']['user_transations'];
    if (start_date && end_date) {
        API_URL = API_URL + "?start_date=" + start_date + "&end_date=" + end_date;
    }
    const requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}