import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from './sessionWS';

@Injectable()
export class salWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) { }

    BASE_URL = this.sessionWS.getBaseUrl();// 

    getSalHeader() {
        return this.http.get(this.BASE_URL + '/allSalHeader').toPromise();
    }

    getsalDetails(sal_header_uid: any) {
        //alert('loading data in service - ' + userid[0].value);
        //alert("loading lud service");

        let searchParams:any = [];
        if (sal_header_uid.length ==1 ){
         searchParams = {
           
            params: {
                param1: sal_header_uid[0].value,
               
            }
        }
    }
    else
    {
         searchParams = {
           
            params: {
                param1: sal_header_uid[0].value,
                param2: sal_header_uid[1].value
            }
        }

    }
           return this.http.get(this.BASE_URL + '/allSalDetails', searchParams).toPromise();
    }

    getThisSalHeader(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisSalHeader', searchParams).toPromise();
    }

    getThisSalDetail(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisSalDetails', searchParams).toPromise();
    }
    // addLUH
    addSalHeader(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/AddSalHeader', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 // addLUD
 addSalDetails(data: any): Observable<any> {
    //alert("in add user");
    return this.http.post(this.BASE_URL + '/AddSalDetails', data)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        )
}

    // Update LUH
    updateSalHeader(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/UpdateSalHeader', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }


        // Update LUD
        updateSalDetails(data: any): Observable<any> {
            //alert("In update user");
            return this.http.post(this.BASE_URL + '/UpdateSalDetails', data)
                .pipe(
                    retry(1),
                    catchError(this.errorHandl)
                )
        }
   

    // delete LUH
    deleteSalHeader(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/DeleteSalHeader', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

       // delete LUD
       deleteSalDetails(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/DeleteSalDetails', data)
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