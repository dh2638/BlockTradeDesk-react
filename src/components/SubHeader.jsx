import React from "react";


export class SubHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="subHead">
                <div className="container">
                    <div className="buttonMain pull-left">
                        <a className="btn trans" href="#/contact/" title="Help">Help</a>
                    </div>
                    <div className="buttonMain pull-right">
                        <a href="#/dashboard/" className={"btn trans "+(this.props.dashboard? 'active': '')} title="Dashboard"> Dashboard</a>
                        <a href='#/settings/' className={"btn trans "+(this.props.settings? 'active': '')} title="Settings"> Settings</a>
                    </div>
                </div>
            </div>
        )
    }
}