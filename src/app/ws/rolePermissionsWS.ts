import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from './sessionWS';

@Injectable()
export class rolePermissionsWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) { }

    BASE_URL = this.sessionWS.getBaseUrl();// 

    getAllRolesPermissions(params : any) {
       // alert(params.param1);
        return this.http.get(this.BASE_URL + '/allRolePermissions', params).toPromise();
    }

   
    getAllThisRolePermissions(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/allThisRolePermissions', searchParams).toPromise();
    }

    getThisRolesPermissions(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisRolePermission', searchParams).toPromise();
    }


    // add
    addRolePermission(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addRolePermission', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update 
    updateRolePermission(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateRolePermission', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }


 

    // delete 
    deleteRolePermission(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteRolePermission', data)
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