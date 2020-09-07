
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { WsrLoginComponent } from './wsr-login/wsr-login.component';
 import { LoginComponent } from './Login/login.component';
 import { HomeComponent } from './Home/home.component';
 import { MenuComponent } from './Menu/menu.component';
// import { UserHomeComponent } from './user-home/user-home.component';
 import {UserComponent} from './User/user.component';
// import {WsrNewUserComponent} from './wsr-users/wsr-new-user/wsr-new-user.component';
 import{LuComponent} from './lu/lu.component';
 import{LuhNewComponent} from './lu/luh-new/luh-new.component';
 import{LudNewComponent} from './lu/lud-new/lud-new.component';
 import{OrdersComponent} from './orders/orders.component';
 import{NewOrderComponent} from './orders/new-order/new-order.component';
 import{StockComponent} from './stock/stock.component';
 import{GlComponent} from './gl/gl.component';
 import{SalesComponent} from './Reports/sales/sales.component';
 import{VendersComponent} from './venders/venders.component';
 // import{WsrMainComponent} from './wsr-main/wsr-main.component';
// import{WsrMainNewComponent} from './wsr-main/wsr-main-new/wsr-main-new.component';
// import { FeedbackComponent } from './feedback/feedback.component';
// import { FeedbackNewComponent } from './feedback/feedback-new/feedback-new.component';
// import {ClientReportComponent} from './export/client-report/client-report.component';
// import {CapacityComponent} from './capacity/capacity.component';
// import {CapacityNewComponent} from './capacity/capacity-new/capacity-new.component';
// import {OrcDataComponent} from './import/orc-data/orc-data.component';
// import { WsrReportComponent } from './export/wsr-report/wsr-report.component';
// import {NotFoundComponent} from './not-found/not-found.component';
import { AuthGuard }   from './ws/authGuardService';


  // { path: 'login',   component: WsrLoginComponent , canActivate: [AuthGuard]},
  // { path: 'welcome',   component: UserHomeComponent  , canActivate: [AuthGuard]},
  // { path: 'login-new',   component: WsrLoginNewComponent},
  // { path: 'user',   component: UserComponent , canActivate: [AuthGuard]},
  // { path: 'adduser',   component: WsrNewUserComponent  , canActivate: [AuthGuard]},
  // { path: 'lu',   component: LUComponent , canActivate: [AuthGuard]},
  // { path: 'addluh',   component: LuhNewComponent , canActivate: [AuthGuard]},
  // { path: 'wsr',   component: WsrMainComponent , canActivate: [AuthGuard]},
  // { path: 'addwsr',   component: WsrMainNewComponent , canActivate: [AuthGuard]},
  // { path: 'feedback',   component: FeedbackComponent , canActivate: [AuthGuard]},
  // { path: 'addfeedback',   component: FeedbackNewComponent , canActivate: [AuthGuard]},
  // { path: 'clientreport',   component: ClientReportComponent , canActivate: [AuthGuard]},
  // { path: 'capacity',   component: CapacityComponent , canActivate: [AuthGuard]},
  // { path: 'addcapacity',   component: CapacityNewComponent , canActivate: [AuthGuard]},
  // { path: 'orcimport',   component: OrcDataComponent , canActivate: [AuthGuard]},
  // { path: 'wsrreport',   component: WsrReportComponent , canActivate: [AuthGuard]},
  // {path: '**', component: NotFoundComponent}

const routes: Routes = [
  { path: '',       component: HomeComponent},
  { path: 'home',    component: HomeComponent},
  { path: 'user',   component: UserComponent },
  { path: 'login-new',   component: LoginComponent},
  { path: 'lu',   component: LuComponent },
  { path: 'order',   component: OrdersComponent },
  { path: 'neworder',   component: NewOrderComponent },
  { path: 'stock',   component: StockComponent },
  { path: 'gl',   component: GlComponent },
  { path: 'salesRep',   component: SalesComponent },
  { path: 'vender',   component: VendersComponent },
  
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }