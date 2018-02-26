import React from "react";
import {apiMethods} from "../Common";

let Config = require('../Global');


export class ProfileEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        getname().then(
            data => {
                this.setState({
                    first_name: data['first_name'],
                    last_name: data['last_name']
                });
            },
        );
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true});
        const {first_name, last_name} = this.state;
        if (first_name && last_name) {
            setname(first_name, last_name).then(
                data => {
                    if (data) {
                        localStorage.setItem('user_first_name', first_name);
                        localStorage.setItem('user_last_name', last_name);
                        this.props.setLoginProp();
                        setTimeout(function () {
                            window.location.hash = '#/dashboard/'
                            // history.push('/dashboard/');
                        }, 500);
                    }
                },
            );
        }
    }

    render() {
        const {first_name, last_name, submitted} = this.state;
        return (
            <div className="loginMid">
                <div className="loginBox">
                    <div className="loginInner">
                        <div className="loginTitle">Update Profile</div>
                        <form onSubmit={this.handleSubmit} method="post">
                            <div className={'inputMain' + (submitted && !first_name ? ' has-error' : '')}>
                                <input id="id_first_name" name="first_name" className="inputBox" type="text"
                                       placeholder="First Name *" value={first_name} onChange={this.handleChange}/>
                            </div>
                            {submitted && !first_name && <div className="help-block">First Name is required.</div>}

                            <div className={'inputMain passwField' + (submitted && !last_name ? ' has-error' : '')}>
                                <input id="id_last_name" name="last_name" className="inputBox" type="text"
                                       placeholder="Last Name *" value={last_name} onChange={this.handleChange}/>
                            </div>
                            {submitted && !last_name && <div className="help-block">Last Name is required.</div>}
                            <div className="inputMain">
                                <input id="loginform-btn" className="trans submiteBtn" type="submit"
                                       value="Update Profile"/>
                            </div>
                            <div className="forgotText">Change Password?
                                <a href="#/password-change/" className="trans"> Click Here!</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


function getname() {
    const API_URL = Config['api']['me'];
    const requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}

function setname(first_name, last_name) {
    const API_URL = Config['api']['me'];
    const requestData = JSON.stringify({first_name, last_name});
    return apiMethods.put(API_URL, requestData, true)
}
