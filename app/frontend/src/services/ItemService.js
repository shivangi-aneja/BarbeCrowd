"use strict";

import HttpService from './HttpService';

export default class ItemService {

    constructor(){
    }

    static baseURL() {return "http://localhost:3000/items" }
    static categoryURL() {return "http://localhost:3000/categories" }

    static getCategories(){
        return new Promise((resolve, reject) => {
            HttpService.get(this.categoryURL(), function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
     }

    static getItems(eventID){
       return new Promise((resolve, reject) => {
           HttpService.get(`${this.baseURL()}/${eventID}`, function(data) {
               resolve(data);
           }, function(textStatus) {
               reject(textStatus);
           });
       });
    }

    static deleteItem(eventID, _id) {
        return new Promise((resolve, reject) => {
            HttpService.remove(`${this.baseURL()}/${eventID}/${_id}`, {}, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static createItem(eventID, item) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${this.baseURL()}/${eventID}`, item, function(data) {
                resolve(data);
            }, function(textStatus) {
               reject(textStatus);
            });
        });
    }

    static editItem(eventID, item) {
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${eventID}/${item._id}`, item, function(data) {
                resolve(data);
            }, function(textStatus) {
               reject(textStatus);
            });
        });
    }

    static assignItem(eventID, _id, cost) {
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${eventID}/${_id}/assign`, {cost: cost}, function(data) {
                resolve(data);
            }, function(textStatus) {
               reject(textStatus);
            });
        });
    }

    static unassignItem(eventID, _id) {
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${eventID}/${_id}/unassign`, {}, function(data) {
                resolve(data);
            }, function(textStatus) {
               reject(textStatus);
            });
        });
    }
}