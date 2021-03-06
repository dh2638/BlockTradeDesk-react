import React from 'react';
import {history} from "../History";


export class Logout extends React.Component {

    componentDidMount() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_first_name');
        localStorage.removeItem('user_last_name');
        history.push('/');
        window.location.reload();
    }

    render() {
        return (
            <h1 className="loading-text">
                Logging out...
            </h1>
        );
    }
}
