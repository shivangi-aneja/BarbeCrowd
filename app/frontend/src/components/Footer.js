"use strict";

import React from 'react';

/**
 *  Common footer for the application
 */
class PlainFooter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section>
                <div style={{height: "50px" }}/>
                <footer className="sticky-footer fixed-bottom bg-wood bc bottom-frame " style={{"backgroundColor": "#000000"}} >
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                        <span>Copyright &copy; BarbeCrowd {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </footer>
            </section>
        );
    }
}

export const Footer = PlainFooter;