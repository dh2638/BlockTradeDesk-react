import React from 'react';
import {history} from "../History";
import {apiMethods} from "../Common";
import {Link} from 'react-router-dom'

let Config = require('../Global');


export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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
        const {email, password} = this.state;
        if (email && password) {
            login(email, password).then(
                data => {
                    if (data) {
                        localStorage.setItem('user_token', data.token);
                        localStorage.setItem('user_first_name', data.first_name);
                        localStorage.setItem('user_last_name', data.last_name);
                        this.props.setLoginProp();
                        window.location.hash = "#/dashboard/"
                        // history.push('/dashboard/');
                    }
                },
            );
        }
    }

    render() {
        const {email, password, submitted} = this.state;
        return (
            <div className="loginMid">
                <div className="loginBox">
                    <div className="loginInner">
                        <div className="loginTitle">Sign in to Blocktrade Desk</div>
                        <form onSubmit={this.handleSubmit} method="post">
                            <div className={'inputMain' + (submitted && !email ? ' has-error' : '')}>
                                <input id="id_email" name="email" className="inputBox" type="email"
                                       placeholder="Email address *" value={email} onChange={this.handleChange}/>
                            </div>
                            {submitted && !email && <div className="help-block">Email is required.</div>}

                            <div className={'inputMain passwField' + (submitted && !password ? ' has-error' : '')}>
                                <input id="id_password" name="password" className="inputBox" type="password"
                                       placeholder="Password *" value={password} onChange={this.handleChange}/>
                                <span className="passIcon"/>
                            </div>
                            {submitted && !password && <div className="help-block">Password is required.</div>}

                            <div className="inputMain">
                                <input id="loginform-btn" className="trans submiteBtn" type="submit" value="sign in"/>
                            </div>
                            <div className="forgotText">Forgot email/email or password?
                                <Link to='/password-reset/' className="trans"> Click Here!</Link>
                            </div>
                        </form>
                    </div>
                    <div className="loginBottom">New to Blocktrade Desk?
                        <Link to="/signup/" className="trans"> Sign up now!</Link>
                    </div>
                </div>
            </div>
        )
    }
}


function login(email, password) {
    const API_URL = Config['api']['login'];
    const requestData = JSON.stringify({email, password});
    return apiMethods.post(API_URL, requestData)
}
