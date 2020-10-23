import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';

@Injectable()
export class vendersWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) { }

    BASE_URL = this.sessionWS.getBaseUrl();//  
    
    getVenders() {
        return this.http.get(this.BASE_URL + '/allVenders').toPromise();
    }

   
   getThisVenders(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisVenders', searchParams).toPromise();
    }

      // add stock
    addVenders(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addVenders', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update stock
    updateVenders(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateVenders', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete stock
    deleteVenders(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteVenders', data)
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