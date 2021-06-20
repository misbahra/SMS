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
  refundQuantity = 0;
  refundDataList: any = [];
  connUser : any = this.sessionService.getConnectedUsers();
  customerRefundDataList: any = [];
  isRefundUsed = false;
  totalRefundAmount = 0;
  totalRefundUsed = 0;
  netOrderAmount = 0;
  
  

  @ViewChild("txtSearch") txtSearchField: ElementRef;
  //@ViewChild("phoneNo") txtPhone: ElementRef;
  

   rowDataClicked:any = {};
    userPrivs = {	insert_allowed : false,
					update_allowed : false,
					delete_allowed : false,
					view_allowed : false};
   
    style = {
    marginTop: '0px',
    padding:'0px',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
};

  async loadStock() {
    this.isBusy = true;
    let response = await this.stockService.getSummaryStockForOrder();
    this.stockDataList = response;
    //alert('data retrieved' + this.stockDataList.length )
    
    // available stocks should be loaded
    this.loadAvailableStock(this.stockDataList);
  
    this.isBusy =  false;
  };

  //load available stock

  async loadAvailableStock(stockData : any) {
    this.stockDataListDisplay = [];
    await stockData.forEach(element => {
      // check if stock is available
     
     //if (element.items_count - element.stock_sold > 0 ) {
      this.stockDataListDisplay.push({"stock_uid":element.stock_uid , 
                                      "item_uid" : element.item_uid,
                                      "item_name":element.item_desc + "(" + (element.items_count - element.stock_sold) + ") -" + element.stock_uid,
                                      "stock_bar_code" : element.stock_bar_code});
                                   // };
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
      "unit_cost_price" : found.items_cost.toFixed(2) ,
      "unit_tag_price" :  found.sales_price.toFixed(2),
      "quantity" :  this.quantity,
      "unit_sale_price" : this.price.toFixed(2) ,
      "vat" :  0,
      "sales_tax" :  0,
      "withholding_tax" :  0,
      "total_price" :  (this.quantity * this.price).toFixed(2) ,
      "total_price_with_taxes" :  (this.quantity * this.price).toFixed(2),
      "discount_rate" : (Math.floor(((found.sales_price - this.price) * 100 ) / found.sales_price)).toFixed(2),
      "discount" :  ((found.sales_price - this.price) * this.quantity).toFixed(2) ,
      "order_refund_uid" :  "",
      "stock_uid" : found.stock_uid,
      "posted_to_stock" : "Y",
      "created_by" :  this.connUser.user_name,
      "created_on" :  Date.now(),
      "modified_by" :  "",
      "modified_on" :  ""
    });


      this.totalAmount += (this.quantity * this.price);
      this.netOrderAmount = this.totalAmount - this.totalRefundUsed - this.vat ;
      this.quantity = 1;
      this.price = null;
      this.loadAvailableStock(this.stockDataList); 
      this.txtSearchField.nativeElement.focus();
  }

    };
 
  deleteStock(index : any ) {
      
       
      

      var selectedIndex : any;
      var deletedOrderItem = this.selectedDataList[index];
      var found = this.stockDataList.find(function(post, idx) {
        if(post.stock_uid == deletedOrderItem.stock_uid){
          
          selectedIndex = idx;
         
          return true;
        }
      });

      

      if(deletedOrderItem.order_refund_uid)
      {
      this.totalRefundUsed -= deletedOrderItem.total_price;
      alert('has refurnd id ' + deletedOrderItem.order_refund_uid)
      }
      else{
        alert('No refurnd id ' + deletedOrderItem.order_refund_uid)
        this.totalAmount -= deletedOrderItem.total_price;
        this.stockDataList[selectedIndex].stock_sold -= deletedOrderItem.quantity; 
      }

      this.netOrderAmount = this.totalAmount - this.totalRefundUsed - this.vat ;
      this.loadAvailableStock(this.stockDataList); 
      this.selectedDataList.splice(index , 1);
      this.isItemAddedRemoved = true;
      this.txtSearchField.nativeElement.focus();
  };
  
  async ngOnInit() {

    
    this.loadStock();
    this.userPrivs = this.sessionService.getUsersPrivs('USR');

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
      created_by: [this.connUser.user_name, []],
      created_on: [Date.now(), []],
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
     
      await this.loadOrders(this.dataId);
      
    }
    else {this.isDisabled = true;};
  
    this.loadAllLUD('1');
    this.loadAllLUD('2');
    this.loadAllLUD('5');
    this.loadAllLUD('20');
    this.loadAllCustomers();
    this.loadCustomerRefunds();
    //this.txtPhone.nativeElement.focus();
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
    this.totalRefundAmount = 0;
    this.orderItems.forEach(found => {
    
    
     
    if(found.order_refund_uid != null || found.order_refund_uid != '')
    {
    this.totalRefundUsed += found._id.total_price;
    }
    else
    {
      this.totalAmount += found._id.total_price;
    }
    this.netOrderAmount = this.totalAmount - this.totalRefundUsed - this.vat ;

    this.selectedDataList.push(
      {
      "order_item_uid" : found._id.order_item_uid,
      "order_uid" : found._id.order_uid,
      "item_uid" :  found._id.item_uid,
      "item_name" : found._id.item_name,
      "unit_cost_price" : found._id.unit_cost_price.toFixed(2),
      "unit_tag_price" :  found._id.unit_tag_price.toFixed(2),
      "quantity" :  found._id.quantity,
      "unit_sale_price" :found._id.unit_sale_price.toFixed(2),
      "vat" :  found._id.vat.toFixed(2),
      "sales_tax" :  found._id.sales_tax.toFixed(2),
      "withholding_tax" :  found._id.withholding_tax.toFixed(2),
      "total_price" :  found._id.total_price.toFixed(2) ,
      "total_price_with_taxes" :  found._id.total_price_with_taxes.toFixed(2),
      "discount_rate" : found._id.discount_rate,
      "discount" :  found._id.discount.toFixed(2) ,
      "order_refund_uid" :  found._id.order_refund_uid,
      "stock_uid" : found._id.stock_uid,
      "posted_to_stock" : found._id.posted_to_stock,
      "refunded_quantity" : found.total_refunded_quantity,
      "refunded_amount" : found.total_refunded_amount.toFixed(2),
      "created_by" :  found._id.created_by,
      "created_on" : found._id.created_on,
      "modified_by" :  found._id.modified_by,
      "modified_on" :  found._id.modified_on,
      "total_refunded_quantity" : found.total_refunded_quantity,
      "total_refunded_amount" : found.total_refunded_amount.toFixed(2)

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
    //alert("data is - " + this.orderForm.value.order_date);
    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.orderService.addOrder(this.orderForm.value).subscribe(
      (response) => {
        //this.resp = response;
        //console.log('Order added' + response);

        // this.loadAllUsers();
        // add orderitems
        this.orderService.addOrderItem(this.selectedDataList).subscribe(
          (response) => {
            //this.resp = response;
            //console.log('Order items added' + response);
    
            // this.loadAllUsers();
            this.submitted = false;
            this.isBusy = false;
            
            //this.userForm.reset();
            // set back the received date thriugh session service
            this.sessionService.deleteParameters();
            this.sessionService.setParameters([{ order_date : this.receivedDate }]);
            // navigate to order form
            this.router.navigate(['order']);
            //window.location.href = './order';
    
    
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
            //this.decreaseSoldStock(this.orderItemsToUodate);
            // this.loadAllUsers();
            this.submitted = false;
            this.isBusy = false;
            
            //this.userForm.reset();
            // set back the received date thriugh session service
            this.sessionService.deleteParameters();
            this.sessionService.setParameters([{ order_date : this.receivedDate }]);
            // navigate to order form
            this.router.navigate(['order']);
            //window.location.href = './order';
    
    
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
      customer_id: this.rowDataClicked._id,
      mobile: this.phoneNo
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
    
      clearCustomer()
      {
        this.orderForm.controls.customer_uid.setValue(null);
        this.customerRefundDataList = [];
      }

  processRefund(p_order_item_uid: any, p_quantity: any, p_refundedQuantity: any) {

   // alert(p_order_item_uid + "-" + p_quantity + "-" + p_refundedQuantity);
    var remainingQuantity = p_quantity - p_refundedQuantity;
    this.refundDataList = [];
    // here will be the code to refund
    if (!this.orderForm.value.customer_uid) {
      alert("Please select a customer to refund.");
    }
    else {
      //alert("Step1 - Customer validated");
      if (remainingQuantity <= 0) {
        alert('All items have already been refunded.')
      }
      else {

        var p = prompt("Please provide the quantity to refund.");
        var prmpt = parseInt(p);
        
        //alert("prompt - " + prmpt);

        if (prmpt == null || isNaN(prmpt) || prmpt==0)
        {
          alert("Please enter a valid number.")
        }
        else
        { // user has given some input
        var refQty = prmpt;
        //alert("Step2 - after prompt");
        if (refQty > remainingQuantity) {
          alert('You cannot refund more than available quantitiy (' + remainingQuantity + ')');
        }
        else {
          //alert("Step3 - after quantity check");
          this.isBusy = true;

          // update order if customer is added
          if (this.orderForm.dirty) {
            // if update operation (2)
            if (this.operation == 2) {
              //alert("Step3-2 - after quantity check");
              this.updateOrder();
            }
          }

         // alert("Step4 - after cutomer update");

          var foundOrderItem = this.selectedDataList.find(({ order_item_uid }) => (order_item_uid == p_order_item_uid));

          //alert("Step5 - after found");
          //this data is needed to refund

          //alert("cost price: " + foundOrderItem.unit_cost_price);

          this.refundDataList.push({

            order_refund_uid: this.utilService.getUID("order_refund_uid"),
            //below information is related to order where refund will be or has been used / adjusted
            order_uid: "",
            order_item_uid: "",
            // below information is related to refunded order
            item_uid: foundOrderItem.item_uid,
            unit_cost_price: foundOrderItem.unit_cost_price,
            unit_tag_price: foundOrderItem.unit_tag_price,
            quantity: refQty,
            unit_sale_price: foundOrderItem.unit_sale_price,
            total_price: (foundOrderItem.total_price / foundOrderItem.quantity) * refQty,
            vat: (foundOrderItem.vat / foundOrderItem.quantity) * refQty,
            sales_tax: (foundOrderItem.sales_tax / foundOrderItem.quantity) * refQty,
            withholding_tax: foundOrderItem.withholding_tax,
            discount_rate: foundOrderItem.discount_rate,
            discount: (foundOrderItem.discount / foundOrderItem.quantity) * refQty,
            total_price_with_taxes: (foundOrderItem.total_price_with_taxes / foundOrderItem.quantity) * refQty,
            stock_uid: foundOrderItem.stock_uid,
            posted_to_stock: foundOrderItem.posted_to_stock,
            refunded_order_uid: foundOrderItem.order_uid,
            refunded_order_item_uid: foundOrderItem.order_item_uid,
            customer_uid: this.orderForm.value.customer_uid,
            refund_type_uid: "",
            refund_remarks: "",
            created_by: this.connUser.user_name,
            created_on: Date.now(),
            modified_by: "",
            modified_on: ""

          });

          //alert("Step5 - after push");

          this.orderService.addOrderRefund(this.refundDataList).subscribe(
            (response) => {
              this.isBusy = false;
              this.loadOrderItems(foundOrderItem.order_uid);
              alert('Refund Successfull.');
            },
            (error) => {
              //Handle the error here
              //If not handled, then throw it
              console.error(error);
              alert('Your refund cannot be processed for the moment.');
            }
          );

        }

      }
      
    }
    }
  }

async loadCustomerRefunds(){
  //alert('Refund for customer - ' + this.orderForm.value.customer_uid)
  // if customer is selected and operation is insert record
  this.totalRefundAmount = 0;
  if (this.orderForm.value.customer_uid && this.operation == 1){
    var resp = await this.orderService.getOrderRefundsForCustomer([{value : this.orderForm.value.customer_uid}]);
    this.customerRefundDataList = resp;

    this.customerRefundDataList.forEach(element => {
      this.totalRefundAmount += element.total_price;
      this.totalRefundAmount.toFixed(2);
    });
    
    //alert('Refund Loaded - ' + this.customerRefundDataList.length);
  }
  else{this.customerRefundDataList = []}
  
}

useRefund(orderRefundUID:any){

  
  var refundedItem = this.customerRefundDataList.find(({order_refund_uid}) => (order_refund_uid == orderRefundUID));
  var foundOrderItem = this.selectedDataList.find(({order_refund_uid}) => (order_refund_uid == orderRefundUID));

  //  alert('refunds found - ' + refundedItem.item_name + ' - '+ refundedItem.order_refund_uid)

  //  alert('items found - ' + foundOrderItem.item_name + ' - '+ foundOrderItem.order_refund_uid)

  if (foundOrderItem){
    alert('Refund has already been used.');
  }
  else{
    if (refundedItem){
    //alert('going to use refund')
    this.isItemAddedRemoved = true;
    this.selectedDataList.push(
    {
    "order_item_uid" : this.utilService.getUID("order_item_uid"),
    "order_uid" : this.orderNumber,
    "item_uid" :  refundedItem.item_uid,
    "item_name" : '(Refund) - ' + refundedItem.item_name ,
    "unit_cost_price" : refundedItem.unit_cost_price.toFixed(2) ,
    "unit_tag_price" :  refundedItem.unit_tag_price.toFixed(2),
    "quantity" :  refundedItem.quantity,
    "unit_sale_price" : refundedItem.unit_sale_price.toFixed(2) ,
    "vat" :  refundedItem.vat.toFixed(2),
    "sales_tax" :  refundedItem.sales_tax.toFixed(2),
    "withholding_tax" :  refundedItem.withholding_tax.toFixed(2),
    "total_price" :  refundedItem.total_price.toFixed(2),
    "total_price_with_taxes" :  refundedItem.total_price_with_taxes.toFixed(2),
    "discount_rate" : refundedItem.discount_rate,
    "discount" :  refundedItem.discount.toFixed(2) ,
    "order_refund_uid" :  refundedItem.order_refund_uid,
    "stock_uid" : refundedItem.stock_uid,
    "posted_to_stock" : "Y",
    "created_by" :  this.connUser.user_name,
    "created_on" :  Date.now(),
    "modified_by" :  "",
    "modified_on" :  ""
  });

  if(refundedItem.order_refund_uid)
    {
    this.totalRefundUsed += refundedItem.total_price;
    }
   
    this.netOrderAmount = this.totalAmount - this.totalRefundUsed - this.vat ;
}
else{ alert('Refund not found')}
    
  }
  
}

}