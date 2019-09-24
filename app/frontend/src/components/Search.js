"use strict";

import React from 'react';

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangeQuery = this.handleChangeQuery.bind(this);
    }

    // propagate filter value upwards
    handleChangeQuery(e) {
        this.props.onFilterChange(e.target.value);
    }

    render() {
        return (
            <nav className="navbar navbar-light">
                <input className="form-control mr-sm-2" type="search" placeholder="Find an Event ..." aria-label="Search" onChange={this.handleChangeQuery}/>
            </nav>
        );
    }
};

export default Search;