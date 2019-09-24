"use strict";

import React from 'react';

/**
 * Brief information about the application. Displayed on login/sign up screen.
 */
class AppDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {

        return (
            <div>
                <div className="center text-white profileView" style={{ marginTop: 40 }} >BarbeCrowd helps you organize barbecue</div>
                <div className="center text-white profileView">parties without any hassle.</div>
                <div className="center text-white loginView" style={{ marginTop: 10 }} >Offers services like organizing food items, </div>
                <div className="center text-white loginView">inviting guests, and much more.</div>
                <div className="center text-white profileView" style={{ marginTop: 20 }}> Join for free.</div>
                <div className="row">
                    <img style={{ margin: "auto", marginTop: 30 }} src={require('../img/bbq.png')} height="25%" width="25%" />
                </div>


            </div>
        );
    }
}

export default AppDetails;