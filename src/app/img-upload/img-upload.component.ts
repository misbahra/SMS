import { Component, OnInit } from '@angular/core';
import {imguploadWS} from '../ws/img-uploadWS';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.css']
})
export class ImgUploadComponent  {
  

  imageObj: File;
   imageUrl: string;

  constructor(private imgUploadService: imguploadWS) {
    
   }

 ngOnInit() {
  }

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
  
  }


