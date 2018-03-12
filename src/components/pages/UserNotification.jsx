import React from "react";
import {apiMethods} from "../Common";
let Config = require('../Global');
let {SubHeader} = require('../SubHeader');

export class UserNotification extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'notification': undefined,
            'is_new_notification': false,
            'unread_list': []
        };
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


    componentWillMount() {
        this.notification()
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
        const {notification, unread_list} = this.state;
        const event = this;
        return (
            <div>
                <SubHeader/>
                <section className="midPart">
                    <div className="container">
                        <div className="whiteBox">
                            <div className="tabMain">
                                <table className="tableMain" width="100%">
                                    <tbody>
                                    {notification && notification['count'] ?
                                        notification['results'].map(function (item, index) {
                                            return (
                                                <tr key={index}
                                                    onClick={() => event.handleNotificationClick(item.id)}>
                                                    <td valign="middle"
                                                        className={"nameField noti-list " + (unread_list.indexOf(item.id) > -1 && item.unread ? "notification" : '') }>
                                                        {item.verb}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td>No Notification available</td>
                                        </tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
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