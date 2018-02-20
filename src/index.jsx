import React from 'react';
import {render} from 'react-dom';
import {Footer} from './components/Footer'
import {Header} from './components/Header'
import {Main} from './components/Main'


import './static/css/bootstrap.min.css'
import './static/css/font-awesome.min.css'
import './static/css/responsive.css'
import './static/css/style.css'
import 'toastr/build/toastr.css';
import './static/js/custom'

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}
class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = getTokenData();
        this.localData = this.localData.bind(this)

    }

    localData() {
        let data = getTokenData();
        this.setState(data);
        return data;
    }

    render() {
        return (
            <div className="wrapper">
                <Header ref="header" LocalData={this.localData}/>
                <div className="clearfix"/>
                <Main setUserData={() => this.refs.header.afterLogin()}/>
                <Footer/>
            </div>
        )
    }
}

function getTokenData() {
    return {
        user: localStorage.getItem('user_token'),
        last_name: localStorage.getItem('user_last_name'),
        first_name: localStorage.getItem('user_first_name')
    }
}


render(<Index/>, window.document.getElementById('index'));
