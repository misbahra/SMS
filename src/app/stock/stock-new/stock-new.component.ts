import { Component, OnInit , Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as luWS from '../../ws/luWS';
import * as stockWS from '../../ws/stockWS';
import { Router } from "@angular/router";
import * as wsrSessionService from '../../ws/sessionWS';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { utilWS } from '../../ws/utilWS';

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

  messagetext = '';
  constructor(private webService: stockWS.stockWS,
    private sessionService: wsrSessionService.sessionService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StockNewComponent>,
    private utilService : utilWS,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { this.OnStart() }

  ngOnInit() {
    this.dataForm = this.fb.group({
      id: ['', []],
      stock_uid: ['', []],
      item_uid: ['', [Validators.required]],
      items_count: ['', []],
      vender_uid: ['', []],
      total_bill_amount: ['', []],
      items_cost: ['', []],
      shipping_charges: ['', []],
      delivery_charges: ['', []],
      sales_price: ['', []],
      request_placed_on: ['', []],
      stock_received_on: ['', []],
      stock_bar_code: ['', []],
      vat: ['', []],
      stock_sold: ['', []],
      stock_code: ['', []],
      stock_desc: ['', []],
      created_by: ['', []],
      created_on: ['', []],
      modified_by: ['', []],
      modified_on: ['', []]
    }
      // , { validator: this.CheckUserName('UserName') }
    );
    
    this.queryParams = this.sessionService.getParameters();
    // alert('point 1 - ' + this.queryParams[0].name);
    if (this.queryParams.length > 0 ) {
    if (this.queryParams[0].name == "stock_id") {
      // alert('point 2');
      this.isDisabled = true;
       this.loadData(this.queryParams);
    }
    else if (this.queryParams[0].name == "item_uid")
    {
      this.isDisabled = true;
      this.itemUID = this.queryParams[0].value;
    }
    else {this.isDisabled = true;};
  }
   
  }
 

  // single getter for all form controls to access them from the html
  get fc() { return this.dataForm.controls; }

  async loadData(id: any) {
    this.isBusy = true;
    this.dataForm.disable();
    //alert('loading data - ' + userid[0].value);
    this.response = await this.webService.getThisStock(id);
    //alert('data - ' + this.response.name);
    this.dataId = this.response._id;
    this.dataForm.patchValue(this.response);
    this.stockUID = this.dataForm.value.stock_uid;
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
 
  onSubmit() {
    this.messagetext = '';
    this.submitted = true;
    this.isBusy = true;
    this.findInvalidControls();
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
    console.log('On submit');
    //console.log('Data: ' +  this.angForm.value  );
    //alert('user  -  ' + this.UserId);
    if (this.dataForm.valid) {
      if (this.dataId == "") {
        //alert('add user');
        this.addData();
      }
      else {
        //alert('update user');
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
    console.log('data: ' + this.dataForm.value.name);
    this.dataForm.controls.created_on.setValue(Date.now());
    this.dataForm.controls.stock_uid.setValue(this.utilService.getUID('stock_uid'));
    this.dataForm.controls.iteam_uid.setValue(this.itemUID);
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


}