"use strict";

import React from 'react';

import Header from './Header';
import { Footer } from './Footer';

export default class Page extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: ''
        }
    }

    componentDidMount() {
        this.setState({
            title: document.title
        });
    }

    render() {
        return (
            <section>
                <Header title={this.state.title} search={this.props.search} onFilterChange={this.props.onFilterChange}/>
                {this.props.children}
                <Footer />
            </section >

        );
    }
}