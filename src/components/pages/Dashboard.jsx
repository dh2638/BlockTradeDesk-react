import React from "react";

let {Chart} = require('./Chart');
let {UserTransactions} = require('./UserTransactions');
let {UserCurrency} = require('./UserCurrency');
let {SubHeader} = require('../SubHeader');
export class Dashboard extends React.Component {

    render() {
        return (
            <div>
                <SubHeader dashboard={true}/>
                <section className="midPart">
                    <div className="container">
                        <Chart ref="chart"/>
                    </div>
                </section>
            </div>
        )
    }
}
