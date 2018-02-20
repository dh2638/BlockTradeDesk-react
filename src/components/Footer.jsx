import React from 'react';


export class Footer extends React.Component {
    render(){
        return(
            <footer className="footMain"><span className="copyText">&copy;</span> {(new Date().getFullYear())} Blocktrade Desk </footer>
        )
    }
}

