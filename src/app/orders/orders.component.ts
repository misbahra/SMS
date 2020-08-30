import { Component, OnInit } from '@angular/core';
import { ordersWS } from '../ws/ordersWS';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
//import { MatDialog, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LuhNewComponent } from '../lu/luh-new/luh-new.component';
import { LudNewComponent } from '../lu/lud-new/lud-new.component';
import * as momentNs from 'moment';
const moment = momentNs;
import { stockWS } from '../ws/stockWS';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { customersWS } from '../ws/customersWS';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(
    private webService: ordersWS,
    private router: Router,
    private sessionService: sessionService,
    public dialog: MatDialog,
    public stockService: stockWS,
    private fb: FormBuilder,
    private CustomersService: customersWS,
  ) {

  }
  model: any = [];
  ordersdataList: any = [];
  orderItemsdataList: any = [];
  isBusy = false;
  isLUDBusy = false;
  isEdit = false;
  resp: any[];
  selectedID: any = "No Selected";
  selectedCode: any = [];
  isluhCodeSelected: boolean = false;
  columnDefs = [];
  rowData:any = [];
  customerList: any = [];
  orderForm: FormGroup;
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
// for lud grid
columnDefs2 = [];
rowData2:any = [];
 rowDataClicked2:any = {};
   
  style2 = {
  marginTop: '5px',
  width: '100%',
  height: '100%',
  flex: '1 1 auto'
};

ngOnInit() {

  this.loadAllCustomers();
    //this.loadAllOrders();
    this.userPrivs = this.sessionService.getUsersPrivs();
    if (this.selectedCode.length > 0){this.loadAllOrderItems(this.selectedCode);}
    //this.orderForm = new this.fb.group();
     this.orderForm = this.fb.group({
      order_uid: ['', []],
      customer_uid: ['', []],
      order_date: ['', []],
      invoice_number: ['',[]],
    }
      // , { validator: this.CheckUserName('UserName') }
    );
  };

  clearFilters()
  {
    this.orderForm.reset();
  }

  async loadAllCustomers() {
    //alert("loading lud comp");  
    
    let response = await this.CustomersService.getCustomers();
    this.customerList = response;

    
     //console.log("Data in LUD list " + this.LUDdataList.length );
  };


  async loadAllOrders() {
    //alert("loading orederes");
    this.isBusy = true;
    //alert("Selected Date is - " + this.orderForm.value.order_date);
    
    var orderDate;
    var customerUID;
    var invoiceNumber;
    
    if (    this.orderForm.value.order_date == "" 
        ||  this.orderForm.value.order_date == null)
     { orderDate = "1"} 
      else {orderDate = this.orderForm.value.order_date;};

      if (    this.orderForm.value.customer_uid == "" 
      ||  this.orderForm.value.customer_uid == null)
   { customerUID = "1"} 
    else {customerUID = this.orderForm.value.customer_uid;};

    if (    this.orderForm.value.invoice_number == "" 
        ||  this.orderForm.value.invoice_number == null)
     { invoiceNumber = "1"} 
      else {invoiceNumber = this.orderForm.value.invoice_number;};
    

    var parameters = [{"order_date":orderDate ,
                       "customer_uid" : customerUID,
                      "invoice_number" : invoiceNumber }];
    let response = await this.webService.getOrders(parameters);
    this.ordersdataList = response;

    this.columnDefs = [
      {
        headerName: '',
         width: 35,
         sortable: false,
         filter: false,
        checkboxSelection: true
        },
      {headerName: '#', field: 'order_uid' , width: 200, sortable: true, filter:true  },
      {headerName: 'Invoice#', field: 'invoice_number', width: 150, sortable: true, filter:true },
      {headerName: 'customer#', field: 'customer_name', width: 300, sortable: true, filter:true },
      {headerName: 'Date', field: 'order_date', width: 200, sortable: true, filter:true },
      {headerName: 'Status', field: 'status', width: 100, sortable: true, filter:true },
      {headerName: 'HD', field: 'home_delivery', width: 100, sortable: true, filter:true },
      {headerName: 'PM', field: 'payment_mode', width: 100, sortable: true, filter:true },
      {headerName: 'Desc', field: 'order_desc', width: 300, sortable: true, filter:true },
      
      
      
    ];
    this.rowData = response;


    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };

  async loadAllOrderItems(id: any) {
    //alert("loading lud comp");  
    this.isLUDBusy = true;
    //setTimeout(null,4000);
    //alert("luh value is " + id[0].value);
   let response = await this.webService.getAllItemsForOrder(id);
   this.orderItemsdataList = response;
   this.columnDefs2 = [
    {
      headerName: '',
       width: 35,
       sortable: false,
       filter: false,
      checkboxSelection: true
      },
    {headerName: 'order#', field: 'order_uid' , width: 100, sortable: true, filter:true },
    {headerName: 'item', field: 'item_name', width: 350, sortable: true, filter:true },
    {headerName: 'quantity', field: 'quantity', width: 100, sortable: true, filter:true },
    {headerName: 'rate', field: 'unit_sale_price', width: 100, sortable: true, filter:true },
    {headerName: 'total price', field: 'total_price', width: 100, sortable: true, filter:true },
    {headerName: 'net price', field: 'total_price_with_taxes', width: 140, sortable: true, filter:true },
    {headerName: 'stock uid', field: 'stock_uid', width: 75, sortable: true, filter:true },
    {headerName: 'Posted', field: 'posted_to_stock ', width: 75, sortable: true, filter:true }
   
    
  ];
  this.rowData2 = response;

    //alert("Data is :" + this.LUDdataList[0].lud_desc);
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    //this.ScrolToTop();
    this.isLUDBusy = false;
   
  };

  LoadOrderItems(code: any) {
    this.selectedID = this.rowDataClicked.order_uid;
    this.isluhCodeSelected = true;
    this.selectedCode = [];
    this.selectedCode.push({ "name": "order_uid", "value": this.rowDataClicked.order_uid });
    this.loadAllOrderItems(this.selectedCode);
  }

  deleteOrder() {
   //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUH(this.LUHdataList[id]).subscribe(
      if (this.rowDataClicked._id) {
        if (confirm('Are you sure to delete record?')) {
           this.webService.deleteOrder(this.rowDataClicked).subscribe(
      (response) => {
        this.decreaseStockSold(this.orderItemsdataList);
        this.loadAllOrders();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked.luh_code + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');}
}

decreaseStockSold(data : any)
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

postAllOrders()
{

  this.webService.postAllOrderItemsToStock([]).subscribe(
    (response) => {
      },
    (error) => {
      //Handle the error here
      //If not handled, then throw it
      console.error(error);
      
   });

}



  DeleteLUD(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
      if (this.rowDataClicked2._id) {
        if (confirm('Are you sure to delete record?')) {
           this.webService.deleteOrderItem(this.rowDataClicked2).subscribe(
      (response) => {
        this.LoadOrderItems(this.rowDataClicked.luh_code);

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked2.lud_code + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');}
}

  // single getter for all form controls to access them from the html
  get fc() { return this.orderForm.controls; }

 

// // open the new / update form
openLudDialog(id: any) {
  //alert("test 1")
  // delete the parameters array
  if (this.rowDataClicked2._id  || id == null) {
  this.sessionService.deleteParameters();
  // check if any parameter is sent or not
  //if sent then this will be opened for update
  if (id != null) {
    //alert("test 2")
    this.sessionService.setParameters([{ name: "lud_id", value: this.rowDataClicked2._id }]);
  }
  else
  {
 //alert("test 2-" + this.selectedID);  
  this.sessionService.setParameters([{ name: "luh_code", value: this.rowDataClicked.luh_code }]);
  }

  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '600px';
  const dialogRef = this.dialog.open(LudNewComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if (result == "save") {
      this.LoadOrderItems(this.selectedID);
      this.rowDataClicked2 = {};
    }
    return (result);
  });
}
else
{ alert('Please select a record to update.');}
}

ScrolToTop() {
  let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 16);
}



onRowSelected(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked = e.node.data;
    this.rowDataClicked2 = {};
    this.LoadOrderItems(1);
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked){
      if (this.rowDataClicked._id == e.node.data._id ){
      this.rowDataClicked = {};
      this.rowDataClicked2 = {};
      this.LoadOrderItems(1);
     
  }
 }
}
 
}

onRowSelected2(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked2 = e.node.data;
 
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked2){
      if (this.rowDataClicked2._id == e.node.data._id ){
      this.rowDataClicked2 = {};
     
  }
 }
}
 
}

}
