import { Component, OnInit , Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {luWS} from '../../ws/luWS';
import * as stockWS from '../../ws/stockWS';
import { Router } from "@angular/router";
import * as wsrSessionService from '../../ws/sessionWS';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { utilWS } from '../../ws/utilWS';
import { vendersWS } from '../../ws/vendersWS';
import { ItemsWS } from '../../ws/itemsWS';
import { DatePipe } from '@angular/common';


interface DialogData {
  data: string;
}

@Component({
  selector: 'app-stock-new',
  templateUrl: './stock-new.component.html',
  styleUrls: ['./stock-new.component.css']
})
export class StockNewComponent implements OnInit {

  dataForm: FormGroup;
  model: any = {};
  resp: any = [];
  submitted = false;
  isBusy = false;
  queryParams: any = [];
  isDisabled = false;
  response: any = [];
  invalid: any = [];
  dataId: any = "";
  isDup = false;
  stockdataList: any = [];
  stockUID = "";
  itemUID = "";
  todayDate = new Date().toISOString().slice(0, 16);
  vendersDataList : any = [];
  itemsDataList : any = [];
  stuffDataList : any = [];
  brandDataList : any = [];
  colorDataList : any = [];
  designDataList : any = [];
  barCode = '';

  messagetext = '';
  constructor(private webService: stockWS.stockWS,
    private sessionService: wsrSessionService.sessionService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StockNewComponent>,
    private utilService : utilWS,
    private vendersService : vendersWS,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private itemsService : ItemsWS,
    private luService: luWS,
    public datepipe: DatePipe
  ) { this.OnStart() }

  ngOnInit() {
    this.dataForm = this.fb.group({
      id: ['', []],
      stock_uid: [this.utilService.getUID('stock_uid'), []],
      item_uid: ['', []],
      items_count: [1, []],
      vender_uid: ['', []],
      stuff: ['', []],
      brand: ['', []],
      color: ['', []],
      total_bill_amount: [0, []],
      items_cost: [0, []],
      shipping_charges: [0, []],
      delivery_charges: [0, []],
      sales_price: [0, []],
      request_placed_on: ['', []],
      stock_received_on: ['', []],
      stock_bar_code: ['', []],
      vat: [0, []],
      stock_sold: [0, []],
      stock_code: ['', []],
      design_code: ['', []],
      stock_desc: ['', []],
      created_by: ['', []],
      created_on: ['', []],
      modified_by: ['', []],
      modified_on: ['', []]
    }
      // , { validator: this.CheckUserName('UserName') }
    );
    
    //load vender for list population
    this.loadVenders();
    this.loadItems();
    this.loadAllLUD('STST');
    this.loadAllLUD('BRND');
    this.loadAllLUD('COLR');
    this.loadAllLUD('DESC');
    //this.setStockCode();
    this.queryParams = this.sessionService.getParameters();
    // alert('point 1 - ' + this.queryParams[0].name);
    if (this.queryParams.length > 0 ) {
      
    // if operation = 1- new record  
    this.isDisabled = true; 
    if (this.queryParams[0].operation == 1) {
      // alert('point 2');
      
      this.itemUID = this.queryParams[0].item_uid;
    }
     // if operation = 2- update record   
    else if (this.queryParams[0].operation == 2)
    {
      this.itemUID = this.queryParams[0].item_uid;
      this.stockUID = this.queryParams[0].stock_id;
      this.loadData(this.queryParams);
      
    }

    else {this.isDisabled = true;};
    this.dataForm.controls.item_uid.setValue(this.itemUID);
  }
   
  }

  async loadAllLUD(id: any) {
    //alert("loading lud comp");  
    var luhData = [{value:id}]
    let response = await this.luService.getLUD(luhData);
    if (id=='STST'){this.stuffDataList = response;}
    if (id=='BRND'){this.brandDataList = response;}
    if (id=='COLR'){this.colorDataList = response;}
    if (id=='DESC'){this.designDataList = response;}
    
    
     //console.log("Data in LUD list " + this.LUDdataList.length );
  };
 
 

  // single getter for all form controls to access them from the html
  get fc() { return this.dataForm.controls; }

  async loadData(id: any) {
    this.isBusy = true;
    this.dataForm.disable();
    //alert('loading data - ' + userid[0].value);
    var stock_id = [{name: "stock_id" , value: id[0].stock_id}];
    this.response = await this.webService.getThisStock(stock_id);
    //alert('data - ' + this.response.name);
    this.dataId = this.response._id;
    //alert('request_placed_on -' + this.response.request_placed_on.slice(0, 10) );
    //this.response.request_placed_on = new Date(this.response.request_placed_on).toLocaleString().slice(0, 10);
    //this.response.stock_received_on = new Date(this.response.stock_received_on).toLocaleString().slice(0, 10);
    this.response.request_placed_on = this.response.request_placed_on.slice(0, 10);
    this.response.stock_received_on = this.response.stock_received_on.slice(0, 10);

    //new Date().toISOString().slice(0, 16);
    this.dataForm.patchValue(this.response);
    this.stockUID = this.dataForm.value.stock_uid;
    this.barCode=this.dataForm.value.stock_bar_code;
    this.dataForm.enable();
   
    this.isBusy = false;
  };

  OnStart() {
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.dataForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        // alert("Invalid control - " + name )
      }
    }

  }

   onCancel() {
    //this.router.navigate(['user']);
    //window.location.href = './lu';
    this.dialogRef.close('cancel');
  }

calculateCostPrice(action:any) {
var total_bill_amount = this.dataForm.value.total_bill_amount;
var shipping_charges = this.dataForm.value.shipping_charges;
var delivery_charges = this.dataForm.value.delivery_charges;
var vat = this.dataForm.value.vat;
var items_count = this.dataForm.value.items_count;
var items_cost = this.dataForm.value.items_cost;

if (total_bill_amount == null) {total_bill_amount = 0;}
if (shipping_charges == null) {shipping_charges = 0;}
if (delivery_charges == null) {delivery_charges = 0;}
if (vat == null) {vat = 0;}
if (items_count == null) {items_count = 0;}
if (items_cost == null) {items_cost = 0;}

try{
  //called from the event of cost price, then calculate total price
  if (action == 'C'){
    this.dataForm.controls.total_bill_amount.setValue(
      ((items_count * items_cost)
       ));
  }
   //called from the event of totla price, then calculate cost price
  else if (action == 'T'){
    this.dataForm.controls.items_cost.setValue(
      ((total_bill_amount
        + shipping_charges
        + delivery_charges
        )
        / 
        items_count));
  }
   
  //suggest sales price by adding 100%
          this.dataForm.controls.sales_price.setValue(
            Math.round(this.dataForm.value.items_cost * 2));

  }
        catch (e){
          this.dataForm.controls.items_cost.setValue(0);
  }
  }

  

  setStockCode(){
    //alert(this.dataForm.value.stock_received_on);
    var data: any = {};
    data = this.utilService.setStockCode(
      this.itemsDataList,
      this.vendersDataList,
      this.dataForm.value.stock_received_on,
      this.dataForm.value.stock_uid,
      this.dataForm.value.item_uid,
      this.dataForm.value.vender_uid,
      this.dataForm.value.stuff,
      this.dataForm.value.brand,
      this.dataForm.value.color,
      this.dataForm.value.design_code
    );


    this.dataForm.controls.stock_code.setValue(data.stockCode); 
    // set bar code also 
    this.dataForm.controls.stock_bar_code.setValue(data.barCode);
  }


 
 
  onSubmit() {
    this.messagetext = '';
    this.submitted = true;
    this.isBusy = true;
    this.findInvalidControls();
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
    console.log('On submit');
    //console.log('Data: ' +  this.angForm.value  );
    //alert('user  -  ' + this.UserId);
    this.setStockCode();
    if (this.dataForm.valid) {
      // operation = 1 - new record
      if (this.queryParams[0].operation == 1) {
        //alert('add record');
        this.addData();
      }
      // operation = 2 - update record
      else {
        //alert('update record');
        this.updateData();
      }
      //alert('all is ok');
      this.submitted = false;
      this.isBusy = false;
      //this.userForm.reset();
      //this.router.navigate(['user']);
     // window.location.href = './lu';
     this.dialogRef.close('save');
    }
    else {
      //alert('Remove Errors first ')
      this.messagetext = 'Please provide valid values';
      this.isBusy = false;
      // alert('clear errors');
    }

  }

  addData() {
    //console.log('data: ' + this.dataForm.value.name);
    this.dataForm.controls.created_on.setValue(Date.now());
    //this.dataForm.controls.stock_uid.setValue(this.utilService.getUID('stock_uid'));
    
    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.webService.addStock(this.dataForm.value).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Data added' + response);

        // this.loadAllUsers();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);

      })

  }


  updateData() {
    console.log('data: ' + this.dataForm.value.name);

    this.dataForm.controls.modified_on.setValue(Date.now());
    this.dataForm.removeControl('id');
    this.dataForm.addControl('_id', new FormControl(['', []]));
    this.dataForm.controls._id.setValue(this.dataId);
    //alert("Value is set to - " + this.userForm.controls._id.value);

    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.webService.updateStock(this.dataForm.value).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Data updated' + response);

        // this.loadAllUsers();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);

      })
    this.dataForm.removeControl('_id');
  }

  async loadVenders()
  {
    var response;
  response = await this.vendersService.getVenders();
  this.vendersDataList = response;
  //alert("Venders loaded - " + this.vendersDataList.length);
  }

  async loadItems()
  {
    var response;
  response = await this.itemsService.getItems();
  this.itemsDataList = response;
  //alert("Venders loaded - " + this.vendersDataList.length);
  }

}