import React from 'react';
import {apiMethods} from "../Common";
var Config = require('../Global');
import {history} from "../History";


export class ForgetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
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
        const {email} = this.state;
        if (email) {
            reset_password(email).then(
                data => {
                    if (data) {
                        localStorage.setItem('user_email', (this.state.email));
                        // history.push('/password-reset/verify/');
                        window.location.hash = '#/password-reset/verify/'
                    }
                },
            );
        }
    }

    render() {
        const {email, submitted} = this.state;

        return (
            <div className="loginMid">
                <div className="loginBox">
                    <div className="loginInner">
                        <div className="loginTitle">Reset your password</div>
                        <p className="message"></p>
                        <form onSubmit={this.handleSubmit} method="post">

                            <div className={'inputMain' + (submitted && !email ? ' has-error' : '')}>
                                <input id="id_email" name="email" className="inputBox" type="email"
                                       placeholder="Email *" value={email} onChange={this.handleChange}/>
                            </div>
                            {submitted && !email && <div className="help-block">Email is required.</div>}
                            <div className="inputMain">
                                <input id="passwordresetform-btn" className="trans submiteBtn" type="submit"
                                       value="Reset password"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function reset_password(email) {
    const API_URL = Config['api']['forget_password'];
    const requestData = JSON.stringify({email});
    return apiMethods.post(API_URL, requestData)
}

