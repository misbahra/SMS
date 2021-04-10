import { Component, OnInit } from '@angular/core';
import {imguploadWS} from '../ws/img-uploadWS';
import { sessionService } from '../ws/sessionWS';
import {appdataWS} from '../ws/appdataWS';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
interface DialogData {
  data: string;
}

@Component({
  selector: 'app-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.css']
})
export class ImgUploadComponent implements OnInit {
  
  queryParams: any = [];
  connUser : any = this.sessionService.getConnectedUsers();
  submitted = false;
  isBusy = false; 
  messagetext = '';
  is_offer_visible = false;
  dataForm: FormGroup;
  imageObj: File;
   imageUrl: string;
   userPrivs = {	insert_allowed : false,
                  update_allowed : false,
                  delete_allowed : false,
                  view_allowed : false};

  constructor(private imgUploadService: imguploadWS, 
              private appDataService: appdataWS,   
              private sessionService: sessionService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<ImgUploadComponent>,
              ) {
    
   }

 ngOnInit() {
  this.userPrivs = this.sessionService.getUsersPrivs('UPL');

  this.dataForm = this.fb.group({

    id: ['', []],
    name: ['', [Validators.required]],
    desc: ['', [Validators.required]],
    price: [, []],
    price_unit: ['', []],
    active: [true, []],
    is_in_stock: [false, []],
    is_new: [false, []],
    is_offer: [false, []],
    offer_type: ['', []],
    discount_rate:[, []],
    url: ['', []],
    uploaded_by: ['', []],
    uploaded_on: ['', []]

  })
  this.queryParams = this.sessionService.getParameters();
  console.log(JSON.stringify(this.queryParams));
  this.loadData();
  }


  async loadData() {
    this.isBusy = true;
    this.dataForm.disable();
    
    //var response = await this..getThisUser(userToLoad);
    //alert('data - ' + this.response.name);
    //this.dataId = this.response._id;
    this.dataForm.patchValue(this.queryParams[0].data);
    
    this.dataForm.enable();
   
    this.isBusy = false;
  };

   // single getter for all form controls to access them from the html
   get fc() { return this.dataForm.controls; }
  // ...... other methods and imports skipped for brevity
  
  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.imageObj = FILE;
   }

   onImageUpload() {
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj);
    this.imgUploadService.imageUpload(imageForm).subscribe(res => {
      console.log(res);
      console.log(res['image'].location);
      this.imageUrl = res['image'].location;
    });
   }

   onCancel() {
    //this.router.navigate(['user']);
    //window.location.href = './lu';
    this.dialogRef.close('cancel');
  }

  onOfferChange(){this.is_offer_visible = this.dataForm.value.is_offer; }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.dataForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        
      }
    }

  }

  onSubmit() {
    this.messagetext = '';
    this.submitted = true;
    this.isBusy = true;
    this.findInvalidControls();
    
    if (this.dataForm.valid) {
      // operation = 1 - new record
      if (this.queryParams[0].operation == 1) {
        //alert('add record');
        // save the selected image first
          const imageForm = new FormData();
          imageForm.append('image', this.imageObj);
          this.imgUploadService.imageUpload(imageForm).subscribe(res => {
          console.log(res);
          console.log(res['image'].location);
          this.imageUrl = res['image'].location;
          this.addData();
        });
        
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
     //this.dialogRef.close('save');
    }
    else {
      //alert('Remove Errors first ')
      alert('validation failed')
      this.messagetext = 'Please provide valid values';
      this.isBusy = false;
      // alert('clear errors');
    }
    this.dialogRef.close('save');
  }

  addData() {
    //console.log('data: ' + this.dataForm.value.name);
    this.dataForm.controls.uploaded_on.setValue(Date.now());
    this.dataForm.controls.url.setValue(this.imageUrl);
    //this.dataForm.controls.vender_uid.setValue(this.utilService.getUID('vender_uid'));
    //this.dataForm.controls.item_uid.setValue(this.itemUID);
    this.dataForm.controls.uploaded_by.setValue(this.connUser.user_name);
    var data = {_id:this.queryParams[0].id , image:this.dataForm.value}
    this.appDataService.addImage(data).subscribe(
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

    //this.dataForm.controls.modified_on.setValue(Date.now());
    this.dataForm.removeControl('id');
    this.dataForm.addControl('_id', new FormControl(['', []]));
    this.dataForm.controls._id.setValue(this.queryParams[0].id);
    //alert("Value is set to - " + this.userForm.controls._id.value);

    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    var data = {_id:this.queryParams[0].id , image:this.dataForm.value}
    this.appDataService.updateImage(data).subscribe(
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


