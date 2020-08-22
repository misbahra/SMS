import { Component, OnInit , Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as luWS from '../../ws/luWS';
import { Router } from "@angular/router";
import * as wsrSessionService from '../../ws/sessionWS';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { AbstractControl } from '@angular/forms';

interface DialogData {
  data: string;
}
@Component({
  selector: 'app-luh-new',
  templateUrl: './luh-new.component.html',
  styleUrls: ['./luh-new.component.css']
})
export class LuhNewComponent implements OnInit {

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
    LUHdataList: any = [];
    luhCode = "";
  
    messagetext = '';
    constructor(private webService: luWS.luWS,
      private sessionService: wsrSessionService.sessionService,
      private router: Router,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<LuhNewComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { this.OnStart() }
  
    ngOnInit() {
      this.dataForm = this.fb.group({
        id: ['', []],
        luh_desc: ['', [Validators.required]],
        luh_code: ['', [Validators.required , Validators.minLength(1), Validators.maxLength(4),  this.checkDuplicate.bind(this)]],
        created_by: ['', []],
        created_on: ['', []],
        modified_by: ['', []],
        modified_on: ['', []]
      }
        // , { validator: this.CheckUserName('UserName') }
      );
      this.loadAllLUH();
      this.queryParams = this.sessionService.getParameters();
      // alert('point 1 - ' + this.queryParams[0].name);
      if (this.queryParams.length > 0 ) {
      if (this.queryParams[0].name == "luh_id") {
        // alert('point 2');
        this.isDisabled = true;
        this.loadData(this.queryParams);
      }
    }
     
    }
   
  
    async loadAllLUH() {
     
      let response = await this.webService.getLUH();
      this.LUHdataList = response;
    }
  
    checkDuplicate(control: AbstractControl): { [key: string]: boolean } | null {
      //alert("dup 1");
      if (control.value.length >= 3   )
      {
       
        //alert("dup 2");
        if ( this.LUHdataList.some(function(el){return el.luh_code === control.value}))
        {
        //alert("dup 3");
        if(this.luhCode != null && this.luhCode == control.value   ) {
          return null;
        }
          else
          {
          //alert("dup 3");
            return { 'duplicate': true };
        }
  
      }
    }
      else {return null;}
   
   };
  
    // single getter for all form controls to access them from the html
    get fc() { return this.dataForm.controls; }
  
    async loadData(id: any) {
      this.isBusy = true;
      this.dataForm.disable();
      //alert('loading data - ' + userid[0].value);
      this.response = await this.webService.getThisLUH(id);
      //alert('data - ' + this.response.name);
      this.dataId = this.response._id;
      this.dataForm.patchValue(this.response);
      this.luhCode = this.dataForm.value.luh_code;
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
  
      //this.userForm.controls.user_name.setValue(upper(this.user_name));
      this.webService.addLUH(this.dataForm.value).subscribe(
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
      this.webService.updateLUH(this.dataForm.value).subscribe(
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