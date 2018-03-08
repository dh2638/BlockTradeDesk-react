import React from "react";
import globalImage from "./../static/images/globle.svg";
import {apiMethods} from "./Common";

let Config = require('./Global');

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.LocalData();
        this.state['notification'] = undefined;
        this.state['is_new_notification'] = false
    }

    updateUserData() {
        this.setState(this.props.LocalData());
    }

    notification() {
        const event = this;
        getNotifications().then(function (data) {
            event.setState({'notification': data});
            let new_notification = false;
            data['results'].map(function (item) {
                if (item.unread) {
                    new_notification = true
                }
            });
            if (new_notification) {
                event.setState({'is_new_notification': true})
            }
        })
    }

    getShortName() {
        const {first_name, last_name} = this.state;
        if (first_name && last_name)
            return first_name.charAt(0) + last_name.charAt(0)
    }

    componentWillMount() {
        const {user} = this.state;
        this.setState(this.props.LocalData());
        if (user) {
            this.notification()
        }
    }

    render() {
        const {user, first_name, last_name, notification, is_new_notification} = this.state;
        return [
            <div key="first" className="topHead">
                <div className="pageTitle"><h1>Blocktrade Desk</h1></div>
                {user &&
                <div className="pull-right headRight">
                    <div className="profile dropdownSlide">
                        <div className="topProfile dropClick">
                            <div className="avatar"><span className="simbole">{this.getShortName()}</span></div>
                            <div className="userName">{first_name} {last_name}</div>
                        </div>
                        <div className="dropdown_box">
                            <ul>
                                <li><a href="#/profile/edit/" title="Edit Profile"> Edit Profile</a></li>
                                <li><a href="#/logout/" title="Logout"> Logout</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="notificationMain dropdownSlide"><span className="dropClick">
                        <img src={globalImage} alt=""/>
                        {is_new_notification && <span className="notiDots"/>}
                    </span>
                        <div className="dropdown_box">
                            <ul>
                                {notification && notification['results'].map(function (item, index) {
                                    return (
                                        <li key={index}><a href="#" data-id={item.id} title={item.verb}>{item.verb}</a>
                                        </li>)
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                }
            </div>,
            <div key="second" className="clearfix"/>,
            <div key="third">
                {user && <div className="subHead">
                    <div className="container">
                        <div className="buttonMain pull-right">
                            <a href="#/dashboard/" className="btn active trans" title="Dashboard"> Dashboard</a>
                            <a href='#/settings/' className="btn trans" title="Settings"> Settings</a>
                        </div>
                    </div>
                </div>
                }
            </div>
        ]
    }
}

function getNotifications() {
    let API_URL = Config['api']['notification_all'];
    const requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}