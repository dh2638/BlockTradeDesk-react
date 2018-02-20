import React from 'react';
import {history} from "../History";
import {apiMethods} from "../Common";

var Config = require('../Global');


export class PasswordChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            old_password: '',
            confirm_password: '',
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
        const {confirm_password, password, old_password} = this.state;
        if (confirm_password && password && old_password) {
            change_password(old_password, password).then(
                data => {
                    if (data) {
                        history.push('/dashboard/');
                    }
                },
            );
        }
    }

    render() {
        const {password, confirm_password, old_password, submitted} = this.state;
        return (
            <div className="loginMid">
                <div className="loginBox">
                    <div className="loginInner">
                        <div className="loginTitle">Change your password</div>
                        <form onSubmit={this.handleSubmit} method="post">
                            <div className={'inputMain' + (submitted && !old_password ? ' has-error' : '')}>
                                <input id="id_old_password" name="old_password" className="inputBox" type="password"
                                       placeholder="Old Password *" value={old_password} onChange={this.handleChange}/>
                                <span className="passIcon"></span>
                            </div>
                            {submitted && !password && <div className="help-block">Password is required.</div>}
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
                                <input className="trans submiteBtn" type="submit" value="Change Password"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


function change_password(old_password, password) {
    const API_URL = Config['api']['change_pasword'];
    const requestData = JSON.stringify({old_password, password});
    return apiMethods.post(API_URL, requestData, true)
}
