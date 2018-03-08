import React from "react";
import {apiMethods} from "../Common";
let Config = require('../Global');


export class UserSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency_preference: undefined
        }
    }

    componentWillMount() {
        const event = this
        getcurrencyPreference().then(function (data) {
            event.setState({'currency_preference': data})
        })
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    render() {
        const {currency_preference} = this.state;
        if (currency_preference) {
            return (
                <section className="midPart">
                    <div className="container">
                        <div className="whiteBox">
                            <div className="whiteBoxHead">
                                <div className="pull-right">
                                    <div className="actionMain dropdownSlide">
                                        <div className="dropdown_box">
                                            <ul/>
                                        </div>
                                    </div>
                                </div>
                                <div className="coinList">
                                    <ul>
                                        <li className="coinTabActive" data-coin="bitcoin">
                                            <span>Currency Preference </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div id="bitcoin" data-coin="bitcoin" className="boxInner coinTabBody coinTabActive">
                                <form onSubmit={this.handleSubmit} method="post">
                                    {currency_preference.map(function (item, index) {
                                        return (
                                            <div key={index} className="cur-pre">
                                                <input type="checkbox" defaultChecked={item.is_select } id={item.name}
                                                       value={item.name}/>
                                                <label htmlFor={item.name}>{item.name}</label>
                                                <hr/>
                                            </div>
                                        )
                                    })}
                                    <div className="cur-pre-div inputMain ">
                                        <input id="cur-pre-btn" className="trans submiteBtn" type="submit"
                                               value="Update"/>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </section>
            )
        }
        else {
            return (<div/>)
        }
    }
}
function getcurrencyPreference() {
    let API_URL = Config['api']['currency_preference'];
    let requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}
function setcurrencyPreference() {
    let API_URL = Config['api']['currency_preference'];
    let requestData = {};
    return apiMethods.post(API_URL, requestData, true)
}
