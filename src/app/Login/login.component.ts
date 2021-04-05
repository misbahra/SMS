import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {mainWS} from '../ws/mainWS';
import { Router } from "@angular/router";
import {sessionService} from '../ws/sessionWS';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
    LoginForm: FormGroup;
    model: any = {};
    resp: any = [];
    userPermissions: any = [];
    
    submitted = false;
    isBusy = false;
  
    messagetext = '';
    constructor(private webService: mainWS,
      private sessionService: sessionService,
      private router: Router,
      private fb: FormBuilder
    ) { this.OnStart() }
  
    ngOnInit() {
      this.LoginForm = this.fb.group({
        UserName: ['', [Validators.required, Validators.minLength(4)]],
        Password: ['', [Validators.required]]
      }
        // , { validator: this.CheckUserName('UserName') }
      );
      //this.LoginForm.controls.UserName.setValue('misbah');
    }
    // getter for individual form controls to access them from the htm tags
    get UserName() {
      return this.LoginForm.get('UserName'); //notice this
    }
    get Password() {
      return this.LoginForm.get('Password');  //and this too
    }
    // single getter for all form controls to access them from the html
    get fc() { return this.LoginForm.controls; }
  
    OnStart() {
    }
  
    onSubmit() {
      this.messagetext = '';
      this.submitted = true;
  
      //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
      //console.log('LoginNew.onSubmit : User --> :' + this.LoginForm.value.UserName.toUpperCase() + ' Password --> :' + this.LoginForm.value.Password);
      //console.log('Data: ' +  this.angForm.value  );
      if (this.LoginForm.valid) {
       // console.log("LoginNew.onSubmit : going to validate login");
        this.validateLogin();
  
      }
      else {
        //alert('Remove Errors first ')
        this.messagetext = 'Please provide valid values';
      }
      //alert(JSON.stringify(this.resp));
      //this.resp = [];
      //alert(this.resp);
    }

    async loadUserPermissions(id:any){
      this.userPermissions = await this.webService.getThisUserAllPermissions(id);
      console.log('loading permissions');
      console.log(JSON.stringify(this.userPermissions));
    }
  
    validateLogin() {
     // console.log("LoginNew.validateLogin :start");
      this.isBusy = true;
      this.webService.validateLogin2(this.LoginForm.value).subscribe(res => {
        // console.log('User --> :' + this.angForm.username + ' Password --> :' + this.angForm.password  );
        //setTimeout(this.donothing,500);
        //this.userPermissions = this.webService.getThisUserAllPermissions(res[0].id);
       
        this.resp = res;
        // alert(this.resp[0].msg);
        this.messagetext = this.resp[0].msg.toString();
        if (res[0].code == '1') {
          
          //console.log(res);

          //this.loadUserPermissions(res[0].id);

          //res[0].permissions = this.userPermissions;
          console.log('after ...... ');
          console.log('res :' + JSON.stringify(res));
          //console.log('permissions :' + JSON.stringify(this.userPermissions));
          
          this.sessionService.setConnectedUsers(res);

          //console.log("LoginNew.validateLogin :calling menu.ngOnInit");
          //this.menu.ngOnInit;
          //alert (this.sessionService.redirectUrl);
          if (!this.sessionService.redirectUrl || this.sessionService.redirectUrl == "" )
          {// Navigate to the login page with extras
            window.location.href = './';
          }
          else{
            // Navigate to the login page with extras
            let url = this.sessionService.redirectUrl;
            this.sessionService.redirectUrl = "";
            //alert ("navigating to :" + url);
            window.location.href = '.' + url;
            //this.router.navigate(['.' + url]);
          }
         
         
         
          // this.router.navigateByUrl('home').then(e => {
          //   if (e) {
          //     console.log("LoginNew.validateLogin :Navigation is successful!");
          //   } else {
          //     console.log("LoginNew.validateLogin :Navigation has failed!" + e);
          //   }
          // })
        }
        else {
  
  
          this.LoginForm.controls.UserName.touched;
  
          // this.router.navigateByUrl('home').then(e => {
          //   if (e) {
          //     console.log("Navigation is successful!");
          //   } else {
          //     console.log("Navigation has failed!");
          //   }
          // })
        }
        this.isBusy = false;
  
      });
    }
  
    donothing() { }
  
    onReset() {
      this.submitted = false;
      this.LoginForm.reset();
    }
  
  
    // custom validator to check that two fields match
    CheckUserName(controlName: string) {
      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
  
  
        if (control.errors && !control.errors.invaliduser) {
          // return if another validator has already found an error on the matchingControl
          return;
        }
  
        // set error on matchingControl if validation fails
        if (control.value !== 'misbah') {
          control.setErrors({ invaliduser: true });
        }
      }
    }
  
  
  }
  
