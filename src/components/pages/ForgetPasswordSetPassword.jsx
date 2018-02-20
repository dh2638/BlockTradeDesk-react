import React from 'react';
import {history} from "../History";
import {apiMethods} from "../Common";

var Config = require('../Global');


export class ForgetPasswordSetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirm_password: '',
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
        const {confirm_password, password, cache_email} = this.state;
        let email = cache_email ? cache_email : this.state.email;
        if (confirm_password && password) {
            forget_set_password(email, password, confirm_password).then(
                data => {
                    if (data) {
                        history.push('/');
                    }
                },
            );
        }
    }

    render() {
        const {password, confirm_password, submitted, cache_email} = this.state;
        let email = cache_email ? cache_email : this.state.email;

        return (
            <div className="loginMid">
                <div className="loginBox">
                    <div className="loginInner">
                        <div className="loginTitle">Reset your password</div>
                        <form onSubmit={this.handleSubmit} method="post">
                            {!cache_email &&
                            <div className={'inputMain' + (submitted && !email ? ' has-error' : '')}>
                                <input id="id_email" name="email" className="inputBox" type="email"
                                       placeholder="Email address *" value={email} onChange={this.handleChange}/>
                            </div>
                            }
                            {submitted && !email && <div className="help-block">Email is required.</div>}

                            <div className={'inputMain' + (submitted && !password ? ' has-error' : '')}>
                                <input id="id_password" name="password" className="inputBox" type="password"
                                       placeholder="Password *" value={password} onChange={this.handleChange}/>
                                <span className="passIcon"></span>
                            </div>
                            {submitted && !password && <div className="help-block">Password is required.</div>}
                            <div
                                className={'inputMain passwField' + (submitted && !confirm_password || password !== confirm_password ? ' has-error' : '')}>
                                <input id="id_confirm_password" name="confirm_password" className="inputBox"
                                       type="password" placeholder="Confirm password *" value={confirm_password}
                                       onChange={this.handleChange}/>
                                <span className="passIcon"></span>
                            </div>
                            {submitted && !confirm_password &&
                            <div className="help-block">Confirm Password is required.</div>}
                            {confirm_password && password !== confirm_password &&
                            <div className="help-block">The both password fields doesn't not match.</div>}

                            <div className="inputMain">
                                <input className="trans submiteBtn" type="submit" value="Reset Password"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


function forget_set_password(email, password, confirm_password) {
    const API_URL = Config['api']['forget_password_set_password'];
    const requestData = JSON.stringify({email, password});
    return apiMethods.post(API_URL, requestData)
}
