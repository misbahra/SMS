import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';


@Injectable()
export class glWS {
    constructor(private http: HttpClient, 
                private sessionWS: sessionService) { }

      BASE_URL = this.sessionWS.getBaseUrl();//  
      
    getGL() {
        return this.http.get(this.BASE_URL + '/allGL').toPromise();
    }

   
   getThisGL(id: any) {
        //alert('loading data in service - ' + id[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisGL', searchParams).toPromise();
    }

      // add GL
    addGL(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addGL', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update GL
    updateGL(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateGL', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete GL
    deleteGL(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteGL', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }


         
     // get summary  GL

     getSummaryGL() {
        return this.http.get(this.BASE_URL + '/summaryGL').toPromise();
    }
     
   // get GL related to an item   
    getVenderGL(id: any) {
    //alert('loading data in service - ' + userid[0].value);
    const searchParams = {
        params: {
            param1: id[0].value
        }
    }
    return this.http.get(this.BASE_URL + '/thisVenderGL', searchParams).toPromise();
}

   // get GL related to an item   
   getThisVenderGLYearly(id: any) {
    //alert('loading data in service - ' + userid[0].value);
    const searchParams = {
        params: {
            param1: id[0].value
        }
    }
    return this.http.get(this.BASE_URL + '/thisVenderGLYearly', searchParams).toPromise();
}

 // get GL related to an item   
 getThisVenderGLFullSum(id: any) {
    //alert('loading data in service - ' + userid[0].value);
    const searchParams = {
        params: {
            param1: id[0].value
        }
    }
    return this.http.get(this.BASE_URL + '/thisVenderGLFullSum', searchParams).toPromise();
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