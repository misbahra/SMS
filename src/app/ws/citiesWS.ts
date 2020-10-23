import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';

@Injectable()
export class citiesWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) { }

    BASE_URL = this.sessionWS.getBaseUrl();

    getCities() {
        return this.http.get(this.BASE_URL + '/allCities').toPromise();
    }

   
   getThisCity(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisCity', searchParams).toPromise();
    }

      // add stock
    addCity(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addCity', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update stock
    updateCity(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateCity', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete stock
    deleteCity(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteCity', data)
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