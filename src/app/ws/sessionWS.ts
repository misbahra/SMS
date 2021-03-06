import { Component, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


//https://alligator.io/js/introduction-localstorage-sessionstorage/

@Injectable()
export class sessionService {
  constructor() {    }


  lov_selected_values: any = []
  queryParams: any = [];
 
  redirectUrl = "";

  BASE_URL = 'http://localhost:3000';
  //BASE_URL = 'https://mraapp-api.herokuapp.com';

  conUser = JSON.parse(localStorage.getItem('conUser')) || [];

  // to communicate parent and child
  // Observable string sources
  private wsr = new Subject<any>();
  private phase = new Subject<any>();

  // Observable string streams
  // paramReceived$ = this.param.asObservable();

  // Service message commands
  // paramName is the bname of the parameter being sent
  // paramValue is the value of the parameter
  // paramDesc is the parameter decription to be used in the target component
  sendMessage(paramName: string, paramValue: string, paramDesc: string, progName: string) {
    //alert("sendMessage - " + paramValue);
    if (progName == "wsr") { this.wsr.next({ name: paramName, value: paramValue, desc: paramDesc }); }
    else if (progName == "phase") { this.phase.next({ name: paramName, value: paramValue, desc: paramDesc }); }


  }

  setLovDate(data:any)
 {
   this.lov_selected_values = data;
 } 

 getLovDate()
 {
   return this.lov_selected_values;
 }

  clearMessages() {
    this.wsr.next([]);
    this.phase.next([]);
  }

  getMessage(progName: string): Observable<any> {
    if (progName == "wsr") { return this.wsr.asObservable(); }
    else if (progName == "phase") { return this.phase.asObservable(); }
  }

  getBaseUrl() {
     return this.BASE_URL; 
  }

  logout() {
   // console.log('sessiobService.logout : Start  ');
    localStorage.removeItem('conUser');
   
  }

  getConnectedUsers() {
   // console.log('sessiobService.getConnectedUsers : Start  ');
   // console.log(JSON.parse(localStorage.getItem('conUser')) || []);
    return JSON.parse(localStorage.getItem('conUser')) || [];
  }

  // getUsersPrivsForPage(page : any) {
  //   // console.log('sessiobService.getConnectedUsers : Start  ');
  //   // console.log(JSON.parse(localStorage.getItem('conUser')) || []);
  //   var connUser : any = [];
  //   var connUserPrivs : any = [];
  //   connUser =  JSON.parse(localStorage.getItem('conUser')) || [];
  //   connUserPrivs = connUser[0].permissions;
  //   console.log(JSON.stringify(connUserPrivs))
  //  }

  IsLoggedIn() {
   
    return (localStorage.getItem('conUser'));
  }

  setConnectedUsers(user: any) {
    var i: any;
   // load permissions
   
   
    for (i = 0; i < user.length; i++) {
     // console.log('sessiobService.setConnectedUsers : Code is:' + user[i].code);

      if (user[i].code = '1') {

        localStorage.setItem('conUser', JSON.stringify(user[i]));

      }
    }



  }
  // to pass parameters securely instead of url
  deleteParameters() { this.queryParams = []; }

  getParameters() { return this.queryParams; }

  setParameters(params: any) {
    var i: any;
    for (i = 0; i < params.length; i++) {

      //console.log('Received Parameters :' + params[i].Name);
      this.queryParams.push(params[i]);

    }
  }

  //getting users privs
  getUsersPrivs(page: any) {
    var userPermission = this.getConnectedUsers().permissions.find(({ module }) => module === page);
 
    // let userPrivs = { "viewAllowed": userPermission.view_allowed ? "Y" : "N", 
    //                   "editAllowed": userPermission.update_allowed ? "Y" : "N",
    //                   "deleteAllowed": userPermission.delete_allowed ? "Y" : "N",
    //                   "createAllowed":  userPermission.insert_allowed ? "Y" : "N"
    //                  };
    return userPermission;
  }

}