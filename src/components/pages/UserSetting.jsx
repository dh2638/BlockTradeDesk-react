import React from "react";
import {apiMethods} from "../Common";
let Config = require('../Global');

let {SubHeader} = require('../SubHeader');
export class UserSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency_preference: undefined,
            preference: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const event = this;
        const {preference} = this.state;
        getcurrencyPreference().then(function (data) {
            event.setState({'currency_preference': data});
            data.map(function (item) {
                if (item.is_select) {
                    preference.push(item.id);
                    event.setState({prefernce: preference});
                }
            })
        })
    }

    handleChange(e) {
        let value = parseInt(e.target.value);
        const {preference} = this.state;
        let index = preference.indexOf(value);
        if (index > -1) {
            preference.splice(index, 1)
        }
        else {
            preference.push(value)
        }
        this.setState({prefernce: preference});
    }

    handleSubmit(e) {
        e.preventDefault();
        const {preference} = this.state;
        setcurrencyPreference(preference).then(
            data => {
                window.location.hash = "#/dashboard/"
            },
        );
    }

    render() {
        const {currency_preference} = this.state;
        const event = this;
        if (currency_preference) {
            return (
                <div>
                    <SubHeader settings={true}/>
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
                                                    <input type="checkbox" defaultChecked={item.is_select }
                                                           id={item.name}
                                                           value={item.id} onChange={event.handleChange}/>
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
                </div>
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
function setcurrencyPreference(preference) {
    let API_URL = Config['api']['currency_preference'];
    let requestData = JSON.stringify({'currency': preference});
    return apiMethods.post(API_URL, requestData, true)
}
