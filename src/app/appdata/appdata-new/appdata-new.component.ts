import { Component, OnInit , Inject} from '@angular/core';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import {luWS} from '../../ws/luWS';
  import { appdataWS } from '../../ws/appdataWS';
  import { Router } from "@angular/router";
  import * as wsrSessionService from '../../ws/sessionWS';
  import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
  import { utilWS } from '../../ws/utilWS';
  
  
  
  interface DialogData {
    data: string;
  }

@Component({
  selector: 'app-appdata-new',
  templateUrl: './appdata-new.component.html',
  styleUrls: ['./appdata-new.component.css']
})
export class AppdataNewComponent implements OnInit {

 
    
      dataForm: FormGroup;
      model: any = {};
      resp: any = [];
      submitted = false;
      isBusy = false;
      queryParams: any = [];
      isDisabled = false;
      response: any = [];
      invalid: any = [];
      id = "";
      enableVenderList = false;
      todayDate = new Date().toISOString().slice(0, 16);
      categoryDataList : any = [];
      typeDataList : any = [];
      suitDataList : any = [];
      stuffDataList : any = [];
      brandDataList : any = [];
      venderAccountsDataList : any = [];
    
      messagetext = '';
      constructor(private webService: appdataWS,
        private sessionService: wsrSessionService.sessionService,
        private router: Router,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AppdataNewComponent>,
        private utilService : utilWS,
        private luService: luWS,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
      ) { this.OnStart() }
    
      ngOnInit() {
        this.dataForm = this.fb.group({
          id: ['', []],
          category: ['' , [Validators.required]],
          type: ['' , [Validators.required]],
          suit_type: ['' , [Validators.required]],
          stuff: ['' , [Validators.required]],
          brand: ['' , [Validators.required]],
          active: [true , [Validators.required]],
          created_by: ['' , []],
          created_on: ['' , []],
          modified_by: ['' , []],
          modified_on: ['' , []],
        }
          // , { validator: this.CheckUserName('UserName') }
        );
        
        //load vender for list population
       
      this.loadAllLUD('ACT'); //app data categories
      this.loadAllLUD('ATP'); // app data types
      this.loadAllLUD('AST'); // app data suits types
      this.loadAllLUD('ASF'); // app data stuff
      this.loadAllLUD('ABR'); // app data brand
    
        this.queryParams = this.sessionService.getParameters();
        
        if (this.queryParams.length > 0 ) {
          
        // if operation = 1- new record  
        this.isDisabled = true; 
        if (this.queryParams[0].operation == '1') {
          this.id ='';           
          
        }
         // if operation = 2- update record   
        else if (this.queryParams[0].operation == '2')
        {
          this.id = this.queryParams[0].id;
          this.dataForm.patchValue(this.queryParams[0].data);      
          
        }
        else {this.isDisabled = true;};
      }
     
  
      }
  
      OnStart(){}
     
      async loadAllLUD(id: any) {

        var luhData = [{value:id}]
        let response = await this.luService.getLUD(luhData);
        if (id=='ACT'){this.categoryDataList = response;}
        if (id=='ATP'){this.typeDataList = response;}
        if (id=='AST'){this.suitDataList = response;}
        if (id=='ASF'){this.stuffDataList = response;}
        if (id=='ABR'){this.brandDataList = response;}
       
        
         //console.log("Data in LUD list " + this.LUDdataList.length );
      };
    
      // single getter for all form controls to access them from the html
      get fc() { return this.dataForm.controls; }
    
     
    
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
        
        //this.userForm.controls.user_name.setValue(upper(this.user_name));
        this.webService.addAD(this.dataForm.value).subscribe(
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
        this.dataForm.controls._id.setValue(this.id);
       
    
        //this.userForm.controls.user_name.setValue(upper(this.user_name));
        this.webService.updateAD(this.dataForm.value).subscribe(
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
