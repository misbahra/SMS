import { Component, OnInit , Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {salWS}  from '../../ws/salWS';
import { Router } from "@angular/router";
import * as wsrSessionService from '../../ws/sessionWS';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { AbstractControl } from '@angular/forms';
import { utilWS } from '../../ws/utilWS';
import { mainWS } from '../../ws/mainWS';
import { luWS } from '../../ws/luWS';

interface DialogData {
  data: string;
}

@Component({
  selector: 'app-new-sal-details',
  templateUrl: './new-sal-details.component.html',
  styleUrls: ['./new-sal-details.component.css']
})
export class NewSalDetailsComponent implements OnInit {

  
  dataForm: FormGroup;
  submitted = false;
  isBusy = false;
  queryParams: any = [];
  isDisabled = false;
  response: any = [];
  invalid: any = [];
  dataId: any = "";
  
  salHeaderDataList: any = [];
  payHeadList: any = [];
   

  messagetext = '';
  constructor(private webService: salWS,
    private sessionService: wsrSessionService.sessionService,
    private router: Router,
    private fb: FormBuilder,
    private utilService : utilWS,
    private resourceService : mainWS,
    private luService: luWS,
    public dialogRef: MatDialogRef<NewSalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { this.OnStart() }

  ngOnInit() {
    this.dataForm = this.fb.group({

      id:  ['', []],
      sal_detail_uid:  [ this.utilService.getUID("sal_detail_uid"), [Validators.required]],
      sal_header_uid:  ['', [Validators.required]],
      pay_head:  ['', [Validators.required]],
      pay_amount:  ['', [Validators.required]],
      paid_on : [new Date().toISOString().slice(0, 16), [Validators.required]],
      remarks: ['', []],
      created_by: ['', []],
      created_on:['', []],
      modified_by: ['', []],
      modified_on: ['', []],
    }
      // , { validator: this.CheckUserName('UserName') }
    );

    this.loadAllLUD('15');

    

    this.queryParams = this.sessionService.getParameters();
     //alert('point 1 - ' + this.queryParams[0].name);
    if (this.queryParams.length > 0 ) {
    if (this.queryParams[0].name == "sal_detail_id") {
       //alert('point 2');
      this.isDisabled = true;
      this.loadData(this.queryParams);
    }
    else if (this.queryParams[0].name == "sal_header_uid")
    {
      this.dataForm.controls.sal_header_uid.setValue(this.queryParams[0].value);
    }
  }
   
  }

  async loadAllLUD(id: any) {
    //alert("loading lud comp");  
    var luhData = [{value:id}]
    let response = await this.luService.getLUD(luhData);
    if (id=='15'){this.payHeadList = response;}
     //console.log("Data in LUD list " + this.LUDdataList.length );
  };
 

    
  // single getter for all form controls to access them from the html
  get fc() { return this.dataForm.controls; }

  async loadData(id: any) {
    this.isBusy = true;
    this.dataForm.disable();
    //alert('loading data - ' + id[0].value);
    this.response = await this.webService.getThisSalDetail(id);
    //alert('data - ' + this.response.name);
    this.dataId = this.response._id;
    this.response.paid_on = this.response.paid_on.slice(0, 16);
    this.dataForm.patchValue(this.response);
    //this.luhCode = this.dataForm.value.luh_code;
    this.dataForm.enable();
    this.dataForm.controls.sal_header_uid.disable();
    this.dataForm.controls.sal_detail_uid.disable();
    this.isBusy = false;
  };

  OnStart() {
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

    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.webService.addSalDetails(this.dataForm.value).subscribe(
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
    this.webService.updateSalDetails(this.dataForm.value).subscribe(
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