import React from "react";
import {apiMethods} from "../Common";

let {SubHeader} = require('../SubHeader');
let Config = require('../Global');

export class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            full_name: '',
            message: '',
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true});
        const {full_name, email, message} = this.state;
        if (full_name && email && message) {
            submitContact(full_name, email, message).then(
                data => {
                    window.location.hash = "#/dashboard/"
                },
            );
        }
    }

    render() {
        const {full_name, email, message, submitted} = this.state;
        return (
            <div>
                <SubHeader/>
                <div className="loginMid">
                    <div className="loginBox">
                        <div className="loginInner">
                            <div className="loginTitle">Contact Us</div>
                            <form onSubmit={this.handleSubmit} method="post">
                                <div className={'inputMain' + (submitted && !full_name ? ' has-error' : '')}>
                                    <input type="text" id="id_full_name" name="full_name"
                                           className="inputBox" placeholder="Full Name *"
                                           onChange={this.handleChange}/>
                                </div>
                                {submitted && !full_name && <div className="help-block">Full Name is required.</div>}
                                <div className={'inputMain' + (submitted && !email ? ' has-error' : '')}>
                                    <input type="email" id="id_email" name="email"
                                           className="inputBox" placeholder="Email *"
                                           onChange={this.handleChange}/>
                                </div>
                                {submitted && !email && <div className="help-block">Email is required.</div>}
                                <div className={'inputMain' + (submitted && !message ? ' has-error' : '')}>
                                    <textarea rows="4" cols="50" id="id_message" name="message"
                                              className="inputBox" placeholder="Message *"
                                              onChange={this.handleChange}/>
                                </div>
                                {submitted && !message && <div className="help-block">Message is required.</div>}
                                <div className="inputMain">
                                    <input type="submit" id="contactform-btn"
                                           className="trans submiteBtn" value="Submit"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function submitContact(full_name, email, message) {
    const API_URL = Config['api']['contact_submit'];
    const requestData = JSON.stringify({full_name, email, message});
    console.log(requestData);
    return apiMethods.post(API_URL, requestData, true)

}