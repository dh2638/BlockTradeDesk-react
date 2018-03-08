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
                </div>
            </section>
        )
    }
}
