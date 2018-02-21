import React from 'react';
import {history} from "../History";
import {apiMethods} from "../Common";

var Config = require('../Global');


export class ForgetPasswordVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            email: '',
            submitted: false,
            cache_email: localStorage.getItem('user_email') ? localStorage.getItem('user_email') : ''

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
        const {code, cache_email} = this.state;
        let email = cache_email ? cache_email : this.state.email;

        if (code && email) {
            signup_active(email, code).then(
                data => {
                    if (data) {
                        window.location.hash = '#/password-reset/set-password/'
                        // history.push('/password-reset/set-password/');
                    }
                },
            );
        }
    }

    render() {
        const {code, cache_email, submitted} = this.state;
        let email = cache_email ? cache_email : this.state.email;
        return (
            <div className="loginMid">
                <div className="loginBox">
                    <div className="loginInner">
                        <div className="loginTitle">Validate Code</div>
                        <form onSubmit={this.handleSubmit} method="post">
                            {!cache_email &&
                            <div className={'inputMain' + (submitted && !email ? ' has-error' : '')}>
                                <input id="id_email" name="email" className="inputBox" type="email"
                                       placeholder="Email address *" value={email} onChange={this.handleChange}/>
                            </div>
                            }
                            {submitted && !email && <div className="help-block">Email is required.</div>}
                            <div className={'inputMain passwField' + (submitted && !code ? ' has-error' : '')}>
                                <input id="id_code" name="code" className="inputBox" type="number"
                                       placeholder="Code *" value={code} onChange={this.handleChange}/>
                            </div>
                            {submitted && !code && <div className="help-block">Code is required.</div>}

                            <div className="inputMain">
                                <input id="loginform-btn" className="trans submiteBtn" type="submit" value="Validate"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


function signup_active(email, code) {
    const API_URL = Config['api']['forget_password_verify'];
    const requestData = JSON.stringify({email, code});
    return apiMethods.post(API_URL, requestData)
}
