import { Component, OnInit, ViewChild } from '@angular/core';
import { mainWS } from '../ws/mainWS';
//import { faHandPointLeft, faHandPointRight } from '@fortawesome/free-regular-svg-icons';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
import {GridOptions} from "@ag-grid-community/all-modules";
//import * as momentNs from 'moment';
//const moment = momentNs;

//import { ButtonRendererComponent } from '../renderer/button-renderer.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public gridOptions:GridOptions;
  


  constructor(
    private webService: mainWS,
    private router: Router,
    private sessionService: sessionService,
  ) {
    // this.frameworkComponents = {
    //   buttonRenderer: ButtonRendererComponent,
    // }

    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      }   
    }
  }
  model: any = [];
  userList: any;
  isBusy = false;
  resp: any[];
  title = 'app';
  frameworkComponents: any;
  rowDataClicked: any = {};

  columnDefs = [];
  rowData: any = [];

  userPrivs = {
    "viewAllowed": "N",
    "editAllowed": "N",
    "deleteAllowed": "N",
    "createAllowed": "N"
  };


  style = {
    marginTop: '5px',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
  };
  //modules = [ClientSideRowModelModule];

  //@ViewChild('agGrid') agGrid;

  async loadAllUsers() {
    this.isBusy = true;
    let response = await this.webService.getUsers();
    this.userList = response;

    this.columnDefs = [
      {
        headerName: '',
        width: 35,
        sortable: false,
        filter: false,
        checkboxSelection: true
        // cellRenderer: 'buttonRenderer',
        // cellRendererParams: {
        //   onClick: this.onBtnClick.bind(this),
        //   label: '',
        //   editAllowed:this.editAllowed,
        //   deleteAllowed:this.deleteAllowed,
        //   navigationAllowed:this.navigationAllowed
        // }
      },
      { headerName: 'Name', field: 'name', width: 225, sortable: true, filter: true },
      { headerName: 'User ID', field: 'user_name', width: 130, sortable: true, filter: true },
      { headerName: 'Role', field: 'app_role_desc', width: 175, sortable: true, filter: true },
      { headerName: 'Department', field: 'd_name', width: 150, sortable: true, filter: true },
      { headerName: 'Designation', field: 'desig_name', width: 150, sortable: true, filter: true },
      { headerName: 'Locked', field: 'locked_desc', width: 130, sortable: true, filter: true },
      { headerName: 'Active', field: 'active_desc', width: 130, sortable: true, filter: true },
      {
        headerName: 'Created On', field: 'created_on', width: 130, sortable: true, filter: true,
        //valueFormatter: function (params) {
        //  try { if (params.value) { return (moment(params.value).format('DD-MMM-YYYY')); } else { return ("") } } catch { return null }
       // }
      },
      {
        headerName: 'Modified On', field: 'modified_on', width: 140, sortable: true, filter: true,
       // valueFormatter: function (params) {
       //   try { if (params.value) { return (moment(params.value).format('DD-MMM-YYYY')); } else { return ("") } } catch { return null }
       // }
      },

      //cellRenderer: function(params) {
      //let keyData = params.value;
      // let newLink = 
      //'<button type="button" class="btn" (click)="UpdateUser(i)"><i style="color:blue;" class="fa fa-pencil-alt "></i></button>';
      //'<a href="#" (click)="UpdateUser(1); return false;"><i style="color:blue;" class="fa fa-pencil-alt "></a>';
      //return newLink;

    ];
    this.rowData = response;
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };

  format_date(params) {
    //return moment(params.value).format('DD-MMM-YYYY');
    return params.value;
  }


  onBtnClick(e) {
    this.rowDataClicked = e.rowData;
    if (e.btnClicked == 'E') { alert("Edit button clicked for : " + e.rowData.name); }
    if (e.btnClicked == 'D') { alert("Delete button clicked for : " + e.rowData.name); }
    if (e.btnClicked == 'A') { alert("Arrow button clicked for : " + e.rowData.name); }
    // this.sessionService.setParameters([{name: "Userid", value: e.rowData._id}]);
    // this.router.navigate(['adduser'],{});
  }



  DeleteUser(id: any) {
    //alert( 'data: ' + id );
    if (this.rowDataClicked._id) {
      if (confirm('Are you sure to delete record?')) {
        // this.webService.deleteUser(this.userList[id]).subscribe( 
        var dataToDelete = this.userList.find(({ _id }) => _id === this.rowDataClicked._id);
        this.webService.deleteUser(dataToDelete).subscribe(

          (response) => {
            //this.resp = response;
            //alert(this.userList[id].name + " deleted successfully");
            //this.router.navigateByUrl('home');
            this.loadAllUsers();

          },
          (error) => {
            //Handle the error here
            //If not handled, then throw it
            console.error(error);
            //alert(this.userList[id].name + " cannot be deleted.");
            alert(this.rowDataClicked.name + " cannot be deleted.");

          }
        )
      }
    }
    else { alert('Please select a record to delete.'); }
  }


  UpdateUser(id: any) {
    //alert( 'data: ' + id );
    //this.router.navigateByUrl('adduser/25');
    if (this.rowDataClicked._id) {
      this.sessionService.deleteParameters();
      //this.sessionService.setParameters([{name: "Userid", value: this.userList[id]._id}]);
      this.sessionService.setParameters([{ name: "Userid", value: this.rowDataClicked._id }]);
      this.router.navigate(['adduser'], {});
    }
    else { alert('Please select a record to update.'); }

  }


  ngOnInit() {

    this.userPrivs = this.sessionService.getUsersPrivs();
    this.loadAllUsers();
    //console.log(this.route.snapshot.params.name);
    //dtOptions: DataTables.Settings = {};
  };

  fillLarge() {
    this.setWidthAndHeight('100%', '100%');
  }

  fillMedium() {
    this.setWidthAndHeight('60%', '60%');
  }

  fillExact() {
    this.setWidthAndHeight('400px', '400px');
  }

  setWidthAndHeight(width, height) {
    this.style = {
      marginTop: '20px',
      width: width,
      height: height,
      flex: '1 1 auto'
    };
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
