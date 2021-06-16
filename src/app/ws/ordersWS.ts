import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sessionService } from '../ws/sessionWS';

@Injectable()
export class ordersWS {
    constructor(private http: HttpClient,
        private sessionWS: sessionService) { }

        BASE_URL = this.sessionWS.getBaseUrl();// 

    getOrders(params: any) {
        
        const searchParams = {
            params: {
                param1: params[0].order_date,
                param2: params[0].customer_uid,
                param3: params[0].invoice_number,
                param4: params[0].item_uid
            }
        }
        
        return this.http.get(this.BASE_URL + '/allOrders', searchParams).toPromise();
    }


    //------------------------------

    getSummarySales(params: any) {
        
        const searchParams = {
            params: {
                param1: params[0].year,
                param2: params[0].month,
                param3: params[0].customer_uid
            }
        }
        
        return this.http.get(this.BASE_URL + '/summarySales', searchParams).toPromise();
    }

  //------------------------------

  getSummarySalesByDay(params: any) {
        
    const searchParams = {
        params: {
            param1: params[0].year,
            param2: params[0].month,
            param3: params[0].customer_uid
        }
    }
    
    return this.http.get(this.BASE_URL + '/summarySalesByDay', searchParams).toPromise();
}

//------------------------------

getSummarySalesByItem(params: any) {
        
    const searchParams = {
        params: {
            param1: params[0].year,
            param2: params[0].month,
            param3: params[0].customer_uid
        }
    }
    
    return this.http.get(this.BASE_URL + '/summarySalesByItem', searchParams).toPromise();
}
   
 //------------------------------

 getSummaryByOrder(params: any) {
        
    const searchParams = {
        params: {
            param1: params[0].order_date,
            param2: params[0].customer_uid,
            param3: params[0].invoice_number,
            param4: params[0].item_uid,
            param5: params[0].payment_mode
        }
    }
    
    return this.http.get(this.BASE_URL + '/summaryByOrders', searchParams).toPromise();
}

//----------------------------
    getOrderItems(OrderUID: any) {
        //alert('loading data in service - ' + userid[0].value);
        //alert("loading lud service");  
        const searchParams = {
            params: {
                param1: OrderUID[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/allOrderItems', searchParams).toPromise();
    }

    getThisOrder(id: any) {
        //alert('loading data in service - ' + id[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
       // alert('2 loading data in service - ' + id[0].value);
        return this.http.get(this.BASE_URL + '/thisOrder', searchParams).toPromise();
    }

    getThisOrderItem(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/thisOrderItem', searchParams).toPromise();
    }

    getAllItemsForOrder(id: any) {
        //alert('loading data in service - ' + userid[0].value);
        const searchParams = {
            params: {
                param1: id[0].value
            }
        }
        return this.http.get(this.BASE_URL + '/allItemsForOrder', searchParams).toPromise();
    }

    // addOrder
    addOrder(data: any): Observable<any> {
        //alert("in add user");
        return this.http.post(this.BASE_URL + '/addOrder', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

 // addOrder Item
 addOrderItem(data: any): Observable<any> {
    //alert("in add user");
    return this.http.post(this.BASE_URL + '/addOrderItem', data)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        )
}

    // Update Order
    updateOrder(data: any): Observable<any> {
        //alert("In update user");
        return this.http.post(this.BASE_URL + '/updateOrder', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }


        // Update Order Item
        updateOrderItem(data: any): Observable<any> {
            //alert("In update user");
            return this.http.post(this.BASE_URL + '/updateOrderItem', data)
                .pipe(
                    retry(1),
                    catchError(this.errorHandl)
                )
        }
   

    // delete Order
    deleteOrder(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteOrder', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

       // delete Order Item
       deleteOrderItem(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/deleteOrderItem', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

        // delete Order Item for an order
        deleteOrderItemsForOrder(data: any): Observable<any> {
            //alert("inside service;" + data._id);
            return this.http.post(this.BASE_URL + '/deleteOrderItemsForOrder', data)
                .pipe(
                    retry(1),
                    catchError(this.errorHandl)
                )
        }

       // delete Order Item
       postAllOrderItemsToStock(data: any): Observable<any> {
        //alert("inside service;" + data._id);
        return this.http.post(this.BASE_URL + '/postAllOrderItemsToStock', data)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

    // addOrderRefund
 addOrderRefund(data: any): Observable<any> {
    //alert("in add user");
    return this.http.post(this.BASE_URL + '/addOrderRefund', data)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        )
} 

getOrderRefundsForCustomer(id: any) {
    //alert('loading data in service - ' + userid[0].value);
    const searchParams = {
        params: {
            param1: id[0].value
        }
    }
    return this.http.get(this.BASE_URL + '/orderRefundsForCustomer', searchParams).toPromise();
}

thisOrderRefundsForCustomer

   
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