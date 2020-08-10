import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable()
export class luWS {
    constructor(private http: HttpClient) { }

      //BASE_URL = 'http://localhost:4201';
  BASE_URL = 'https://mraapp-api.herokuapp.com';

    getLUH() {
        return this.http.get(this.BASE_URL + '/allLUH').toPromise();
    }

    getLUD(luhCode: any) {
        //alert('loading data in service - ' + userid[0].value);
        //alert("loading lud service");

        let searchParams:any = [];
        if (luhCode.length ==1 ){
         searchParams = {
           
            params: {
                param1: luhCode[0].value,
               
            }
        }
    }
    else
    {
         searchParams = {
           
            params: {
                param1: luhCode[0].value,
                param2: luhCode[1].value
            }
        }

    }
           return this.http.get(this.BASE_URL + '/allLUD', searchParams).toPromise();
    }

    getLUDFromDB(luhCode: any) {
        //alert('loading data in service - ' + userid[0].value);
        //alert("loading lud service");  
        const searchParams = {
            params: {
                param1: luhCode[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/allLUDFromDB', searchParams).toPromise();
    }

    getThisLUH(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisLUH', searchParams).toPromise();
    }

    getThisLUD(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisLUD', searchParams).toPromise();
    }
    // addLUH
    addLUH(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/AddLUH', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 // addLUD
 addLUD(data: any): Observable<any> {
    //alert("in add user");
    return this.http.post(this.BASE_URL + '/AddLUD', data)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        )
}

    // Update LUH
    updateLUH(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/UpdateLUH', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }


        // Update LUD
        updateLUD(data: any): Observable<any> {
            //alert("In update user");
            return this.http.post(this.BASE_URL + '/UpdateLUD', data)
                .pipe(
                    retry(1),
                    catchError(this.errorHandl)
                )
        }
   

    // delete LUH
    deleteLUH(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/DeleteLUH', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

       // delete LUD
       deleteLUD(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/DeleteLUD', data)
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

    // load look up data for lists
  async loadAllLUD(id: any) {
    // alert("loading lud comp - " + id);  
     var luhData = [{value:id}]
     let response = await this.getLUD(luhData);
     return response;
    }
   
// check if LUD is freezed
    isLUDFreezed(luhCode: any) {
       
        let searchParams:any = [];
       
         searchParams = {
           
            params: {
                param1: luhCode[0].value,
                param2: luhCode[1].value
            }
        }

   
           return this.http.get(this.BASE_URL + '/isLUDFreezed', searchParams).toPromise();
    }

}