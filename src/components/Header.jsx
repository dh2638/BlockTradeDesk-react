import React from "react";
import globalImage from "./../static/images/globle.svg";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.LocalData();
    }

    updateUserData() {
        this.setState(this.props.LocalData());
    }

    getShortName() {
        const {first_name, last_name} = this.state;
        if (first_name && last_name)
            return first_name.charAt(0) + last_name.charAt(0)
    }

    componentWillMount() {
        this.setState(this.props.LocalData())
    }

    render() {
        const {user, first_name, last_name} = this.state;
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
                        <span className="notiDots"/></span>
                        <div className="dropdown_box">
                            <ul>
                                <li key="1"><a href="#" title="Test 01">Test 01</a></li>
                                <li key="2"><a href="#" title="Test 02">Test 02</a></li>
                                <li key="3"><a href="#" title="Test 03">Test 03</a></li>
                                <li key="4" className="view_all"><a href="#">View All Notification</a></li>
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
                            <a href='#' className="btn trans" title="Settings"> Settings</a>
                        </div>
                    </div>
                </div>
                }
            </div>
        ]
    }
}
