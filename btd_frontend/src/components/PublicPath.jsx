import React from 'react';
import {Redirect, Route} from 'react-router-dom';

export const PublicRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user_token') ?
            <Redirect to={{pathname: '/dashboard/', state: {from: props.location}}}/> :
            <Component {...props} />
    )}/>
);