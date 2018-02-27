import React from 'react';

let {Chart} = require('./Chart');
let {UserTransactions} = require('./UserTransactions');
let {UserCurrency} = require('./UserCurrency');

export class Dashboard extends React.Component {

    render() {
        return (
            <section className="midPart">
                <div className="container">
                    <Chart ref="chart" />
                    <UserCurrency ref="amount" getCurrenciesTypes={() => this.refs.chart.getCurrenciesTypes()}
                                  getCurrencyValue={(code) => this.refs.chart.getCurrencyAmount(code)}/>
                    <UserTransactions setAmount={() => this.refs.amount.totalAmount()} />
                </div>
            </section>
        )
    }
}
