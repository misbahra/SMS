import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Login/login.component';
import { UserComponent } from './User/user.component';
import { MenuComponent } from './Menu/menu.component';
import { HomeComponent } from './Home/home.component';
import { mainWS } from './ws/mainWS';
import {sessionService} from './ws/sessionWS';
import {AgGridModule} from "@ag-grid-community/angular";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LuComponent } from './lu/lu.component';
import { LuhNewComponent } from './lu/luh-new/luh-new.component';
import { LudNewComponent } from './lu/lud-new/lud-new.component';
import {luWS} from './ws/luWS';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    MenuComponent,
    HomeComponent,
    LuComponent,
    LuhNewComponent,
    LudNewComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AgGridModule.withComponents([]),
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [
    mainWS,
    sessionService,
    luWS
  ],
  bootstrap: [AppComponent],
  entryComponents: [LuhNewComponent]
})
export class AppModule { }
