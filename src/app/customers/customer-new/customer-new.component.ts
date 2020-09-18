import { Component, OnInit , Inject} from '@angular/core';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import {customersWS} from '../../ws/customersWS';
  import { Router } from "@angular/router";
  import {sessionService} from '../../ws/sessionWS';
  import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
  import { utilWS } from '../../ws/utilWS';
  import {countriesWS} from '../../ws/countriesWS';
  import {citiesWS} from '../../ws/citiesWS';
  import {statesWS} from '../../ws/statesWS';
  import { luWS } from '../../ws/luWS';
  
  
  interface DialogData {
    data: string;
  }

@Component({
  selector: 'app-customer-new',
  templateUrl: './customer-new.component.html',
  styleUrls: ['./customer-new.component.css']
})
export class CustomerNewComponent implements OnInit {
  
  
  
  
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
    customerDataList: any = [];
    customerID = "";
    todayDate = new Date().toISOString().slice(0, 16);
    countriesDataList : any = [];
    citiesDataList : any = [];
    statesDataList : any = [];
    genderDataList : any = [];
  
    messagetext = '';
    constructor(
      private sessionService: sessionService,
      private router: Router,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<CustomerNewComponent>,
      private utilService : utilWS,
      private customersService : customersWS,
      private countriesService : countriesWS,
      private citiesService : citiesWS,
      private statesService : statesWS,
      private LUDService : luWS,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { this.OnStart() }
  
    ngOnInit() {
      this.dataForm = this.fb.group({
        id: ['', []],
        customer_uid: [this.utilService.getUID('customer_uid'), []],
        name: ['', []],
        phone: ['', []],
        mobile: ['', []],
        email: ['', []],
        address: ['', []],
        card_no: ['', []],
        country_uid: ['', []],
        state_uid: ['', []],
        city_uid: ['', []],
        gender: ['', []],
        created_by: ['', []],
        created_on: ['', []],
        modified_by: ['', []],
        modified_on: ['', []]
      }
        // , { validator: this.CheckUserName('UserName') }
      );
      
      //load lovs data for list population
      this.loadCountries();
      this.loadStates();
      this.loadCities();
      this.loadAllLUD('7');
  
      this.queryParams = this.sessionService.getParameters();
      // alert('point 1 - ' + this.queryParams[0].name);
      if (this.queryParams.length > 0 ) {
        
      // if operation = 1- new record  
      this.isDisabled = true; 
      if (this.queryParams[0].operation == 1) {
        // alert('point 2');
        
        //this.customerUID = this.queryParams[0].customer_uid;
      }
       // if operation = 2- update record   
      else if (this.queryParams[0].operation == 2)
      {
        this.customerID = this.queryParams[0].customer_id;
        
        this.loadData(this.queryParams);
        
      }
      else {this.isDisabled = true;};
    }
     
    }
   
    async loadAllLUD(id: any) {
      //alert("loading lud comp");  
      var luhData = [{value:id}]
      let response = await this.LUDService.getLUD(luhData);
      if (id=='7'){this.genderDataList = response;}
     
       //console.log("Data in LUD list " + this.LUDdataList.length );
    };
  
    // single getter for all form controls to access them from the html
    get fc() { return this.dataForm.controls; }
  
    async loadData(id: any) {
      this.isBusy = true;
      this.dataForm.disable();
      //alert('loading data - ' + userid[0].value);
      var customerToLoad = [{name: "customer_id" , value: id[0].customer_id}];
      this.response = await this.customersService.getThisCustomers(customerToLoad);
      //alert('data - ' + this.response.name);
      this.dataId = this.response._id;
      this.dataForm.patchValue(this.response);
      
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
       this.dialogRef.close({message:'save' , customer_uid: this.dataForm.value.customer_uid });
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
      this.dataForm.controls.customer_uid.setValue(this.utilService.getUID('customer_uid'));
      //this.dataForm.controls.item_uid.setValue(this.itemUID);
      //this.userForm.controls.user_name.setValue(upper(this.user_name));
      this.customersService.addCustomers(this.dataForm.value).subscribe(
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
      this.customersService.updateCustomers(this.dataForm.value).subscribe(
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
  
    async loadCountries()
    {
    var response;
    response = await this.countriesService.getCountries();
    this.countriesDataList = response;
    //alert("customers loaded - " + this.customersDataList.length);
    }
  
    async loadStates()
    {
    var response;
    response = await this.statesService.getStates();
    this.statesDataList = response;
    //alert("customers loaded - " + this.customersDataList.length);
    }
  
    async loadCities()
    {
    var response;
    response = await this.citiesService.getCities();
    this.citiesDataList = response;
    //alert("customers loaded - " + this.customersDataList.length);
    }
  
  }