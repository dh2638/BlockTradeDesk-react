import React from 'react';
import {history} from "./History";
import {Link} from 'react-router-dom'

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.LocalData();
    }

    afterLogin(){
        this.setState(this.props.LocalData());
    }

    getShortName() {
        const {first_name, last_name} = this.state;
        if (first_name && last_name)
            return first_name.charAt(0) + last_name.charAt(0)
    }

    render() {
        const {user, first_name, last_name} = this.state;
        return [
            <div key="first" className="topHead">
                <div className="pageTitle"><h1>Blocktrade Desk</h1></div>
                {user ?
                    <div className="pull-right headRight">
                        <div className="searchMain">
                            <input className="searchInput" type="text" name="" value=""
                                   placeholder="Search Anything Here...."/>
                            <button className="searchBtn" type="submit">
                                <i className="fa fa-search" aria-hidden="true"/>
                            </button>
                        </div>
                        <div className="profile dropdownSlide">
                            <div className="topProfile dropClick">
                                <div className="avatar"><span className="simbole">{this.getShortName()}</span></div>
                                <div className="userName">{first_name} {last_name}</div>
                            </div>
                            <div className="dropdown_box">
                                <ul>
                                    <li><a onClick={() => { history.push('/profile/edit/') }} title="Edit Profile"> Edit Profile</a></li>
                                    <li><a onClick={() => { history.push('/logout/') }} title="Logout"> Logout</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="notificationMain dropdownSlide"><span className="dropClick">
                        <img src={require('./../static/images/globle.svg')} alt=""/>
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
                    :
                    <div className="pull-right headRight">
                        <ul className="topNav">
                            <li className="dropdownSlide">
                        <span className="dropClick">Our Products
                             <i className="fa fa-chevron-down" aria-hidden="true"/></span>
                                <ul className="dropdown_box">
                                    <li key="1"><a href="#" title="Product 01">Product 01</a></li>
                                    <li key="2"><a href="#" title="Product 02">Product 02</a></li>
                                    <li key="3"><a href="#" title="Product 03">Product 03</a></li>
                                </ul>
                            </li>
                            <li className="dropdownSlide">
                        <span className="dropClick">Help
                            <i className="fa fa-chevron-down" aria-hidden="true"/></span>
                                <ul className="dropdown_box">
                                    <li key="1"><a href="#" title="Test 01">Test 01</a></li>
                                    <li key="2"><a href="#" title="Test 02">Test 02</a></li>
                                    <li key="3"><a href="#" title="Test 03">Test 03</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                }
            </div>,
            <div key="second" className="clearfix"/>,
            <div key="third">
                {user && <div className="subHead">
                    <div className="container">
                        <div className="buttonMain pull-left">
                            <a className="btn trans" href="#" title="MANAGE YOUR DIGITAL CURRENCY">MANAGE
                                YOUR DIGITAL CURRENCY</a></div>
                        <div className="buttonMain pull-right">
                            <a onClick={() => { history.push('/dashboard/') }} className="btn active trans" title="Dashboard"> Dashboard</a>
                            <a href='#' className="btn trans" title="Settings"> Settings</a>
                        </div>
                    </div>
                </div>
                }
            </div>
        ]
    }
}
