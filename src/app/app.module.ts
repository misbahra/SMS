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
import { sessionService } from './ws/sessionWS';
import { AgGridModule } from "@ag-grid-community/angular";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LuComponent } from './lu/lu.component';
import { LuhNewComponent } from './lu/luh-new/luh-new.component';
import { LudNewComponent } from './lu/lud-new/lud-new.component';
import { luWS } from './ws/luWS';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { OrdersComponent } from './orders/orders.component';
import { ordersWS } from './ws/ordersWS';
import { stockWS } from './ws/stockWS';
import { customersWS } from './ws/customersWS';
import { ItemCategoriesComponent } from './item-categories/item-categories.component';
import { CustomersComponent } from './customers/customers.component';
import { StockComponent } from './stock/stock.component';
import { VendersComponent } from './venders/venders.component';
import { NewOrderComponent } from './orders/new-order/new-order.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StockNewComponent } from './stock/stock-new/stock-new.component';
import { utilWS } from './ws/utilWS';
import { vendersWS } from './ws/vendersWS';
import { GlComponent } from './gl/gl.component';
import { GlNewComponent } from './gl/gl-new/gl-new.component';
import {glWS} from './ws/glWS';
import {venderAccountsWS} from './ws/venderAccountsWS';
import { SalesComponent } from './Reports/sales/sales.component';
import { VenderNewComponent } from './venders/vender-new/vender-new.component';
import { VenderAccountsNewComponent } from './venders/vender-accounts-new/vender-accounts-new.component';
import {countriesWS} from './ws/countriesWS';
import {citiesWS} from './ws/citiesWS';
import {statesWS} from './ws/statesWS';
import { CustomerNewComponent } from './customers/customer-new/customer-new.component';
import { ItemNewComponent } from './item-categories/item-new/item-new.component';
import { CategoryNewComponent } from './item-categories/category-new/category-new.component';
import {ItemsWS} from './ws/itemsWS';
import {ItemCategoriesWS} from './ws/itemCategoriesWS';
import { LovComponent } from './lov/lov.component';
import { UserNewComponent } from './User/user-new/user-new.component';
import { SalComponent } from './sal/sal.component';
import { NewSalComponent } from './sal/new-sal/new-sal.component';


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
    OrdersComponent,
    ItemCategoriesComponent,
    CustomersComponent,
    StockComponent,
    VendersComponent,
    NewOrderComponent,
    StockNewComponent,
    GlComponent,
    GlNewComponent,
    SalesComponent,
    VenderNewComponent,
    VenderAccountsNewComponent,
    CustomerNewComponent,
    ItemNewComponent,
    CategoryNewComponent,
    LovComponent,
    UserNewComponent,
    SalComponent,
    NewSalComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AgGridModule.withComponents([]),
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    
  ],
  providers: [
    mainWS,
    sessionService,
    luWS,
    ordersWS,
    stockWS,
    customersWS,
    utilWS,
    vendersWS,
    glWS,
    venderAccountsWS,
    countriesWS,
    citiesWS,
    statesWS,
    ItemsWS,
    ItemCategoriesWS
  ],
  bootstrap: [AppComponent],
  entryComponents: [LuhNewComponent]
})
export class AppModule { }
