import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
//import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';

@Injectable()
export class imguploadWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) {
        //this.usersApiBaseUrl = environment.API_URL + '/personal/users';
      }

   BASE_URL = this.sessionWS.getBaseUrl();//  
  private usersApiBaseUrl = '';  // URL to web api

 

  imageUpload(imageForm: FormData) {
    //console.log('image uploading');
    //console.log(imageForm);
    return this.http.post(this.BASE_URL + '/uploadImage',imageForm);
   }

   deleteUpload(imageData: any) {
    //console.log('image uploading');
    //console.log(imageForm);
    return this.http.post(this.BASE_URL + '/uploadImage',imageData);
   }
}