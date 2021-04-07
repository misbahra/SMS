import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';


@Injectable()
export class mainWS {
  constructor( 
    private http: HttpClient,
    private sessionWS: sessionService
    ) { }

    BASE_URL = this.sessionWS.getBaseUrl();//  

  getMessage() {
    return this.http.get(this.BASE_URL).toPromise();
  }

  getUsers() {
    return this.http.get(this.BASE_URL + '/users').toPromise();
  }

 
  //getting users from memory
  getUsersFromMem() {
    return this.http.get(this.BASE_URL + '/UsersFromMem').toPromise();
  }

  //getting users of spesific role from memory

  getRoleUsers(appRole: any) {
    //alert('loading data in service - ' + userid[0].value);
    //alert("loading lud service");  
    const searchParams = {
      params: {
        param1: appRole[0].value
      }
    }
    return this.http.get(this.BASE_URL + '/getRoleUser', searchParams).toPromise();
  }


  getThisUser(userid: any) {
    //alert('loading data in service - ' + userid[0].value);
    const searchParams = {
      params: {
        param1: userid[0].value
      }
    }
    return this.http.get(this.BASE_URL + '/thisuser', searchParams).toPromise();
  }


  
  validateLogin(message: any) {
    return this.http.post(this.BASE_URL + '/validateUser', message).toPromise();
  }


  //---
  // POST
  validateLogin2(data: any): Observable<any> {
    console.log('service : ' + data.UserName.toUpperCase());
    return this.http.post(this.BASE_URL + '/validateUser', data)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  //    // POST
  //    validateLogin3(data: any): Observable<any> {
  //   return this.http.post(this.BASE_URL+ '/validateUserRF', data)
  //   .pipe(
  //     retry(1),
  //     catchError(this.errorHandl)
  //   )
  // }



  // Error handling
  errorHandl(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // POST
  LogOut(data: any): Observable<any> {
    return this.http.post(this.BASE_URL + '/LogOut', data)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  // addUser
  AddUser(data: any): Observable<any> {
    //alert("in add user");
    return this.http.post(this.BASE_URL + '/AddUser', data)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  // addUser
  UpdateUser(data: any): Observable<any> {
    //alert("In update user");
    return this.http.post(this.BASE_URL + '/UpdateUser', data)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }


  // deleteUser
  deleteUser(data: any): Observable<any> {
    //alert("inside service;" + data._id);
    return this.http.post(this.BASE_URL + '/DeleteUser', data)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

   // addUser
   addRole(data: any): Observable<any> {
    //alert("In update user");
    return this.http.post(this.BASE_URL + '/addRole', data)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

   // addUser
   deleteRole(data: any): Observable<any> {
    //alert("In update user");
    return this.http.post(this.BASE_URL + '/deleteRole', data)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  getThisUserRoles(userid: any) {
    //alert('loading data in service - ' + userid[0].value);
    const searchParams = {
      params: {
        param1: userid[0].value
      }
    }
    return this.http.get(this.BASE_URL + '/thisuser', searchParams).toPromise();
  }

  getThisUserAllPermissions(userid: any) {
    //alert('loading data in service - ' + userid[0].value);

    const searchParams = {
      params: {
         param1: userid[0].value
      }
    }
    return this.http.get(this.BASE_URL + '/thisUserAllPermissions', searchParams).toPromise();
  }

}
