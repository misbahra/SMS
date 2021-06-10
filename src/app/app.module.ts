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
import {salWS} from './ws/salWS';
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
import { NewSalDetailsComponent } from './sal/new-sal-details/new-sal-details.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from "@angular/material/dialog";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSliderModule } from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import {imguploadWS} from './ws/img-uploadWS';
import { AppdataComponent } from './appdata/appdata.component';
import {appdataWS} from './ws/appdataWS';
import { AppdataNewComponent } from './appdata/appdata-new/appdata-new.component';
import { RolesComponent } from './roles/roles.component';
import { rolePermissionsWS } from './ws/rolePermissionsWS';
import { DatePipe } from '@angular/common';
import { NgxBarcodeModule } from 'ngx-barcode';
import { BatchProcessesComponent } from './batch-processes/batch-processes.component';

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
    NewSalDetailsComponent,
    ImgUploadComponent,
    AppdataComponent,
    AppdataNewComponent,
    RolesComponent,
    BatchProcessesComponent,
   
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
     MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgbModule,
    MatSliderModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatCardModule,
    MatToolbarModule,
    NgxBarcodeModule
  ],
  providers: [
    mainWS,
    sessionService,
    luWS,
    salWS,
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
    ItemCategoriesWS,
    imguploadWS,
    appdataWS,
    rolePermissionsWS,
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [LuhNewComponent]
})
export class AppModule { }
