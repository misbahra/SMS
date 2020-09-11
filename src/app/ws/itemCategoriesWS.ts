import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable()
export class ItemCategoriesWS {
    constructor(private http: HttpClient) { }

      BASE_URL = 'http://localhost:4201';
  //BASE_URL = 'https://mraapp-api.herokuapp.com';

    getItemCategories() {
        return this.http.get(this.BASE_URL + '/allItemCategories').toPromise();
    }

   
   getThisItemCategories(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisItemCategory', searchParams).toPromise();
    }

      // add stock
    addItemCategories(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addItemCategories', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update stock
    updateItemCategories(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateItemCategories', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete stock
    deleteItemCategories(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteItemCategories', data)
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