import { Component, OnInit } from '@angular/core';
import { customersWS } from '../ws/customersWS';
import { CustomerNewComponent } from '../customers/customer-new/customer-new.component';
import { sessionService } from '../ws/sessionWS';
//import { MatDialog, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as momentNs from 'moment';
const moment = momentNs;

interface DialogData {
  data: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {



  constructor(
    private customersSevice: customersWS,
    private sessionService: sessionService,
    public dialog: MatDialog
  ) {

  }
  model: any = [];
  customersDataList: any = [];
  isBusy = false;
  resp: any[];
  selectedID: any = "No Selected";
  selectedCode: any = [];
  isluhCodeSelected: boolean = false;
  columnDefs = [];
  rowData: any = [];
  defaultColDef;
  rowDataClicked: any = {};
  userPrivs = {
    "viewAllowed": "N",
    "editAllowed": "N",
    "deleteAllowed": "N",
    "createAllowed": "N"
  };

  style = {
    marginTop: '0px',
    padding: '0px',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
  };


  async loadCustomers() {
    this.isBusy = true;
    let response = await this.customersSevice.getCustomers();
    this.customersDataList = response;


    this.defaultColDef = {
      //flex: 1,
      cellClass: 'number-cell',
      resizable: true,
    };

    this.columnDefs = [
      {
        headerName: '',
        width: 35,
        sortable: false,
        filter: false,
        checkboxSelection: true
      },
      { headerName: 'Code', field: 'customer_uid', width: 130, sortable: true, filter: true },
      { headerName: 'Name', field: 'name', width: 300, sortable: true, filter: true },
      { headerName: 'Gender', field: 'gender_desc', width: 130, sortable: true, filter: true },
      { headerName: 'Mobile', field: 'mobile', width: 150, sortable: true, filter: true },
      { headerName: 'Phone', field: 'phone', width: 150, sortable: true, filter: true },
      { headerName: 'eMail', field: 'email', width: 150, sortable: true, filter: true },
      { headerName: 'Address', field: 'address', width: 200, sortable: true, filter: true },
      { headerName: 'Card No.', field: 'card_no', width: 150, sortable: true, filter: true },
      { headerName: 'Country', field: 'country_uid', width: 150, sortable: true, filter: true },
      { headerName: 'State', field: 'sate_uid', width: 150, sortable: true, filter: true },
      { headerName: 'City', field: 'city_uid', width: 150, sortable: true, filter: true },
    ];
    this.rowData = response;
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };



  deleteCustomer(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUH(this.LUHdataList[id]).subscribe(
    if (this.rowDataClicked._id) {
      if (confirm('Are you sure to delete record?')) {
        this.customersSevice.deleteCustomers(this.rowDataClicked).subscribe(
          (response) => {
            this.loadCustomers();

          },
          (error) => {
            //Handle the error here
            //If not handled, then throw it
            console.error(error);
            alert(this.rowDataClicked.name + " cannot be deleted.");

          }
        )
      }
    }
    else { alert('Please select a record to delete.'); }
  }



  ngOnInit() {


    this.loadCustomers();
    this.userPrivs = this.sessionService.getUsersPrivs();


  };


  // open the new / update form
  openCustomersDialog(operation: any) {
    // operation = 1 for new , operation = 2 for update

    var operationOK = false;

    // operation is new record
    if (operation == 1) {
      // if (this.venderUID == "" || this.venderUID == null) 
      //  {alert("Please select an item first.");}
      // else {
      operationOK = true;
      //};
    }
    // operation is update
    else if (operation == 2) {
      if (!this.rowDataClicked._id) { alert('Please select a record to update.'); }
      else { operationOK = true };
    }

    if (operationOK) {
      // update record is clicked
      //if (this.rowDataClicked._id ) {
      // delete the parameters array
      this.sessionService.deleteParameters();
      this.sessionService.setParameters([{
        operation: operation,
        customer_id: this.rowDataClicked._id
      }]);



      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '1000px';


      const dialogRef = this.dialog.open(CustomerNewComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result.message == "save") {

          //this.selectGL(this.venderUID, this.venderName);
          this.loadCustomers();
          this.rowDataClicked = {};

        }
        return (result);
      });
    }
    // else
    //{ alert('Please select a record to update.');}
  }


  onRowSelected(e) {

    if (e.node.selected) {

      // alert("Selected row is for  - " + e.node.data.name);
      this.rowDataClicked = e.node.data;


    }
    else {

      // alert("De-Selected row  for - " + e.node.data.name );
      // if deselected and already selected is deselected then wash the data
      if (this.rowDataClicked) {
        if (this.rowDataClicked._id == e.node.data._id) {
          this.rowDataClicked = {};


        }
      }
    }

  }

}

