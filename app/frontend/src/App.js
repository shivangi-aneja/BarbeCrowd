"use strict";

import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import UserService from './services/UserService';
import { HomeView } from './views/HomeView';
import { EventView } from './views/EventView';
import { UserLoginView } from "./views/UserLoginView";
import { UserSignupView } from "./views/UserSignupView";
import { ProfileView } from "./views/ProfileView";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Barbecrowd',
            routes: [
                { render: (props) => {
                    if(UserService.isAuthenticated()) {
                        return (<HomeView {... props} />)
                    }
                    else {
                        return (<Redirect to={'/login'}/>)
                    }} , path: '/', exact: true},
                { render: (props) => {
                    if(UserService.isAuthenticated()) {
                        return (<EventView {... props} />)
                    }
                    else {
                        return (<Redirect to={'/login'}/>)
                    }} , path: '/events/:id'},
                { render: (props) => {
                    if(UserService.isAuthenticated()) {
                        return (<ProfileView {... props} />)
                    }
                    else {
                        return (<Redirect to={'/login'}/>)
                    }} , path: '/me'},
                { component: UserLoginView, path: '/login'},
                { component: UserSignupView, path: '/register'}
            ]
        };
    }

    componentDidMount(){
        document.title = this.state.title;
    }

    render() {
        return(
            <div>
                <Router>
                    <Switch>
                        {this.state.routes.map((route, i) => (<Route key={i} {...route}/>) )}
                    </Switch>
                </Router>
            </div>
        );
    }
}

