
  import { Component, OnInit , Inject} from '@angular/core';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import {mainWS} from '../../ws/mainWS';
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
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {

  
  
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
    resourceID = "";
    todayDate = new Date().toISOString().slice(0, 16);
    departmentsDataList : any = [];
    designationsDataList : any = [];
    userRolesDataList : any = [];
    yesNoDataList : any = [];
    connUser : any = this.sessionService.getConnectedUsers();
  
    messagetext = '';
    constructor(
      private sessionService: sessionService,
      private router: Router,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<UserNewComponent>,
      private utilService : utilWS,
      private userService : mainWS,
      private countriesService : countriesWS,
      private citiesService : citiesWS,
      private statesService : statesWS,
      private LUDService : luWS,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { this.OnStart() }
  
    ngOnInit() {
      this.dataForm = this.fb.group({
        id: ['', []],
        resource_uid: [, []],
        name: ['', [Validators.required]],
        employee_id: ['', []],
        user_name: ['', [Validators.required]],
        password: ['', [Validators.required]],
        designation: ['', []],
        department: ['', []],
        off_email: ['', []],
        personal_email: ['', []],
        office_phone: ['', []],
        mobile_phone: ['', []],
        locked: ['N', [Validators.required]],
        active: ['Y', [Validators.required]],
        app_role: ['', [Validators.required]],
        created_by: ['', []],
        created_on: ['', []],
        modified_by: ['', []],
        modified_on: ['', []]
      }
        // , { validator: this.CheckUserName('UserName') }
      );
      
      //load lovs data for list population
     
      this.loadAllLUD('DEP');
      this.loadAllLUD('DES');
      this.loadAllLUD('20');  // Yes / No
      this.loadAllLUD('USR');
  
      this.queryParams = this.sessionService.getParameters();
      // alert('point 1 - ' + this.queryParams[0].name);
      if (this.queryParams.length > 0 ) {
        
      // if operation = 1- new record  
      this.isDisabled = true; 
      if (this.queryParams[0].operation == 1) {
        

        this.dataForm.controls.resource_uid.setValue(this.utilService.getUID('resource_uid'));
      }
       // if operation = 2- update record   
      else if (this.queryParams[0].operation == 2)
      {
        this.resourceID = this.queryParams[0].resource_id;
        
        this.loadData(this.queryParams);
        
      }
      else {this.isDisabled = true;};
    }
     
    }
   
    async loadAllLUD(id: any) {
      //alert("loading lud comp");  
      var luhData = [{value:id}]
      let response = await this.LUDService.getLUD(luhData);
      if (id=='DEP'){this.departmentsDataList = response;}
      if (id=='DES'){this.designationsDataList = response;}
      if (id=='USR'){this.userRolesDataList = response;}
      if (id=='20'){this.yesNoDataList = response;}
     
       //console.log("Data in LUD list " + this.LUDdataList.length );
    };
  
    // single getter for all form controls to access them from the html
    get fc() { return this.dataForm.controls; }
  
    async loadData(id: any) {
      this.isBusy = true;
      this.dataForm.disable();
      //alert('loading data - ' + userid[0].value);
      var userToLoad = [{name: "resource_id" , value: id[0].resource_id}];
      this.response = await this.userService.getThisUser(userToLoad);
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
       this.dialogRef.close({message:'save' , resource_uid: this.dataForm.value.resource_uid });
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
      this.dataForm.controls.created_by.setValue(this.connUser.user_name);
      //this.dataForm.controls.item_uid.setValue(this.itemUID);
      //this.userForm.controls.user_name.setValue(upper(this.user_name));
      this.userService.AddUser(this.dataForm.value).subscribe(
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
      this.dataForm.controls.modified_on.setValue(Date.now());
      this.dataForm.controls.modified_by.setValue(this.connUser.user_name);
  
      //this.userForm.controls.user_name.setValue(upper(this.user_name));
      this.userService.UpdateUser(this.dataForm.value).subscribe(
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