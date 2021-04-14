import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from './sessionWS';


@Injectable()
export class appdataWS {
    constructor(private http: HttpClient, 
                private sessionWS: sessionService) { }

      BASE_URL = this.sessionWS.getBaseUrl();//  
      
    getAD() {
        return this.http.get(this.BASE_URL + '/allAD').toPromise();
    }

   
   getThisAD(id: any) {
        //alert('loading data in service - ' + id[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisAD', searchParams).toPromise();
    }

      // add GL
    addAD(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addAD', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update GL
    updateAD(data: any): Observable<any> {
        //alert("In update user");
        const searchParams = {
            params: {
                param1: data
            }
        }
        return this.http.post(this.BASE_URL + '/updateAD', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }



    // delete GL
    deleteAD(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteAD', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

        // add Image
        addImage(data: any): Observable<any> {
            //alert("in add user");
            return this.http.post(this.BASE_URL + '/addImage', data)
                .pipe(
                    retry(1),
                    catchError(this.errorHandl)
                )
        }


         // update Image
         updateImage(data: any): Observable<any> {
            //alert("in add user");
            return this.http.post(this.BASE_URL + '/updateImage', data)
                .pipe(
                    retry(1),
                    catchError(this.errorHandl)
                )
        }
    
          // add Image
          deleteImageFile(data: any): Observable<any> {
            alert("in deleteImageFile - Deleting image : " + data);
            const deleteKey = {
                    param1: data
                }
            
            return this.http.post(this.BASE_URL + '/deleteImageFile', deleteKey)
                .pipe(
                    retry(1),
                    catchError(this.errorHandl)
                )
        }

         // delete Image
         deleteImage(data: any): Observable<any> {
            
            return this.http.post(this.BASE_URL + '/deleteImage', data)
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