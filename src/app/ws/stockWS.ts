import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';

@Injectable()
export class stockWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) { }

    BASE_URL = this.sessionWS.getBaseUrl();// 

    getStock() {
        return this.http.get(this.BASE_URL + '/allStock').toPromise();
    }

   
   getThisStock(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisStock', searchParams).toPromise();
    }

      // add stock
    addStock(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addStock', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update stock
    updateStock(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateStock', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete stock
    deleteStock(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteStock', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }


     // delcrease stock
     decreaseSoldStock(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/decreaseStockSold', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

    // increase stock
    increaseSoldStock(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/increaseStockSold', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

    
     // get summary  stock

     getSummaryStock() {
        return this.http.get(this.BASE_URL + '/summaryStock').toPromise();
    }

     // get summary  stock for order

     getSummaryStockForOrder() {
        return this.http.get(this.BASE_URL + '/summaryStockForOrder').toPromise();
    }

    
     
   // get stock related to an item   
    getItemStock(id: any) {
    //alert('loading data in service - ' + userid[0].value);
    const searchParams = {
        params: {
            param1: id[0].value
        }
    }
    return this.http.get(this.BASE_URL + '/thisItemStock', searchParams).toPromise();
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