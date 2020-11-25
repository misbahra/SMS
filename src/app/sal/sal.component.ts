import { Component, OnInit } from '@angular/core';
import { salWS } from '../ws/salWS';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
//import { MatDialog, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { NewSalDetailsComponent } from '../sal/new-sal-details/new-sal-details.component';
import { NewSalComponent } from '../sal/new-sal/new-sal.component';
import * as momentNs from 'moment';
import { mainWS } from '../ws/mainWS';
const moment = momentNs;


@Component({
  selector: 'app-sal',
  templateUrl: './sal.component.html',
  styleUrls: ['./sal.component.css']
})
export class SalComponent implements OnInit {
  constructor(
    private webService: salWS,
    private router: Router,
    private sessionService: sessionService,
    private resourceService : mainWS,
    public dialog: MatDialog
  ) {

  }
  model: any = [];
  LUHdataList: any = [];
  LUDdataList: any = [];
  salSummaryDataList: any = [];
  isBusy = false;
  isDetailBusy = false;
  resp: any[];
  selectedID: any = "No Selected";
  selectedCode: any = [];
  isluhCodeSelected: boolean = false;
  totalSalary = 0;
  columnDefs = [];
  rowData:any = [];
  columnDefsSummary = [];
  rowDataSummary:any = [];
  
  selectedResource = "";
  resourceList: any = [];
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

defaultColDef = {
  //flex: 1,
  cellClass: 'number-cell',
  resizable: true,
  sortable: true, 
  filter:true
};

async loadData()
{
  await this.loadAllSalHeaders();
  await this.loadSalSummary();
  this.LUDdataList = [];
  this.rowData2 = [];
  this.totalSalary = 0;
}  
async loadAllSalHeaders() {
    this.isBusy = true;
    //alert(this.selectedResource);
    var paramData = {params: {"param1":this.selectedResource}};
    let response = await this.webService.getSalHeader(paramData);
    this.LUHdataList = response;

    this.columnDefs = [
      {
        headerName: '',
         width: 35,
         sortable: false,
         filter: false,
        checkboxSelection: true
        },

       //{ headerName: 'id', field: 'sal_header_uid' , width: 100  },
       {  headerName: 'Status', field: 'status_desc' , width: 100  },
       {  headerName: 'Resource', field: 'resource_name' , width: 130  },
       {  headerName: 'Year', field: 'year' , width: 90  },
       {  headerName: 'Month', field: 'month' , width: 90  },
       {  headerName : 'Paid on', field: 'paid_on' , width: 130  
       ,valueFormatter: function (params) {
        return moment(params.value.substr(0,16)).format('DD-MMM-YYYY HH:mm');
        //return params.value.substr(0,16);
      }
      },
      
       {  headerName: 'Remarks', field: 'remarks' , width: 200  }
    
     ];
    this.rowData = response;


    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };


  async loadSalSummary() {
    this.isBusy = true;
    //alert(this.selectedResource);
    var paramData = {params: {"param1":this.selectedResource}};
    let response = await this.webService.getSalSummary(paramData);
    this.rowDataSummary = response;

    this.columnDefsSummary = [
  
       //{ headerName: 'Pay Head', field: '_id' , width: 100  },
       {  headerName: 'Pay Head', field: 'pay_head_desc' , width: 300  },
       {  headerName: 'Total Amount', field: 'total_pay_amount' , width: 160   ,
       cellStyle: {textAlign: "right",color:"green"}
       , valueFormatter: function(params) {
         var num =   Math.floor(params.value).toFixed(2)
           .toString()
           .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
         if (num == "0" ){return null;}
         else {return num}
         
       },
     }, 
    
     ];
     this.rowDataSummary = response;


    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };


  async loadAllLUD(id: any) {
  
    this.isDetailBusy = true;
   
   let response = await this.webService.getsalDetails(id);
   this.LUDdataList = response;
// calculate total
this.totalSalary = 0;
this.LUDdataList.forEach(element => {
  this.totalSalary = this.totalSalary + element.amount_signed;
});

       

   this.columnDefs2 = [
    {
      headerName: '',
       width: 35,
       sortable: false,
       filter: false,
      checkboxSelection: true
      },
   
      { headerName: 'id', field: 'sal_header_uid' , width: 100  },
      {  headerName: 'Head', field: 'pay_head_desc' , width: 150  },
    
   
      {  headerName: 'Amount', field: 'amount_signed' , width: 150 
      ,
      cellStyle: {textAlign: "right",color:"green"}
      , valueFormatter: function(params) {
        var num =   Math.floor(params.value).toFixed(2)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        if (num == "0" ){return null;}
        else {return num}
        
      },
    }, 
     {  headerName : 'Paid on', field: 'paid_on' , width: 150  
      ,valueFormatter: function (params) {
        return moment(params.value.substr(0,16)).format('DD-MMM-YYYY HH:mm');
        //return params.value.substr(0,16);
      }
    },
     {  remarheaderNameks: 'Remarks', field: 'remarks' , width: 200 }
   ];
  this.rowData2 = response;

    //alert("Data is :" + this.LUDdataList[0].lud_desc);
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    //this.ScrolToTop();
    this.isDetailBusy = false;
   
  };

  LoadLUD(code: any) {
    this.selectedID = this.rowDataClicked.luh_code;
    this.isluhCodeSelected = true;
    this.selectedCode = [];
    this.selectedCode.push({ "name": "sal_header_uid", "value": this.rowDataClicked.sal_header_uid });
    this.loadAllLUD(this.selectedCode);
  }

  DeleteLUH(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUH(this.LUHdataList[id]).subscribe(
      if (this.rowDataClicked._id) {
        if (confirm('Are you sure to delete record?')) {
           this.webService.deleteSalHeader(this.rowDataClicked).subscribe(
      (response) => {
        this.loadAllSalHeaders();
        this.loadSalSummary();

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
           this.webService.deleteSalHeader(this.rowDataClicked2).subscribe(
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

    this.loadResources();
   // this.loadAllSalHeaders();
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
      this.sessionService.setParameters([{ name: "sal_header_id", value: this.rowDataClicked._id }]);

    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    
    const dialogRef = this.dialog.open(NewSalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result == "save") {
        this.loadAllSalHeaders();
        this.loadSalSummary();
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
    this.sessionService.setParameters([{ name: "sal_detail_id", value: this.rowDataClicked2._id }]);
  }
  else
  {
 //alert("test 2-" + this.selectedID);  
  this.sessionService.setParameters([{ name: "sal_header_uid", value: this.rowDataClicked.sal_header_uid }]);
  }

  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '600px';
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  const dialogRef = this.dialog.open(NewSalDetailsComponent, dialogConfig);

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

async loadResources()
{
  var response;
response = await this.resourceService.getUsers();
this.resourceList = response;
//alert("Venders loaded - " + this.vendersDataList.length);
}

}



