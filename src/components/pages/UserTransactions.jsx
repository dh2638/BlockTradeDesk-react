import React from 'react';
import {apiMethods} from "../Common";

let Config = require('../Global');
let moment = require('moment');
import DarkDotImage from './../../static/images/dark-dots.svg';



export class UserTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: '',
            transaction_day: 7
        };

    }
    componentWillMount() {
        this.transactions();
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
    }

    render() {
        const {transaction, transaction_day} = this.state;
        let sold = false;
        let bought = false;
        if (transaction) {
            transaction['results'].map(function (item) {
                if (item.transaction_type === "SOLD") {
                    sold = true;
                } else if (item.transaction_type === "BOUGHT") {
                    bought = true;
                }
            });
            let total_amount = this.props.setAmount();
            return (<div className="whiteBox secBox" id="transations">
                {transaction_day === 7 ?
                    <div className="actionMain dropdownSlide">
                        <div className="dropClick paging actionBtn trans">
                                <span data-days="7"
                                      onClick={() => this.transactionClick(7)}>Past 7 days</span>
                            <img src={"../"+DarkDotImage} alt=""/></div>
                        <div className="dropdown_box">
                            <ul>
                                <li><a data-days="30" className="darkdots" onClick={() => this.transactionClick(30)}
                                       title="Past 30 days">Past 30 days</a></li>
                            </ul>
                        </div>
                    </div>
                    :
                    <div className="actionMain dropdownSlide">
                        <div className="dropClick paging actionBtn trans">
                                <span data-days="30"
                                      onClick={() => this.transactionClick(30)}>Past 30 days</span>
                            <img src={"../"+DarkDotImage} alt=""/></div>
                        <div className="dropdown_box">
                            <ul>
                                <li><a data-days="7" className="darkdots" onClick={() => this.transactionClick(7)}
                                       title="Past 7 days">Past 7 days</a></li>
                            </ul>
                        </div>
                    </div>
                }
                <div className="secTitleMain">
                    <div className="secTitle">Recent Transaction</div>
                </div>
                <ul className="tabList">
                    <li className="tabActive" data-type="Sold">Sold</li>
                    <li data-type="bought" className="">Bought</li>
                </ul>
                <div className="tabMain">
                    <div id="Sold" className="tabBody tableRow tabActive fadeIndiv">
                        {sold ?
                            <table className="tableMain" width="100%">
                                <tbody>
                                {transaction['results'].map(function (item, index) {
                                        if (item.transaction_type === "SOLD") {
                                            return (<tr key={index}>
                                                <td width="150px" valign="middle" className="nameField">{item.created}</td>
                                                <td width="100px" valign="middle"><span
                                                    className="simbole">{item.currency.code}</span></td>
                                                <td width="350px" valign="middle"><p>{item.currency.name}</p></td>
                                                <td valign="middle"><span className="table_price">${item.price.toLocaleString('en')}</span><span
                                                    className="wasPrice"> {item.amount}</span></td>
                                            </tr>)
                                        }
                                    }
                                )}
                                </tbody>
                            </table>
                            :
                            <p className="text-center">No record found</p>
                        }
                        {sold ?
                            <div className="totleRow">Total Balance <span className="price">$ {total_amount.toLocaleString('en')}</span>
                            </div>
                            : <table className="tableMain" width="100%">
                            </table>
                        }
                    </div>
                    <div id="bought" className="tabBody tableRow ">
                        {bought ?
                            <table className="tableMain" width="100%">
                                <tbody>
                                {transaction['results'].map(function (item, index) {
                                        if (item.transaction_type === "BOUGHT") {
                                            return (<tr key={index}>
                                                <td width="150px" valign="middle" className="nameField">{item.created}</td>
                                                <td width="100px" valign="middle"><span
                                                    className="simbole">{item.currency.code}</span></td>
                                                <td width="350px" valign="middle"><p>{item.currency.name}</p></td>
                                                <td valign="middle"><span className="table_price">${item.price.toLocaleString('en')}</span><span
                                                    className="wasPrice">{item.amount}</span></td>
                                            </tr>)
                                        }
                                    }
                                )}
                                </tbody>
                            </table>
                            :
                            <p className="text-center">No record found</p>
                        }
                        {bought ?
                            <div className="totleRow">Total Balance <span className="price">$ {total_amount.toLocaleString('en')}</span>
                            </div>
                            : <table className="tableMain" width="100%">
                            </table>
                        }
                    </div>
                </div>
            </div>);
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