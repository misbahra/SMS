import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ordersWS } from '../../ws/ordersWS';
import { luWS } from '../../ws/luWS';
import { customersWS } from '../../ws/customersWS';
import { Router } from "@angular/router";
import { sessionService } from '../../ws/sessionWS';
import { stockWS } from '../../ws/stockWS';
import * as momentNs from 'moment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { utilWS } from '../../ws/utilWS';
import { CustomerNewComponent } from '../../customers/customer-new/customer-new.component';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';



const moment = momentNs;

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit{
  
  constructor(
    private orderService: ordersWS,
    private luService: luWS,
    private CustomersService: customersWS,
    private router: Router,
    private sessionService: sessionService,
    public stockService: stockWS,
    private fb: FormBuilder,
    private utilService : utilWS,
    public dialog: MatDialog
  ) {
    
  }
  model: any = [];
  stockDataList: any = [];
  stockDataListDisplay: any = [];
  selectedDataList: any = [];
  term: string;
  isBusy = false;
  totalAmount : any = 0;
  quantity : any;
  price : any;
  orderNumber : any = this.utilService.getUID("order_uid");
  orderDate = new Date().toISOString().slice(0, 16);
  vat =0;
  phoneNo = "";

  orderForm: FormGroup;
  resp: any = [];
  submitted = false;
  queryParams: any = [];
  isDisabled = false;
  response: any = [];
  customerList: any = [];
  customerListCompact: any = [];
  paymentTypeList: any = [];
  cardTypeList: any = [];
  orderStatusList: any = [];
  yesNoList: any = [];
  OrderId : any = "";
  dt = new Date();
  orderItems: any = [];
  operation = 1; // 1 for insert , 2 for update
  orderItemsToUodate: any = [];
  dataId = "";
  isItemAddedRemoved = false;
  receivedDate: any;
  @ViewChild("txtSearch") searchField: ElementRef;
  

   rowDataClicked:any = {};
    userPrivs = {"viewAllowed":"N",
                "editAllowed":"N",
                "deleteAllowed":"N",
                "createAllowed":"N"};
   
    style = {
    marginTop: '0px',
    padding:'0px',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
};

  async loadStock() {
    this.isBusy = true;
    let response = await this.stockService.getStock();
    this.stockDataList = response;
    
    // available stocks should be loaded
    this.loadAvailableStock(this.stockDataList);
  
    this.isBusy =  false;
  };

  //load available stock

  async loadAvailableStock(stockData : any) {
    this.stockDataListDisplay = [];
    await stockData.forEach(element => {
      // check if stock is available
     
     if (element.items_count - element.stock_sold > 0 ) {
      this.stockDataListDisplay.push({"stock_uid":element.stock_uid , 
                                      "item_name":element.item_name +
                                      " (" + (element.items_count - element.stock_sold) + ")",
                                      "stock_bar_code" : element.stock_bar_code});
                                    };
                                    });
    
  };


  // select the stock based on 
  selectStock(st_uid: any ) {
    var selectedIndex : any;
    var found = this.stockDataList.find(function(post, index) {
      if(post.stock_uid == st_uid){
        
        selectedIndex = index;
       
        return true;
      }
    });
      //this.selectedDataList.push(found);
      if (this.quantity == null) {this.quantity = 1}
      if (this.price == null ){this.price = found.sales_price }
      var availableStock = this.stockDataList[selectedIndex].items_count -
        this.stockDataList[selectedIndex].stock_sold;

      if ((availableStock - this.quantity) < 0)
      {
        alert("Only " + availableStock + " is available.")}
      else
      { this.stockDataList[selectedIndex].stock_sold += this.quantity;
       //alert(this.stockDataList[selectedIndex].quantity);
       this.isItemAddedRemoved = true;
      this.selectedDataList.push(
      {
      "order_item_uid" : this.utilService.getUID("order_item_uid"),
      "order_uid" : this.orderNumber,
      "item_uid" :  found.item_uid,
      "item_name" : found.item_name,
      "unit_cost_price" : found.items_cost ,
      "unit_tag_price" :  found.sales_price,
      "quantity" :  this.quantity,
      "unit_sale_price" : this.price ,
      "vat" :  0,
      "sales_tax" :  0,
      "withholding_tax" :  0,
      "total_price" :  this.quantity * this.price ,
      "total_price_with_taxes" :  this.quantity * this.price,
      "discount_rate" : Math.floor(((found.sales_price - this.price) * 100 ) / found.sales_price),
      "discount" :  (found.sales_price - this.price) * this.quantity ,
      "order_refund_uid" :  "",
      "stock_uid" : found.stock_uid,
      "posted_to_stock" : "Y",
      "created_by" :  "",
      "created_on" :  Date.now(),
      "modified_by" :  "",
      "modified_on" :  ""
    });


      this.totalAmount += (this.quantity * this.price); 
      this.quantity = 1;
      this.price = null;
      this.loadAvailableStock(this.stockDataList); 
      this.searchField.nativeElement.focus();
  }

    };
 
  deleteStock(index : any ) {
      
      this.totalAmount -= this.selectedDataList[index].total_price; 

      var selectedIndex : any;
      var deletedOrderItem = this.selectedDataList[index];
      var found = this.stockDataList.find(function(post, idx) {
        if(post.stock_uid == deletedOrderItem.stock_uid){
          
          selectedIndex = idx;
         
          return true;
        }
      });
      this.stockDataList[selectedIndex].stock_sold -= deletedOrderItem.quantity; 
      this.loadAvailableStock(this.stockDataList); 
      this.selectedDataList.splice(index , 1);
      this.isItemAddedRemoved = true;
      this.searchField.nativeElement.focus();
  };
  
  ngOnInit() {

    
    this.loadStock();
    this.userPrivs = this.sessionService.getUsersPrivs();

    this.orderForm = this.fb.group({
      id: ['', []],
      order_uid: [this.orderNumber, []],
      customer_uid: ['', []],
      order_date: [this.orderDate, [Validators.required]],
      home_delivery: ['N', []],
      home_delivery_address: ['', []],
      delivered_by: ['', []],
      delivered_on: ['', []],
      order_desc: ['', []],
      payment_mode: ['1', []],
      card_type: ['', []],
      card_number: ['', []],
      card_holder_name: ['', []],
      status: ['1',[]],
      invoice_number: ['',[Validators.required]],
      salesman_uid: ['',[]],
      created_by: ['', []],
      created_on: ['', []],
      modified_by: ['', []],
      modified_on: ['', []]
    }
      // , { validator: this.CheckUserName('UserName') }
    );
     
    this.queryParams = this.sessionService.getParameters();
    // alert('point 1 - ' + this.queryParams[0].order_id);
    // this is the date which was set in the order form  
    this.receivedDate = this.queryParams[0].order_date; 
    //alert(this.receivedDate);
    if (this.queryParams[0].operation == 1) {
     // in case of new order set the received date to the order date field
      this.orderForm.controls.order_date.setValue(new Date(this.receivedDate).toISOString().slice(0, 16)); 
       
       this.operation = 1;
      
    }
     // if operation = 2- update record   
    else if (this.queryParams[0].operation == 2)
    {
      this.operation = 2;
      this.dataId = this.queryParams[0].order_id;
     
      this.loadOrders(this.dataId);
      
    }
    else {this.isDisabled = true;};
  
    this.loadAllLUD('1');
    this.loadAllLUD('2');
    this.loadAllLUD('5');
    this.loadAllLUD('20');
    this.loadAllCustomers();
    
  };

  async loadOrders(orderid: any) {
    //this.isBusy = true;
    //alert('loading data - ' + orderid);
    this.response = await this.orderService.getThisOrder([{value : orderid}]);
    //alert('data - ' + this.response._id);
    this.OrderId = this.response._id;
    this.orderNumber = this.response.order_uid;
    this.response.order_date = this.response.order_date.slice(0, 16);; 
    this.orderForm.patchValue(this.response);
    //this.userForm.disable();
    this.loadOrderItems(this.orderNumber);
  };

  async loadOrderItems(order_uid : any)
  {

    var resp = await this.orderService.getAllItemsForOrder([{value : order_uid}]);
    this.orderItems = resp;
    // save this list for processing the update operation
    this.orderItemsToUodate = resp;
    this.selectedDataList = [];
    this.totalAmount = 0;
    this.orderItems.forEach(found => {
    
    this.totalAmount += found.total_price; 
    
    this.selectedDataList.push(
      {
      "order_item_uid" : found.order_item_uid,
      "order_uid" : found.order_uid,
      "item_uid" :  found.item_uid,
      "item_name" : found.item_name,
      "unit_cost_price" : found.items_cost ,
      "unit_tag_price" :  found.unit_tag_price,
      "quantity" :  found.quantity,
      "unit_sale_price" :found.unit_sale_price ,
      "vat" :  found.vat,
      "sales_tax" :  found.sales_tax,
      "withholding_tax" :  found.withholding_tax,
      "total_price" :  found.total_price ,
      "total_price_with_taxes" :  found.total_price_with_taxes,
      "discount_rate" : found.discount_rate,
      "discount" :  found.discount ,
      "order_refund_uid" :  found.order_refund_uid,
      "stock_uid" : found.stock_uid,
      "posted_to_stock" : found.posted_to_stock,
      "created_by" :  found.created_by,
      "created_on" : found.created_on,
      "modified_by" :  found.modified_by,
      "modified_on" :  found.modified_on
    });
  });

  }

  async loadAllLUD(id: any) {
    //alert("loading lud comp");  
    var luhData = [{value:id}]
    let response = await this.luService.getLUD(luhData);
    if (id=='1'){this.paymentTypeList = response;}
    if (id=='2'){this.cardTypeList = response;}
    if (id=='5'){this.orderStatusList = response;}
    if (id=='20'){this.yesNoList = response;}
    
     //console.log("Data in LUD list " + this.LUDdataList.length );
  };

  async loadAllCustomers() {
    //alert("loading lud comp");  
    
    let response = await this.CustomersService.getCustomers();
    this.customerList = response;

    
     //console.log("Data in LUD list " + this.LUDdataList.length );
  };

    
  // single getter for all form controls to access them from the html
  get fc() { return this.orderForm.controls; }

   
  onCancel() {
    this.sessionService.deleteParameters();
    this.sessionService.setParameters([{ order_date : this.receivedDate }]);
    this.router.navigate(['order']);
    //window.location.href = './order';
  }

  onSubmit() {
   // this.messagetext = '';
    this.submitted = true;
    this.isBusy = true;
    //this.findInvalidControls();
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
   // console.log('On submit');
    //console.log('Data: ' +  this.angForm.value  );
    //alert('user  -  ' + this.UserId);
    if (this.orderForm.valid) {
      if (this.operation == 1) {
      
        this.addOrder();
      }
      else {
       
        this.updateOrder();
      }

    
      this.submitted = false;
      this.isBusy = false;
      
      //this.userForm.reset();
      // set back the received date thriugh session service
      this.sessionService.deleteParameters();
      this.sessionService.setParameters([{ order_date : this.receivedDate }]);
      // navigate to order form
      this.router.navigate(['order']);
      //window.location.href = './order';

    }
    else {
      //alert('Remove Errors first ')
      //this.messagetext = 'Please provide valid values';
      this.isBusy = false;
      // alert('clear errors');
    }

  }

  
  addOrder() {
    //console.log('data: ' + this.orderForm.value.name);
    this.orderForm.controls.created_on.setValue(Date.now());
    alert("data is - " + this.orderForm.value.order_date);
    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.orderService.addOrder(this.orderForm.value).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Order added' + response);

        // this.loadAllUsers();
        // add orderitems
        this.orderService.addOrderItem(this.selectedDataList).subscribe(
          (response) => {
            //this.resp = response;
            console.log('Order items added' + response);
    
            // this.loadAllUsers();
    
    
          },
          (error) => {
            //Handle the error here
            //If not handled, then throw it
            console.error(error);
    
          })

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);

      })

  }


    
  updateOrder() {
    //console.log('data: ' + this.orderForm.value.name);
    this.orderForm.controls.modified_on.setValue(Date.now());
    //this.orderForm.controls.modified_by.setValue(this.user);
    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.orderForm.removeControl('id');
    this.orderForm.addControl('_id', new FormControl(['', []]));
    this.orderForm.controls._id.setValue(this.OrderId);
    //alert("data is - " + this.orderForm.value.order_date);
    this.orderService.updateOrder(this.orderForm.value).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Order updated' + response);

        // this.loadAllUsers();
        // first delete all order items
        if (this.isItemAddedRemoved){
        this.orderService.deleteOrderItemsForOrder({order_uid : this.orderForm.value.order_uid}).subscribe(
          (response) => {
            //this.resp = response;
            console.log('Order items added' + response);
            //decrease the stock for item being deleted
            this.decreaseSoldStock(this.orderItemsToUodate);
            // this.loadAllUsers();
    
    
        // add all orderitems and in this procedure automaticall stock sold will be increased in the back end
        this.orderService.addOrderItem(this.selectedDataList).subscribe(
          (response) => {
            //this.resp = response;
            console.log('Order items added' + response);
    
            // this.loadAllUsers();
    
    
          },
          (error) => {
            //Handle the error here
            //If not handled, then throw it
            console.error(error);
    
          });
        
        },
        (error) => {
          //Handle the error here
          //If not handled, then throw it
          console.error(error);
  
        });
      }
      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);

      })

  }

decreaseSoldStock(data : any)
{

  this.stockService.decreaseSoldStock(data).subscribe(
    (response) => {
      },
    (error) => {
      //Handle the error here
      //If not handled, then throw it
      console.error(error);
      
   });

}

// open the new / update form
openCustomersDialog(operation: any) {
  // operation = 1 for new , operation = 2 for update

  var operationOK = false;

  // operation is new record
  if (operation == 1) {
    // if (this.venderUID == "" || this.venderUID == null) 
    //  {alert("Please select an item first.");}
    // else {
    operationOK = true;
    //};
  }
  // operation is update
  else if (operation == 2) {
    if (!this.rowDataClicked._id) { alert('Please select a record to update.'); }
    else { operationOK = true };
  }

  if (operationOK) {
    // update record is clicked
    //if (this.rowDataClicked._id ) {
    // delete the parameters array
    this.sessionService.deleteParameters();
    this.sessionService.setParameters([{
      operation: operation,
      customer_id: this.rowDataClicked._id
    }]);



    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1000px';


    const dialogRef = this.dialog.open(CustomerNewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.message == "save") {

        //this.selectGL(this.venderUID, this.venderName);
        this.loadAllCustomers();
        this.orderForm.controls.customer_uid.setValue(result.customer_uid);
        //this.rowDataClicked = {};

      }
      return (result);
    });
  }
  // else
  //{ alert('Please select a record to update.');}
}

  // open the new / update form
  openLov() {
    var customerID = ""; 
    // parameters lov type can be LUH - LU Header, 
        //                            LUD  - LU Details
        //                            USR  - Users
        //                            VEN  - Venders
        //                             CAT  - Categories
        //                             ITM  - Items
        //                             CIT  - Cities
        //                             CON  - Countries
        //                             STA  - States
        //                             VAC  - Vender Accounts
        //                             CUS  - Customers                           
        // Nature : S - single value selection , M - Multile value selection
     //   alert( 'lov is being called');
     var that = this;
    this.utilService.openLov('CUS' , 'S', function(data) {  
     // alert( data[0].lov_uid)
      if (data.length > 0) {
        customerID = data[0].lov_uid;
       // alert(" customerID - " + customerID);
        if (customerID != "") {
          that.orderForm.controls.customer_uid.setValue(customerID);
        }

      }
    });
   
  }
     
    setCustomer ()
      {
        var phoneNumber;
        if (this.phoneNo.substr(0,1) == '0')
       { phoneNumber = this.phoneNo.substr(1);}
       else{phoneNumber = this.phoneNo}
       //alert(phoneNumber)
        var found = this.customerList.find(({ mobile , phone }) => (mobile.includes(phoneNumber) || phone.includes(phoneNumber)));
      if (found){//alert(found.name);
        this.orderForm.controls.customer_uid.setValue(found.customer_uid);}
        else
        {this.openCustomersDialog(1)}

      }
    
    
    


}