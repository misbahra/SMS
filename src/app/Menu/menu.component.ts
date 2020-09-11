import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { mainWS } from '../ws/mainWS';
import {sessionService} from '../ws/sessionWS';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private webService: mainWS,
    private sessionService: sessionService,
    private router: Router) 
    {
      //this.loadConnectedUser();
     }

  title = 'SMS';
  connectedUser: any = [];

  // async loadConnectedUser() {
  //   this.connectedUser = await this.sessionService.getConnectedUsers();
  //  //this.connectedUser = this.sessionService.connectedUser;
  //   console.log('I am in menue load connected user-' + this.connectedUser.name)
  // };

   ngOnInit() {
      //this.loadConnectedUser();
      //console.log('menu.ngOnInit: start ');
     // console.log(JSON.parse(localStorage.getItem('conUser')) || []);
      this.connectedUser = JSON.parse(localStorage.getItem('conUser')) || [];
      //this.loadConnectedUser();
      //this.connectedUser = this.sessionService.getConnectedUsers();
      //this.connectedUser = this.sessionService.connectedUser;
      //console.log('menu.ngOnInit: connected user -' + this.connectedUser.name)
   }

  LogOut() {
    //console.log('menu.LogOut: start ');
    this.webService.LogOut(this.connectedUser).subscribe(res => {
      this.sessionService.logout();
      this.ngOnInit();
      //  this.router.navigateByUrl('').then(e => {
      //   if (e) {
      //     console.log("menu.LogOut: Navigated to home");
      //   } else {
      //     console.log("menu.LogOut: Navigation to home failed");
      //   }
      // })
      window.location.href = './';
      })
  }

  Login() {
    
       this.router.navigateByUrl('login').then(e => {
        if (e) {
          
          console.log("menu.Login: Navigation to login is successful!");
         
        } else {
          console.log("menu.Login: Navigation to login has failed!" + e);
        }
        
      })
      
  }

  LoginNew() {
    this.sessionService.redirectUrl = "";
    this.router.navigateByUrl('login-new').then(e => {
     if (e) {
      
       console.log("menu.LoginNew: Navigation to login-new is successful!");
     } else {
       console.log("menu.LoginNew: Navigation to login-new is failed!:" + e);
     }
     //setTimeout(function(){ this.ngOnInit(); alert("Hello timeout "); }, 5000);
    })
   
}
}
