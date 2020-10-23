import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';

@Injectable()
export class statesWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) { }

    BASE_URL = this.sessionWS.getBaseUrl();

    getStates() {
        return this.http.get(this.BASE_URL + '/allStates').toPromise();
    }

   
   getThisState(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisState', searchParams).toPromise();
    }

      // add stock
    addState(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addState', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update stock
    updateState(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateState', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete stock
    deleteState(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteState', data)
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