"use strict";

import React from 'react';
import { Card, Button, TextField } from 'react-md';
import { withRouter } from 'react-router-dom';
import { AlertMessage } from './AlertMessage';
import Page from './Page';
import AppDetails from '../components/AppDetails'


/**
 * Component for user signUp
 */
class UserSignup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name : '',
            password : '',
            email : '',
            phone : '',
            location : '',
            emailError : '',
            nameError : '',
            phoneError : '',
            passwordError : ''

        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePhone = this.handleChangePhone.bind(this);
        this.handleChangeLocation = this.handleChangeLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateName = this.validateName.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validatePhone = this.validatePhone.bind(this);
    }

    handleChangeName(value) {
        this.setState(Object.assign({}, this.state, {name: value}));
    }

    handleChangePassword(value) {
        this.setState(Object.assign({}, this.state, {password: value}));
    }

    handleChangeEmail(value) {
        this.setState(Object.assign({}, this.state, {email: value}));
    }

    handleChangePhone(value) {
        this.setState(Object.assign({}, this.state, {phone: value}));
    }

    handleChangeLocation(value) {
        this.setState(Object.assign({}, this.state, {location: value}));
    }

    validateEmail(){
        let email_pattern =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( email_pattern.test(this.state.email) ) {
            this.setState(Object.assign({}, this.state, {emailError: ''}));
        }
        else if (this.state.email === '')
        {
            this.setState(Object.assign({}, this.state, {emailError: 'Email is required'}));
        }
        else
        {
            this.setState(Object.assign({}, this.state, {emailError: 'Invalid Email'}));
        }
    }

    validateName(){
        let name_pattern =  /^[a-zA-Z0-9_]*$/;
        if ( name_pattern.test(this.state.name) ) {
            this.setState(Object.assign({}, this.state, {nameError: ''}));
        }
        else if (this.state.name === '')
        {
            this.setState(Object.assign({}, this.state, {nameError: 'Username is required'}));
        }
        else
        {
            this.setState(Object.assign({}, this.state, {nameError: 'Invalid Username'}));
        }
    }

    validatePassword(){
        let password_pattern =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if ( password_pattern.test(this.state.password) ) {
            this.setState(Object.assign({}, this.state, {passwordError: ''}));
        }
        else if (this.state.password === '')
        {
            this.setState(Object.assign({}, this.state, {passwordError: 'Password is required'}));
        }
        else
        {
            this.setState(Object.assign({}, this.state, {passwordError: 'Weak Password. Requires one lowercase, one uppercase, one special character and minimum 8 length.'}));
        }
    }

    validatePhone(){
        let phone_pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        if ( phone_pattern.test(this.state.phone) || (this.state.phone==='') ) {
            this.setState(Object.assign({}, this.state, {phoneError: ''}));
        }
        else
        {
            this.setState(Object.assign({}, this.state, {phoneError: 'Invalid Phone Number'}));
        }
    }

    handleSubmit(event) {
        event.preventDefault();     // To prevent default submission of the form
        let user = {
            name: this.state.name,
            password: this.state.password,
            email: this.state.email,
            phone: (this.state.phone==='') ? "Not Provided" : this.state.phone,
            location:(this.state.location==='') ? "Not Provided" : this.state.location
        };
        this.props.onSubmit(user);
    }

    render() {
        return (
            <Page>

                <div className="row">

                    <div className="col">
                        <AppDetails />
                    </div>

                    <div className="col">

                        <Card className="md-block-centered loginStyle">
                            <form className="md-grid" onSubmit={this.handleSubmit} onReset={() => this.props.history.goBack()}>


                                <TextField
                                    label="Email"
                                    id="EmailField"
                                    type="email"
                                    className="md-row"
                                    required={true}
                                    value={this.state.email}
                                    error ={this.state.emailError.length !== 0 }
                                    onChange={this.handleChangeEmail}
                                    onBlur={this.validateEmail}
                                    errorText={this.state.emailError}/>

                                <TextField
                                    label="Username"
                                    id="UsernameField"
                                    type="text"
                                    className="md-row"
                                    required={true}
                                    value={this.state.name}
                                    error ={this.state.nameError.length !== 0 }
                                    onChange={this.handleChangeName}
                                    onBlur={this.validateName}
                                    errorText={this.state.nameError}/>


                                <TextField
                                    label="Password"
                                    id="PasswordField"
                                    type="password"
                                    className="md-row"
                                    required={true}
                                    value={this.state.password}
                                    error ={this.state.passwordError.length !== 0 }
                                    onChange={this.handleChangePassword}
                                    onBlur={this.validatePassword}
                                    errorText={this.state.passwordError}/>
                                <TextField
                                    label="Phone"
                                    id="PhoneField"
                                    type="text"
                                    className="md-row"
                                    error ={this.state.phoneError.length !== 0 }
                                    value={this.state.phone}
                                    onChange={this.handleChangePhone}
                                    onBlur={this.validatePhone}
                                    errorText={this.state.phoneError}/>
                                <TextField
                                    label="Location"
                                    id="LocationField"
                                    type="text"
                                    className="md-row"
                                    value={this.state.location}
                                    onChange={this.handleChangeLocation}
                                    errorText="Location is required"/>



                                <Button id="submit" type="submit"
                                        disabled={this.state.emailError.length !== 0 || this.state.nameError.length !== 0 || this.state.phoneError.length !== 0 || this.state.passwordError.length !== 0}
                                        raised primary className="md-cell md-cell--2">Register</Button>
                                <Button id="reset" type="reset" raised secondary className="md-cell md-cell--2">Dismiss</Button>
                                <AlertMessage className="md-row md-full-width" >{this.props.error ? `${this.props.error}` : ''}</AlertMessage>
                            </form>
                        </Card>

                    </div>

                </div>



            </Page>
        );
    }
};

export default withRouter(UserSignup);