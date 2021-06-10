import { Component, OnInit , Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {vendersWS} from '../../ws/vendersWS';
import { Router } from "@angular/router";
import {sessionService} from '../../ws/sessionWS';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { utilWS } from '../../ws/utilWS';
import {countriesWS} from '../../ws/countriesWS';
import {citiesWS} from '../../ws/citiesWS';
import {statesWS} from '../../ws/statesWS';


interface DialogData {
  data: string;
}

@Component({
  selector: 'app-vender-new',
  templateUrl: './vender-new.component.html',
  styleUrls: ['./vender-new.component.css']
})
export class VenderNewComponent implements OnInit {



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
  venderDataList: any = [];
  venderID = "";
  todayDate = new Date().toISOString().slice(0, 16);
  countriesDataList : any = [];
  citiesDataList : any = [];
  statesDataList : any = [];

  messagetext = '';
  constructor(
    private sessionService: sessionService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VenderNewComponent>,
    private utilService : utilWS,
    private vendersService : vendersWS,
    private countriesService : countriesWS,
    private citiesService : citiesWS,
    private statesService : statesWS,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { this.OnStart() }

  ngOnInit() {
    this.dataForm = this.fb.group({
      id: ['', []],
      vender_uid: [this.utilService.getUID('vender_uid'), []],
      vender_name: ['', []],
      vender_code: ['', []],
      vender_desc: ['', []],
      country_uid: ['', []],
      state_uid: ['', []],
      city_uid: ['', []],
      postal_code: ['', []],
      zip_code: ['', []],
      email: ['', []],
      phone1: ['', []],
      phone2: ['', []],
      address1: ['', []],
      address2: ['', []],
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

    this.queryParams = this.sessionService.getParameters();
    // alert('point 1 - ' + this.queryParams[0].name);
    if (this.queryParams.length > 0 ) {
      
    // if operation = 1- new record  
    this.isDisabled = true; 
    if (this.queryParams[0].operation == 1) {
      // alert('point 2');
      
      //this.venderUID = this.queryParams[0].vender_uid;
    }
     // if operation = 2- update record   
    else if (this.queryParams[0].operation == 2)
    {
      this.venderID = this.queryParams[0].vender_id;
      
      this.loadData(this.queryParams);
      
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
    var venderToLoad = [{name: "vender_id" , value: id[0].vender_id}];
    this.response = await this.vendersService.getThisVenders(venderToLoad);
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
    this.dataForm.controls.vender_uid.setValue(this.utilService.getUID('vender_uid'));
    //this.dataForm.controls.item_uid.setValue(this.itemUID);
    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.vendersService.addVenders(this.dataForm.value).subscribe(
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
    this.vendersService.updateVenders(this.dataForm.value).subscribe(
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
  //alert("Venders loaded - " + this.vendersDataList.length);
  }

  async loadStates()
  {
  var response;
  response = await this.statesService.getStates();
  this.statesDataList = response;
  //alert("Venders loaded - " + this.vendersDataList.length);
  }

  async loadCities()
  {
  var response;
  response = await this.citiesService.getCities();
  this.citiesDataList = response;
  //alert("Venders loaded - " + this.vendersDataList.length);
  }

}