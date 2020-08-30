import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';

@Injectable()
export class venderAccountsWS {
    constructor(private http: HttpClient, 
        private sessionWS: sessionService) { }

    BASE_URL = this.sessionWS.getBaseUrl();//  'http://localhost:4201';
  //BASE_URL = 'https://mraapp-api.herokuapp.com';

    getVenderAccounts() {
        return this.http.get(this.BASE_URL + '/allVenderAccounts').toPromise();
    }

   
   getThisVenderAccounts(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisVenderAccounts', searchParams).toPromise();
    }

     
   getOneVenderAccounts(id: any) {
   // alert('loading data in service - ' + id[0].value);
    const searchParams = {
        params: {
            param1: id[0].value
        }
    }

    return this.http.get(this.BASE_URL + '/oneVenderAccounts', searchParams).toPromise();
}

      // add stock
    addVenderAccounts(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addVenderAccounts', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update stock
    updateVenderAccounts(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateVenderAccounts', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete stock
    deleteVenderAccounts(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteVenderAccounts', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

    // Error handling
    errorHandl(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

 
}