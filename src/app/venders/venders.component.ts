
import { Component, OnInit } from '@angular/core';
import {vendersWS} from '../ws/vendersWS';
import {VenderNewComponent} from '../venders/vender-new/vender-new.component';
import {venderAccountsWS} from '../ws/venderAccountsWS';
import {VenderAccountsNewComponent} from '../venders/vender-accounts-new/vender-accounts-new.component';
import { sessionService } from '../ws/sessionWS';
//import { MatDialog, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import * as momentNs from 'moment';
const moment = momentNs;

interface DialogData {
  data: string;
}

@Component({
  selector: 'app-venders',
  templateUrl: './venders.component.html',
  styleUrls: ['./venders.component.css']
})
export class VendersComponent implements OnInit {



  constructor(
    private venderSevice: vendersWS,
    private venderAccountsSevice: venderAccountsWS,
    private sessionService: sessionService,
    public dialog: MatDialog
  ) {

  }
  model: any = [];
  venderDataList: any = [];
  venderAccountsList: any = [];
  isBusy = false;
  isDetailBusy = false;
  resp: any[];
  selectedID: any = "No Selected";
  selectedCode: any = [];
  isluhCodeSelected: boolean = false;
  columnDefs = [];
  rowData:any = [];
   rowDataClicked:any = {};
    userPrivs = {	insert_allowed : false,
					update_allowed : false,
					delete_allowed : false,
					view_allowed : false};
   
    style = {
    marginTop: '0px',
    padding:'0px',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
};
// for lud grid
columnDefs2 = [];
rowData2:any = [];
 rowDataClicked2:any = {};
   
  style2 = {
  marginTop: '5px',
  width: '100%',
  height: '100%',
  flex: '1 1 auto'
};
  async loadVenders() {
    this.isBusy = true;
    let response = await this.venderSevice.getVenders();
    this.venderDataList = response;

    this.columnDefs = [
      {
        headerName: '',
         width: 35,
         sortable: false,
         filter: false,
        checkboxSelection: true
        },
      // {headerName: 'Code', field: 'vender_uid' , width: 150, sortable: true, filter:true  },
      {headerName: 'Code', field: 'vender_code' , width: 120, sortable: true, filter:true  },
      {headerName: 'Name', field: 'vender_name', width: 300, sortable: true, filter:true },
     ];
    this.rowData = response;


    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };

  async loadVenderAccounts(id: any) {
    //alert("loading lud comp");  
    this.isDetailBusy = true;
    //setTimeout(null,4000);
    //alert("luh value is " + id[0].value);
   let response = await this.venderAccountsSevice.getOneVenderAccounts(id);
   this.venderAccountsList = response;
   this.columnDefs2 = [
    {
      headerName: '',
       width: 35,
       sortable: false,
       filter: false,
      checkboxSelection: true
      },
    {headerName: 'Title', field: 'account_title', width: 300, sortable: true, filter:true },
    {headerName: 'Bank', field: 'bank_name', width: 200, sortable: true, filter:true },
    {headerName: 'Branch', field: 'branch_name', width: 150, sortable: true, filter:true },
    {headerName: 'Acc#', field: 'account_no' , width: 200, sortable: true, filter:true },
    {headerName: 'IBAN#', field: 'iban', width: 200, sortable: true, filter:true },
    
    
    {headerName: 'Br Code', field: 'branch_code', width: 100, sortable: true, filter:true },
    {headerName: 'Br Address', field: 'branch_address', width: 140, sortable: true, filter:true },
    
    {headerName: 'Phone', field: 'phone1', width: 140, sortable: true, filter:true },
    {headerName: 'Country', field: 'country_uid', width: 140, sortable: true, filter:true },
    {headerName: 'City', field: 'city_uid', width: 140, sortable: true, filter:true },
   ];
  this.rowData2 = response;

    //alert("Data is :" + this.LUDdataList[0].lud_desc);
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    //this.ScrolToTop();
    this.isDetailBusy = false;
   
  };

  LoadVA(code: any) {
    this.selectedID = this.rowDataClicked.vender_uid;
    this.isluhCodeSelected = true;
    this.selectedCode = [];
    this.selectedCode.push({ "name": "vender_uid", "value": this.rowDataClicked.vender_uid });
    this.loadVenderAccounts(this.selectedCode);
  }

  deleteVender(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUH(this.LUHdataList[id]).subscribe(
      if (this.rowDataClicked._id) {
        if (confirm('Are you sure to delete record?')) {
           this.venderSevice.deleteVenders(this.rowDataClicked).subscribe(
      (response) => {
        this.loadVenders();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked.luh_code + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');}
}


  deleteVA(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
      if (this.rowDataClicked2._id) {
        if (confirm('Are you sure to delete record?')) {
           this.venderAccountsSevice.deleteVenderAccounts(this.rowDataClicked2).subscribe(
      (response) => {
        this.LoadVA(this.rowDataClicked.luh_code);

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked2.lud_code + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');}
}


  ngOnInit() {


    this.loadVenders();
    this.userPrivs = this.sessionService.getUsersPrivs('VND');
    if (this.selectedCode.length > 0){this.LoadVA(this.selectedCode);}
   
  };

 
  // open the new / update form
  openVendersDialog(operation: any) {
    // operation = 1 for new , operation = 2 for update
    
    var operationOK = false;
       
        // operation is new record
        if (operation == 1 ){
         // if (this.venderUID == "" || this.venderUID == null) 
          //  {alert("Please select an item first.");}
         // else {
           operationOK = true;
          //};
        }
        // operation is update
        else if (operation == 2){
           if (!this.rowDataClicked._id )
           { alert('Please select a record to update.');}
           else {operationOK = true};
        }
        
        if (operationOK)
        {
        // update record is clicked
        //if (this.rowDataClicked._id ) {
        // delete the parameters array
        this.sessionService.deleteParameters();
        this.sessionService.setParameters([{ operation: operation, 
                                             vender_id: this.rowDataClicked._id }]);
                                          
        
    
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '1000px';
        
       
        const dialogRef = this.dialog.open(VenderNewComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (result == "save") {
            
            //this.selectGL(this.venderUID, this.venderName);
            this.loadVenders();
            this.rowDataClicked = {};
          
          }
          return (result);
        });
      }
     // else
     //{ alert('Please select a record to update.');}
      }

// open the new / update form
openVenderAccountsDialog(operation: any) {
  // operation = 1 for new , operation = 2 for update
  
  var operationOK = false;
     
      // operation is new record
      if (operation == 1 ){
       // if (this.venderUID == "" || this.venderUID == null) 
        //  {alert("Please select an item first.");}
       // else {
         operationOK = true;
        //};
      }
      // operation is update
      else if (operation == 2){
         if (!this.rowDataClicked2._id )
         { alert('Please select a record to update.');}
         else {operationOK = true};
      }
      
      if (operationOK)
      {
    
      this.sessionService.deleteParameters();
      this.sessionService.setParameters([{  operation: operation, 
                                            vender_uid: this.rowDataClicked.vender_uid,
                                            vender_accounts_id: this.rowDataClicked2._id  }]);
                                        
      
  
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '1000px';
      
     
      const dialogRef = this.dialog.open(VenderAccountsNewComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result == "save") {
          
          //this.selectGL(this.venderUID, this.venderName);
          this.loadVenders();
          this.rowDataClicked2 = {};
        
        }
        return (result);
      });
    }
   // else
   //{ alert('Please select a record to update.');}
    }

// ScrolToTop() {
//   let scrollToTop = window.setInterval(() => {
//       let pos = window.pageYOffset;
//       if (pos > 0) {
//           window.scrollTo(0, pos - 20); // how far to scroll on each step
//       } else {
//           window.clearInterval(scrollToTop);
//       }
//   }, 16);
// }



onRowSelected(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked = e.node.data;
    this.rowDataClicked2 = {};
    this.LoadVA(1);
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked){
      if (this.rowDataClicked._id == e.node.data._id ){
      this.rowDataClicked = {};
      this.rowDataClicked2 = {};
      this.LoadVA(1);
     
  }
 }
}
 
}

onRowSelected2(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked2 = e.node.data;
 
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked2){
      if (this.rowDataClicked2._id == e.node.data._id ){
      this.rowDataClicked2 = {};
     
  }
 }
}
 
}
}

