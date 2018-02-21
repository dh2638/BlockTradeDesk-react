import React from 'react';
import {apiMethods} from "../Common";
import {history} from "../History";
import {Link} from 'react-router-dom'

let Config = require('../Global');

export class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirm_password: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true});
        const {user} = this.state;
        const {dispatch} = this.props;
        if (user.first_name && user.last_name && user.email && user.password && user.password === user.confirm_password) {
            register(user).then(
                data => {
                    if (data) {
                        localStorage.setItem('user_email', user.email);
                        window.location.hash = "#/signup/verify/"
                        // history.push('/signup/verify/');
                    }
                },
            );
        }
    }


    render() {
        const {user, submitted} = this.state;
        return (
            <div className="loginMid">
                <div className="loginBox">
                    <div className="loginInner">
                        <div className="loginTitle">Signup in to Blocktrade Desk</div>
                        <form onSubmit={this.handleSubmit} method="post">
                            <div className={'inputMain' + (submitted && !user.first_name ? ' has-error' : '')}>
                                <input id="id_first_name" name="first_name" className="inputBox" type="text"
                                       placeholder="First name *" value={user.first_name} onChange={this.handleChange}/>
                            </div>
                            {submitted && !user.first_name && <div className="help-block">First Name is required.</div>}

                            <div className={'inputMain' + (submitted && !user.last_name ? ' has-error' : '')}>
                                <input id="id_last_name" name="last_name" className="inputBox" type="text"
                                       placeholder="Last name *" value={user.last_name} onChange={this.handleChange}/>
                            </div>
                            {submitted && !user.last_name && <div className="help-block">Last Name is required.</div>}
                            <div className={'inputMain' + (submitted && !user.email ? ' has-error' : '')}>
                                <input id="id_email" name="email" className="inputBox" type="email"
                                       placeholder="Email address *" value={user.email} onChange={this.handleChange}/>
                            </div>
                            {submitted && !user.email && <div className="help-block">Email is required.</div>}
                            <div className={'inputMain' + (submitted && !user.password ? ' has-error' : '')}>
                                <input id="id_password" name="password" className="inputBox" type="password"
                                       placeholder="Password *" value={user.password} onChange={this.handleChange}/>
                            </div>
                            {submitted && !user.password && <div className="help-block">Password is required.</div>}
                            <div
                                className={'inputMain passwField' + (submitted && !user.confirm_password || user.password !== user.confirm_password ? ' has-error' : '')}>
                                <input id="id_confirm_password" name="confirm_password" className="inputBox"
                                       type="password" placeholder="Confirm password *" value={user.confirm_password}
                                       onChange={this.handleChange}/>
                                <span className="passIcon"/>
                            </div>
                            {submitted && !user.confirm_password &&
                            <div className="help-block">Confirm Password is required.</div>}
                            {user.confirm_password && user.password !== user.confirm_password &&
                            <div className="help-block">The both password fields doesn't not match.</div>}
                            <div className="inputMain">
                                <input id="signupform-btn" className="trans submiteBtn" type="submit" value="sign up"/>
                            </div>
                        </form>
                    </div>
                    <div className="loginBottom">Already have an account ?
                        <Link className="trans" to="/" > Sign in</Link>
                    </div>
                </div>
            </div>
        )
    }
}

function register(user) {
    const API_URL = Config['api']['signup'];
    const requestData = JSON.stringify(user);
    return apiMethods.post(API_URL, requestData)
}
