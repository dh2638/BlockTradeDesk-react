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
        this.state['unread_list'] = []
    }

    updateUserData() {
        this.setState(this.props.LocalData());
    }

    notification() {
        const event = this;
        getNotifications().then(function (data) {
            event.setState({'notification': data});
            let new_notification = false;
            let unread_list = [];
            data['results'].map(function (item) {
                if (item.unread) {
                    new_notification = true;
                    unread_list.push(item.id)
                }
            });
            event.setState({unread_list: unread_list});
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

    handleNotificationClick(id) {
        const {unread_list} = this.state;
        let index = unread_list.indexOf(id);
        const event = this;
        if (index > -1) {
            mask_as_readNotifications(id).then(function (item) {
                unread_list.splice(index, 1);
                event.setState({unread_list: unread_list})
            })
        }
    }

    render() {
        const {user, first_name, last_name, notification, is_new_notification, unread_list} = this.state;
        const event = this;
        return (
            <div key="first" className="topHead">
                <div className="pageTitle"><h1><a className="headline" href="#/"> Blocktrade Desk</a></h1></div>
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
                        {notification && notification['count'] ?
                            <div className="dropdown_box">
                                <ul>
                                    {notification['results'].map(function (item, index) {
                                        return (
                                            <li key={index}>
                                                <a onClick={() => event.handleNotificationClick(item.id)}
                                                   className={unread_list.indexOf(item.id) > -1 && item.unread ? "notification" : '' }
                                                   data-id={item.id} title={item.verb}>{item.verb}</a>
                                            </li>)
                                    })}
                                </ul>
                            </div> :
                            <div/>
                        }
                    </div>
                </div>
                }
            </div>
        )
    }
}

function getNotifications() {
    let API_URL = Config['api']['notification_all'];
    const requestData = {};
    return apiMethods.get(API_URL, requestData, true)
}
function mask_as_readNotifications(id) {
    let API_URL = Config['api']['notification_set_read'];
    const requestData = JSON.stringify({id});
    return apiMethods.post(API_URL, requestData, true)
}