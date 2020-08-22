import { Component, OnInit } from '@angular/core';
import { ordersWS } from '../../ws/ordersWS';
import { luWS } from '../../ws/luWS';
import { customersWS } from '../../ws/customersWS';
import { Router } from "@angular/router";
import { sessionService } from '../../ws/sessionWS';
import { stockWS } from '../../ws/stockWS';
import * as momentNs from 'moment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { utilWS } from '../../ws/utilWS';


const moment = momentNs;

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  
  constructor(
    private orderService: ordersWS,
    private luService: luWS,
    private CustomersService: customersWS,
    private router: Router,
    private sessionService: sessionService,
    public stockService: stockWS,
    private fb: FormBuilder,
    private utilService : utilWS
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
        alert("Index is " + selectedIndex);
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
  }

    };
 
  deleteStock(index : any ) {
      
      this.totalAmount -= this.selectedDataList[index].total_price; 

      var selectedIndex : any;
      var deletedOrderItem = this.selectedDataList[index];
      var found = this.stockDataList.find(function(post, idx) {
        if(post.stock_uid == deletedOrderItem.stock_uid){
          
          selectedIndex = idx;
          alert("Index is " + selectedIndex);
          return true;
        }
      });
      this.stockDataList[selectedIndex].stock_sold -= deletedOrderItem.quantity; 
      this.loadAvailableStock(this.stockDataList); 
      this.selectedDataList.splice(index , 1);
  
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
      invoice_number: ['',[]],
      salesman_uid: ['',[]],
      created_by: ['', []],
      created_on: ['', []],
      modified_by: ['', []],
      modified_on: ['', []]
    }
      // , { validator: this.CheckUserName('UserName') }
    );
     
    this.queryParams = this.sessionService.getParameters();
    // alert('point 1 - ' + this.queryParams[0].name);
    if (this.queryParams.length > 0) {
    if (this.queryParams[0].name == "Userid") {
      // alert('point 2');
      this.isDisabled = true;
      //this.loadUser(this.queryParams);
    }
  }
    this.loadAllLUD('1');
    this.loadAllLUD('2');
    this.loadAllLUD('5');
    this.loadAllLUD('20');
    this.loadAllCustomers();
    
  };

  async loadOrders(orderid: any) {
    //this.isBusy = true;
    //alert('loading data - ' + userid[0].value);
    this.response = await this.orderService.getThisOrder(orderid);
    //alert('data - ' + this.response.name);
    this.OrderId = this.response._id;
    this.orderForm.patchValue(this.response);
    //this.userForm.disable();
  };

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

  // getter for individual form controls to access them from the htm tags
  get home_delivery() {
    return this.orderForm.get('home_delivery'); //notice this
  }
  
  // single getter for all form controls to access them from the html
  get fc() { return this.orderForm.controls; }

   
  onCancel() {
    //this.router.navigate(['user']);
    window.location.href = './order';
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
      if (this.OrderId == "") {
        alert('add Order');
        this.addOrder();
      }
      else {
        alert('update Order');
        //this.updateUser();
      }
      alert('all is ok');
      this.submitted = false;
      this.isBusy = false;
      //this.userForm.reset();
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

}