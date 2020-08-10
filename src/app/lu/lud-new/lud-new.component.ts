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
  selector: 'app-lud-new',
  templateUrl: './lud-new.component.html',
  styleUrls: ['./lud-new.component.css']
})
export class LudNewComponent implements OnInit {
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
  LUDdataList: any = [];
  luhCode = "";
  ludCode = "";


  selectedID: any = "No Selected";
  selectedCode: any = [];
  isluhCodeSelected: boolean = false;

  messagetext = '';
  constructor(private webService: luWS.luWS,
    private sessionService: wsrSessionService.sessionService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LudNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { this.OnStart() }

  ngOnInit() {
    this.dataForm = this.fb.group({
      id: ['', []],
      luh_code: ['', [Validators.required]],
      lud_desc: ['', [Validators.required]],
      lud_code: ['', [Validators.required , Validators.minLength(3), Validators.maxLength(4) ,this.checkDuplicate.bind(this)]],
      value: ['', []],
      display_order: ['', [Validators.required]],
      active: ['Y', []],
      freezed: ['N', []],
      created_by: ['', []],
      created_on: ['', []],
      modified_by: ['', []],
      modified_on: ['', []]
    }
      // , { validator: this.CheckUserName('UserName') }
    );

    this.queryParams = this.sessionService.getParameters();
    // alert('point 1 - ' + this.queryParams[0].name);

    if (this.queryParams.length > 0 )
    {
    if (this.queryParams[0].name == "lud_id") {
      // alert('point 2');
      this.isDisabled = true;
      this.loadData(this.queryParams);
    }
    if (this.queryParams[0].name == "luh_code") {
     // alert("test 2-" + this.queryParams[0].value);
     this.luhCode = this.queryParams[0].value;
      this.dataForm.controls.luh_code.setValue(this.luhCode);
      this.loadLUDData(this.luhCode);
    }
   
  }

  }
 
  // single getter for all form controls to access them from the html
  get fc() { return this.dataForm.controls; }

  async loadLUDData(code: any) {
    let data = [{value: code}];
    let response = await this.webService.getLUDFromDB(data);
   this.LUDdataList = response;
   
  }

  checkDuplicate(control: AbstractControl): { [key: string]: boolean } | null {
    //alert("dup 1");
    if (control.value.length >= 3   )
    {
     
     // alert("dup 2 " + this.LUDdataList.length );
      if ( this.LUDdataList.some(function(el){return (el.lud_code == control.value )}))
      {
        if(this.ludCode != null && this.ludCode == control.value   ) {
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

  async loadAllLUD(id: any) {
    //alert("loading lud comp");  
    this.isBusy = true;
    this.response = await this.webService.getThisLUD(id);
    //alert('data - ' + this.response._id);
     this.dataId = this.response._id;
     this.dataForm.patchValue(this.response);
     //alert("header code 1 - " + this.dataForm.value.luh_code)
     this.luhCode = this.dataForm.value.luh_code;
     this.ludCode = this.dataForm.value.lud_code;
     this.loadLUDData(this.luhCode);
     this.dataForm.enable();
     this.dataForm.controls.luh_code.disable();
     
   
    this.isBusy = false;
  };

  LoadLUD(code: any) {
    this.selectedID = code[0].value;
    //this.isludCodeSelected = true;
    this.selectedCode = [];
    this.selectedCode.push({ "name": "lud_id", "value": this.selectedID });
    this.loadAllLUD(this.selectedCode);
  }
 
  async loadData(id: any) {
    this.LoadLUD(id);
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
    this.webService.addLUD(this.dataForm.value).subscribe(
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
    this.webService.updateLUD(this.dataForm.value).subscribe(
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
