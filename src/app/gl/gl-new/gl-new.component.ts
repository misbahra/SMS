import { Component, OnInit , Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {luWS} from '../../ws/luWS';
import { glWS } from '../../ws/glWS';
import { Router } from "@angular/router";
import * as wsrSessionService from '../../ws/sessionWS';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { utilWS } from '../../ws/utilWS';
import { vendersWS } from '../../ws/vendersWS';
import {venderAccountsWS} from '../../ws/venderAccountsWS';

interface DialogData {
  data: string;
}

@Component({
  selector: 'app-gl-new',
  templateUrl: './gl-new.component.html',
  styleUrls: ['./gl-new.component.css']
})
export class GlNewComponent implements OnInit {

 
  
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
    venderName = "";
    venderUID = "";
    glID = "";
    todayDate = new Date().toISOString().slice(0, 16);
    vendersDataList : any = [];
    glAccountHeadsDataList : any = [];
    currencyDataList : any = [];
    courierDataList : any = [];
    venderAccountsDataList : any = [];
  
    messagetext = '';
    constructor(private webService: glWS,
      private sessionService: wsrSessionService.sessionService,
      private router: Router,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<GlNewComponent>,
      private utilService : utilWS,
      private vendersService : vendersWS,
      private luService: luWS,
      private venderAccountsService:venderAccountsWS, 
      @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { this.OnStart() }
  
    ngOnInit() {
      this.dataForm = this.fb.group({
        id: ['', []],
        gl_uid: ['' , [Validators.required]],
        gl_date: ['' , []],
        account_head_code: ['' , [Validators.required]],
        vender_uid: ['' , []],
        through_vender_uid: ['' , []],
        vender_account_uid: ['' , []],
        funds_sent_on: ['' , []],
        funds_received_on: ['' , []],
        exchange: ['' , []],
        ref_number: ['' , []],
        total_amount: ['' , [Validators.required]],
        other_charges: ['' , []],
        remarks: ['' , []],
        currency: ['2' , []],
        cargo_bill_amount: ['' , []],
        cargo_charges: ['' , []],
        cargo_vat: ['' , []],
        cargo_commission: ['' , []],
        customs_charges: ['' , []],
        cargo_requested_on: ['' , []],
        cargo_shipped_on: ['' , []],
        cargo_received_on: ['' , []],
        courier_code : ['' , []],
        cargo_weight: ['' , []],
        cargo_items_count: ['' , []],
        additional_details: ['' , []],
        gl_status: ['' , []],
        sent_to_vender_uid : ['' , []],
        sent_to_vender_account_uid : ['' , []],
        created_by: ['' , []],
        created_on: ['' , []],
        modified_by: ['' , []],
        modified_on: ['' , []],
      }
        // , { validator: this.CheckUserName('UserName') }
      );
      
      //load vender for list population
      this.loadVenders();
      this.loadAllLUD('13');
    this.loadAllLUD('12');
    this.loadAllLUD('GAH');
  
      this.queryParams = this.sessionService.getParameters();
      
      if (this.queryParams.length > 0 ) {
        
      // if operation = 1- new record  
      this.isDisabled = true; 
      if (this.queryParams[0].operation == 1) {
        
        
        this.venderUID = this.queryParams[0].vender_uid;
        this.venderName = this.queryParams[0].vender_name;
        this.dataForm.controls.gl_uid.setValue(this.utilService.getUID('gl_uid'));
      }
       // if operation = 2- update record   
      else if (this.queryParams[0].operation == 2)
      {
        this.venderUID = this.queryParams[0].vender_uid;
        this.venderName = this.queryParams[0].vender_name;
        this.glID = this.queryParams[0].gl_id;
        this.loadData(this.glID);
        
      }
      else {this.isDisabled = true;};
    }
    this.loadVenderAccounts(this.venderUID);

    }
   
    async loadAllLUD(id: any) {
      
      var luhData = [{value:id}]
      let response = await this.luService.getLUD(luhData);
      if (id=='13'){this.currencyDataList = response;}
      if (id=='12'){this.courierDataList = response;}
      if (id=='GAH'){this.glAccountHeadsDataList = response;}
     
      
       //console.log("Data in LUD list " + this.LUDdataList.length );
    };
  
    // single getter for all form controls to access them from the html
    get fc() { return this.dataForm.controls; }
  
    async loadData(id: any) {
      this.isBusy = true;
      this.dataForm.disable();
     
      var gl_id = [{name: "gl_id" , value: id}];
      this.response = await this.webService.getThisGL(gl_id);
     
      this.dataId = this.response._id;
      this.response.gl_date = new Date(this.response.gl_date).toISOString().slice(0, 10);
      this.response.funds_sent_on = new Date(this.response.funds_sent_on).toISOString().slice(0, 10);
      this.response.funds_received_on = new Date(this.response.funds_received_on).toISOString().slice(0, 10);
      this.response.cargo_requested_on = new Date(this.response.cargo_requested_on).toISOString().slice(0, 10);
      this.response.cargo_shipped_on = new Date(this.response.cargo_shipped_on).toISOString().slice(0, 10);
      this.response.cargo_received_on = new Date(this.response.cargo_received_on).toISOString().slice(0, 10);
      
      
      //this.response.stock_received_on = new Date(this.response.stock_received_on).toISOString().slice(0, 16);
      //new Date().toISOString().slice(0, 16);
      this.dataForm.patchValue(this.response);
      //this.venderName = this.dataForm.value.stock_uid;
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
     
      console.log('On submit');
      //console.log('Data: ' +  this.angForm.value  );
     
      if (this.dataForm.valid) {
        // operation = 1 - new record
        if (this.queryParams[0].operation == 1) {
         
          this.addData();
        }
        // operation = 2 - update record
        else {
         
          this.updateData();
        }
       
        this.submitted = false;
        this.isBusy = false;
        //this.userForm.reset();
        //this.router.navigate(['user']);
       // window.location.href = './lu';
       this.dialogRef.close('save');
      }
      else {
        
        this.messagetext = 'Please provide valid values';
        this.isBusy = false;
       
      }
  
    }
  
    addData() {
      //console.log('data: ' + this.dataForm.value.name);
      this.dataForm.controls.created_on.setValue(Date.now());
      this.dataForm.controls.vender_uid.setValue(this.venderUID);
      //this.userForm.controls.user_name.setValue(upper(this.user_name));
      this.webService.addGL(this.dataForm.value).subscribe(
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
     
  
      //this.userForm.controls.user_name.setValue(upper(this.user_name));
      this.webService.updateGL(this.dataForm.value).subscribe(
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
    
    }
  
    async loadVenderAccounts(venderUID: any)
    {
   
    var response;
    response = await this.venderAccountsService.getOneVenderAccounts([{"value":venderUID}]);
    this.venderAccountsDataList = response;
    
    }

    selectAccountHead(){
      if (this.dataForm.value.account_head_code == 'LFR')
      {this.venderAccountsDataList = [];}
    }

    selectSentToVender(){
      this.loadVenderAccounts(this.dataForm.value.sent_to_vender_uid);
      
    }

  }