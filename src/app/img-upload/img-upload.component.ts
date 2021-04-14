import { Component, OnInit } from '@angular/core';
import { imguploadWS } from '../ws/img-uploadWS';
import { sessionService } from '../ws/sessionWS';
import { appdataWS } from '../ws/appdataWS';
import { utilWS } from './../ws/utilWS';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  connUser: any = this.sessionService.getConnectedUsers();
  submitted = false;
  isBusy = false;
  messagetext = '';
  is_offer_visible = false;
  dataForm: FormGroup;
  imageObj: File;
  imageUrl: string;
  imageName : string = this.utilService.getUID('image_upload') ;
  imageExt : string = '' ;
  userPrivs = {
    insert_allowed: false,
    update_allowed: false,
    delete_allowed: false,
    view_allowed: false
  };
  imageId : any = '';
  operation = ''; 

  constructor(private imgUploadService: imguploadWS,
    private appDataService: appdataWS,
    private sessionService: sessionService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ImgUploadComponent>,
    private utilService:utilWS,
  ) {

  }

  ngOnInit() {
    this.userPrivs = this.sessionService.getUsersPrivs('UPL');

    this.dataForm = this.fb.group({

      id: ['', []],
      title: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      price: [, []],
      price_unit: ['', []],
      active: [true, []],
      is_in_stock: [true, []],
      is_new: [true, []],
      is_offer: [false, []],
      offer_type: ['', []],
      discount_rate: [, []],
      name: ['', []],
      url: ['', []],
      uploaded_by: ['', []],
      uploaded_on: ['', []]

    })
    this.queryParams = this.sessionService.getParameters();
    this.operation = this.queryParams[0].operation;
    console.log(JSON.stringify(this.queryParams));
    if (this.operation == '2')
          {this.loadData();}
    }


  async loadData() {
    this.isBusy = true;
    this.dataForm.disable();
    this.imageId = this.queryParams[0].data._id;

    //var response = await this..getThisUser(userToLoad);
    //alert('data - ' + this.response.name);
    //this.dataId = this.response._id;
    this.dataForm.patchValue(this.queryParams[0].data);
    this.dataForm.controls.id.setValue(this.imageId);
    this.dataForm.enable();

    this.isBusy = false;
  };

  // single getter for all form controls to access them from the html
  get fc() { return this.dataForm.controls; }
  // ...... other methods and imports skipped for brevity

  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    //this.imageName = FILE.name;
    this.imageObj = FILE;

    this.imageExt = FILE.name.split('?')[0].split('.').pop();

  }

  onImageUpload() {
    const imageForm = new FormData();
    //imageForm.append('image', this.imageObj);

    imageForm.append('image', this.imageObj, this.imageName+'.'+this.imageExt);
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

  onOfferChange() { this.is_offer_visible = this.dataForm.value.is_offer; }

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
    
    this.messagetext = 'Start of submit';
    
    // file will not be selectable on update mode
    if ((this.imageObj && this.operation == '1') || (this.operation == '2')) {
      this.messagetext = '';
      this.submitted = true;
      this.isBusy = true;
      this.findInvalidControls();

      if (this.dataForm.valid) {
        // operation = 1 - new record
        if (this.operation == '1') {
          //alert('add record');
          // save the selected image first
          const imageForm = new FormData();
          //imageForm.append('image', this.imageObj);
          imageForm.append('image', this.imageObj, this.imageName+'.'+this.imageExt);
          this.imgUploadService.imageUpload(imageForm).subscribe(res => {
            //console.log(res);
            //console.log(res['image'].location);
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
        console.log('validation failed')
        this.messagetext = 'Please provide valid values';
        // alert('clear errors');
      }

    }
    else { alert('No File Selected') 
    this.messagetext = 'Please select a file';
    }

    
    this.isBusy = false;

  }

  async addData() {
    //console.log('data: ' + this.dataForm.value.name);
    this.dataForm.controls.uploaded_on.setValue(Date.now());
    this.dataForm.controls.name.setValue(this.imageName+'.'+this.imageExt);
    this.dataForm.controls.url.setValue(this.imageUrl);
    //this.dataForm.controls.vender_uid.setValue(this.utilService.getUID('vender_uid'));
    //this.dataForm.controls.item_uid.setValue(this.itemUID);
    this.dataForm.controls.uploaded_by.setValue(this.connUser.user_name);
    var data = { _id: this.queryParams[0].id, image: this.dataForm.value }
    await this.appDataService.addImage(data).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Data added' + response);
        this.dialogRef.close('save');
        // this.loadAllUsers();

      },
      (error) => {
        //Handle the error here
        alert('There is some error in saving data');
        console.error(error);

      })

  }


  updateData() {
    console.log('data: ' + this.dataForm.value.name);

    //this.dataForm.controls.modified_on.setValue(Date.now());
   
    this.dataForm.removeControl('id');
    this.dataForm.addControl('_id', new FormControl(['', []]));
    this.dataForm.controls._id.setValue(this.imageId);
    //alert("Value is set to - " + this.userForm.controls._id.value);

    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    var data = this.dataForm.value ;
    this.appDataService.updateImage(data).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Data updated' + response);

        this.dialogRef.close('save');

      },
      (error) => {
        //Handle the error here
        this.dataForm.removeControl('_id');
        this.dataForm.addControl('id', new FormControl(['', []]));
        this.dataForm.controls.id.setValue(this.imageId);

        alert('There is some error in saving data');
        console.error(error);

      })
    this.dataForm.removeControl('_id');
  }


}


