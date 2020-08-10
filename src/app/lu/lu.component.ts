import { Component, OnInit } from '@angular/core';
import { luWS } from '../ws/luWS';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
//import { MatDialog, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LuhNewComponent } from '../lu/luh-new/luh-new.component';
import { LudNewComponent } from '../lu/lud-new/lud-new.component';
import * as momentNs from 'moment';
const moment = momentNs;


   
@Component({
  selector: 'app-lu',
  templateUrl: './lu.component.html',
  styleUrls: ['./lu.component.css']
})
export class LuComponent implements OnInit {


  constructor(
    private webService: luWS,
    private router: Router,
    private sessionService: sessionService,
    public dialog: MatDialog
  ) {

  }
  model: any = [];
  LUHdataList: any = [];
  LUDdataList: any = [];
  isBusy = false;
  isLUDBusy = false;
  resp: any[];
  selectedID: any = "No Selected";
  selectedCode: any = [];
  isluhCodeSelected: boolean = false;
  columnDefs = [];
  rowData:any = [];
   rowDataClicked:any = {};
    userPrivs = {"viewAllowed":"N",
                "editAllowed":"N",
                "deleteAllowed":"N",
                "createAllowed":"N"};
   
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
  async loadAllLUH() {
    this.isBusy = true;
    let response = await this.webService.getLUH();
    this.LUHdataList = response;

    this.columnDefs = [
      {
        headerName: '',
         width: 35,
         sortable: false,
         filter: false,
        checkboxSelection: true
        },
      {headerName: 'Code', field: 'luh_code' , width: 100, sortable: true, filter:true  },
      {headerName: 'Desc', field: 'luh_desc', width: 340, sortable: true, filter:true },
     ];
    this.rowData = response;


    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };

  async loadAllLUD(id: any) {
    //alert("loading lud comp");  
    this.isLUDBusy = true;
    //setTimeout(null,4000);
    //alert("luh value is " + id[0].value);
   let response = await this.webService.getLUDFromDB(id);
   this.LUDdataList = response;
   this.columnDefs2 = [
    {
      headerName: '',
       width: 35,
       sortable: false,
       filter: false,
      checkboxSelection: true
      },
    {headerName: 'Code', field: 'lud_code' , width: 100, sortable: true, filter:true },
    {headerName: 'Desc', field: 'lud_desc', width: 350, sortable: true, filter:true },
    {headerName: 'Value', field: 'value', width: 100, sortable: true, filter:true },
    {headerName: 'Order', field: 'display_order', width: 100, sortable: true, filter:true },
    {headerName: 'Active', field: 'active', width: 100, sortable: true, filter:true },
    {headerName: 'Freezed', field: 'freezed', width: 140, sortable: true, filter:true },
   ];
  this.rowData2 = response;

    //alert("Data is :" + this.LUDdataList[0].lud_desc);
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    //this.ScrolToTop();
    this.isLUDBusy = false;
   
  };

  LoadLUD(code: any) {
    this.selectedID = this.rowDataClicked.luh_code;
    this.isluhCodeSelected = true;
    this.selectedCode = [];
    this.selectedCode.push({ "name": "luh_code", "value": this.rowDataClicked.luh_code });
    this.loadAllLUD(this.selectedCode);
  }

  DeleteLUH(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUH(this.LUHdataList[id]).subscribe(
      if (this.rowDataClicked._id) {
        if (confirm('Are you sure to delete record?')) {
           this.webService.deleteLUH(this.rowDataClicked).subscribe(
      (response) => {
        this.loadAllLUH();

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


  DeleteLUD(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
      if (this.rowDataClicked2._id) {
        if (confirm('Are you sure to delete record?')) {
           this.webService.deleteLUD(this.rowDataClicked2).subscribe(
      (response) => {
        this.LoadLUD(this.rowDataClicked.luh_code);

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


    this.loadAllLUH();
    this.userPrivs = this.sessionService.getUsersPrivs();
    if (this.selectedCode.length > 0){this.loadAllLUD(this.selectedCode);}
   
  };

  // openDialog() {
  //   const dialogRef = this.dialog.open(dgcomponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }


  // open the new / update form
  openLuhDialog(id: any) {
    if (this.rowDataClicked._id || id == null ) {
    // delete the parameters array
    this.sessionService.deleteParameters();
    // check if any parameter is sent or not
    //if sent then this will be opened for update
    //alert("test 1")
    if (id != null) {
//alert("test 2")
      this.sessionService.setParameters([{ name: "luh_id", value: this.rowDataClicked._id }]);

    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
   
    const dialogRef = this.dialog.open(LuhNewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result == "save") {
        this.loadAllLUH();
        this.rowDataClicked = {};
        this.rowDataClicked2 = {};
      }
      return (result);
    });
  }
  else
 { alert('Please select a record to update.');}
  }



// // open the new / update form
openLudDialog(id: any) {
  //alert("test 1")
  // delete the parameters array
  if (this.rowDataClicked2._id  || id == null) {
  this.sessionService.deleteParameters();
  // check if any parameter is sent or not
  //if sent then this will be opened for update
  if (id != null) {
    //alert("test 2")
    this.sessionService.setParameters([{ name: "lud_id", value: this.rowDataClicked2._id }]);
  }
  else
  {
 //alert("test 2-" + this.selectedID);  
  this.sessionService.setParameters([{ name: "luh_code", value: this.rowDataClicked.luh_code }]);
  }

  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '600px';
  const dialogRef = this.dialog.open(LudNewComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if (result == "save") {
      this.LoadLUD(this.selectedID);
      this.rowDataClicked2 = {};
    }
    return (result);
  });
}
else
{ alert('Please select a record to update.');}
}

ScrolToTop() {
  let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 16);
}



onRowSelected(e)
{
 
  if(e.node.selected) {

   // alert("Selected row is for  - " + e.node.data.name);
    this.rowDataClicked = e.node.data;
    this.rowDataClicked2 = {};
    this.LoadLUD(1);
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked){
      if (this.rowDataClicked._id == e.node.data._id ){
      this.rowDataClicked = {};
      this.rowDataClicked2 = {};
      this.LoadLUD(1);
     
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

