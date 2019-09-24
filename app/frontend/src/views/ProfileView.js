"use strict";

import React from 'react';
import Page from '../components/Page';
import ImageUploader from 'react-images-upload';
import UserService from '../services/UserService';
import HttpService from '../services/HttpService';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
 
export class ProfileView extends React.Component {
 
    constructor(props) {
        super(props);
        this.state = {
          user: UserService.getCurrentUser(),
          file: null,
          url: UserService.getProfilePicture(),
          success: null
        };
        this.onDrop = this.onDrop.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
 
    onDrop(picture) {
      let newPic = picture[picture.length-1];
      this.setState(Object.assign({}, this.state, {file: newPic, url: URL.createObjectURL(newPic)}));
    }

    onSubmit() {
      if(this.state.file)
        HttpService.postPicture(`${HttpService.apiURL()}/picture`,this.state.file, success => {
          this.setState(Object.assign({}, this.state, {url: URL.createObjectURL(this.state.file), success: true}));
        }, error => {
          this.setState(Object.assign({}, this.state, {url: UserService.getProfilePicture(), success: false}));
        });
    }


    render() {
        return (
          <Page>

              <div className="container">
                  <div className="row">
                      <div className="col">
                          <div id="content-wrapper" className="d-flex flex-column content-wrap">
                              <div id="content" style={{ margin: "20px 50px" }}>
                                  <img style={{objectFit: "cover"}} src={this.state.url} height="300" width="300"/>
                                  <ImageUploader style={{width: 300}}
                                                 withIcon={true}
                                                 buttonText='Upload'
                                                 onChange={this.onDrop}
                                                 imgExtension={['.jpg', '.gif', '.png']}
                                                 maxFileSize={5242880}
                                                 singleImage={true}
                                  />
                                  <div className="row" style={{width: 300, height: 30, marginLeft: 0}}>
                                      <Button className="col-12" onClick={this.onSubmit} variant="primary">Submit</Button>
                                      <div className="col-8">
                                          {(this.state.success!==null) && <h4 style={{margine: "auto"}}><Badge variant={this.state.success?"success":"danger"}>{this.state.success? "File Uploaded!" : "Error!"}</Badge></h4>}
                                      </div>

                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div>

                              <p id="eventname" className="center eventTableRow text-white text-uppercase"><FontAwesomeIcon icon={faUser}  />User Details</p>

                              <div className="row">
                                  <div className="col-md-6 center profileView text-white">
                                      Username
                                  </div>
                                  <div className="col-md-6 center profileView text-white">
                                      {this.state.user.name}
                                  </div>
                              </div>

                              <div className="row">
                                  <div className="col-md-6 center profileView text-white">
                                     Email
                                  </div>
                                  <div className="col-md-6 center profileView text-white">
                                      {this.state.user.email}
                                  </div>
                              </div>

                              <div className="row">
                                  <div className="col-md-6 center profileView text-white">
                                      Phone
                                  </div>
                                  <div className="col-md-6 center profileView text-white">
                                      {this.state.user.phone}
                                  </div>
                              </div>

                              <div className="row">
                                  <div className="col-md-6 center profileView text-white">
                                      Location
                                  </div>
                                  <div className="col-md-6 center profileView text-white">
                                      {this.state.user.location}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>



          </Page>
        );
    }
}