"use strict";

import HttpService from "./HttpService";

export default class UserService {

    constructor() {
    }

    static baseURL() {return "http://localhost:3000/auth"; }

    static register(user) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${UserService.baseURL()}/register`, {
                name: user.name,
                password: user.password,
                email: user.email,
                phone: user.phone,
                location: user.location
            }, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static login(user, pass) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${UserService.baseURL()}/login`, {
                name: user,
                password: pass
            }, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static logout(){
        window.localStorage.removeItem('jwtToken');
    }

    static getCurrentUser() {
        let token = window.localStorage['jwtToken'];
        if (!token) return {};

        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        let _id = JSON.parse(window.atob(base64))._id;
        return {
            _id,
            name: JSON.parse(window.atob(base64)).name,
            email: JSON.parse(window.atob(base64)).email,
            phone: JSON.parse(window.atob(base64)).phone,
            location: JSON.parse(window.atob(base64)).location
        };
    }

    static getProfilePicture() {
        return this.getProfilePictureOfUser(this.getCurrentUser());
    }

    // returns the url of a user's profile picture
    static getProfilePictureOfUser(user) {
        return `${HttpService.apiURL()}/profile/${user._id}.png`;
    }

    static isAuthenticated() {
        return !!window.localStorage['jwtToken'];
    }
}