import React from 'react';
import {HashRouter as Router} from "react-router-dom";

import {Login} from "./pages/Login";
import {Logout} from "./pages/Logout";

import {Signup} from "./pages/Signup";
import {SignupActive} from "./pages/SignupVerify";
import {ForgetPassword} from "./pages/ForgetPassword";
import {Dashboard} from "./pages/Dashboard";

import {PrivateRoute} from "./PrivatePath";
import {PublicRoute} from "./PublicPath";
import {ForgetPasswordVerify} from "./pages/ForgetPasswordVerify";
import {ForgetPasswordSetPassword} from "./pages/ForgetPasswordSetPassword";
import {ProfileEdit} from "./pages/ProfileEdit";
import {PasswordChange} from "./pages/PasswordChange";

export class Main extends React.Component {

    render() {
        return (
            <Router>
                <div>
                    <PublicRoute exact path="/"  component={() => (<Login setLoginProp={this.props.setUserData} />)} />
                    <PublicRoute exact path="/signup/" component={Signup}/>
                    <PublicRoute exact path="/signup/verify/" component={SignupActive}/>
                    <PublicRoute exact path="/password-reset/" component={ForgetPassword}/>
                    <PublicRoute exact path="/password-reset/verify/" component={ForgetPasswordVerify}/>
                    <PublicRoute exact path="/password-reset/set-password/" component={ForgetPasswordSetPassword}/>

                    <PrivateRoute exact path="/dashboard/" component={Dashboard}/>
                    <PrivateRoute exact path="/logout/" component={() => (<Logout delLoginProp={this.props.setUserData}/>)} />
                    <PrivateRoute exact path="/profile/edit/" component={() => (<ProfileEdit setLoginProp={this.props.setUserData} />)}/>
                    <PrivateRoute exact path="/password-change/" component={PasswordChange}/>
                    {/*<Route component={NotFound}/>*/}
                </div>
            </Router>
        )
    }
}

