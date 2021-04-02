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
        return this.http.get(this.BASE_URL + '/allRoles', params).toPromise();
    }

   
    getRolesPermissions(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/allRolePermissions', searchParams).toPromise();
    }

    getThisRolesPermissions(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisRole', searchParams).toPromise();
    }


    // add
    addRolesPermissions(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/AddRole', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 
    // Update 
    updateRolesPermissions(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateRole', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }


 

    // delete 
    deleteRolesPermissions(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteRole', data)
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