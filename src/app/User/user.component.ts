import { Component, OnInit, ViewChild } from '@angular/core';
import { mainWS } from '../ws/mainWS';
//import { faHandPointLeft, faHandPointRight } from '@fortawesome/free-regular-svg-icons';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
import {GridOptions} from "@ag-grid-community/all-modules";
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserNewComponent } from '../User/user-new/user-new.component';
import { luWS } from './../ws/luWS';


interface DialogData {
  data: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public gridOptions:GridOptions;
  
  model: any = [];
  userList: any;
  isBusy = false;
  isAssignedBusy  = false;
  resp: any[];
  title = 'app';
  frameworkComponents: any;
  rowDataClicked: any = {};
  assRowDataClicked: any = {};
  avlRowDataClicked: any = {};
  response: any = [];
  columnDefs = [];
  rowData: any = [];

  avlRolesList: any = [];
  avlRolesColumnDefs = [];
  
  rolesColumnDefs = [];
  assignedRoles : any = [];
  previousSelectedNode = '';

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
  
  gridAPI : any;
  columnAPI : any;
  avlGridAPI : any;
  avlColumnAPI : any;


  constructor(
    private webService: mainWS,
    private router: Router,
    private sessionService: sessionService,
    public dialog: MatDialog,
    private LUDService : luWS,
  ) {
    // this.frameworkComponents = {
    //   buttonRenderer: ButtonRendererComponent,
    // }

    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      }   
    };


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
      //{ headerName: 'Role', field: 'app_role', width: 175, sortable: true, filter: true },
      { headerName: 'Employee#', field: 'employee_id', width: 175, sortable: true, filter: true },
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

    this.rolesColumnDefs = [
                      {
                        headerName: '',
                        width: 35,
                        sortable: false,
                        filter: false,
                        checkboxSelection: true
                      },
                      { headerName: 'Role Code', field: 'role', width: 150, sortable: true, filter: true },
                      { headerName: 'Role Description', field: 'role_desc', width: 350, sortable: true, filter: true }
                     ];
                    
                  
                    

    this.avlRolesColumnDefs = [
                      {
                        headerName: '',
                        width: 35,
                        sortable: false,
                        filter: false,
                        checkboxSelection: true
                      },
                      { headerName: 'Role Code', field: 'lud_code', width: 150, sortable: true, filter: true },
                      { headerName: 'Role Description', field: 'lud_desc', width: 350, sortable: true, filter: true }
                     ];
                    
                  
  };
  
  //modules = [ClientSideRowModelModule];

  //@ViewChild('agGrid') agGrid;

  async loadAllUsers() {
    this.assRowDataClicked = {};
    this.isBusy = true;
    let response = await this.webService.getUsers();
    this.userList = response;

    
    this.rowData = response;
    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    
    this.isBusy = false;
    //setTimeout(function(){ alert("Hello"); }, 3000);
    
    //this.reselectRow(this.previousSelectedNode);
    
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
    this.loadAllLUD('USR');
    //console.log(this.route.snapshot.params.name);
   
  };

  async loadAllLUD(id: any) {
    //alert("loading lud comp");  
    var luhData = [{value:id}]
    
    
    let response = await this.LUDService.getLUD(luhData);
    if (id=='USR'){this.avlRolesList = response;}

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
      //this.assignedRoles = this.rowDataClicked.app_role;
      this.getThisUserRoles(this.rowDataClicked._id)
     
      
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

  onAssRowSelected(e) {

    if (e.node.selected) {

      // alert("Selected row is for  - " + e.node.data.name);
      this.assRowDataClicked = e.node.data;
      
    }
    else {

      // alert("De-Selected row  for - " + e.node.data.name );
      // if deselected and already selected is deselected then wash the data 
      if (this.assRowDataClicked) {
        if (this.assRowDataClicked.role == e.node.data.role) {
          this.assRowDataClicked = {};

        }
      }
    }

  }



  
  onAvlRowSelected(e) {

    if (e.node.selected) {

      // alert("Selected row is for  - " + e.node.data.name);
      this.avlRowDataClicked = e.node.data;
      
    }
    else {

      // alert("De-Selected row  for - " + e.node.data.name );
      // if deselected and already selected is deselected then wash the data 
      if (this.avlRowDataClicked) {
        if (this.avlRowDataClicked.lud_code == e.node.data.lud_code) {
          this.avlRowDataClicked = {};

        }
      }
    }

  }
  

   // open the new / update form
   openUserDialog(operation: any) {
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
        resource_id: this.rowDataClicked._id
      }]);



      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '1000px';


      const dialogRef = this.dialog.open(UserNewComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result.message == "save") {

          //this.selectGL(this.venderUID, this.venderName);
          this.loadAllUsers();
          this.rowDataClicked = {};

        }
        return (result);
      });
    }
    // else
    //{ alert('Please select a record to update.');}
  }

  assignRole(){

    if (this.avlRowDataClicked.lud_code) {

      var found;

      try {
        var found = this.assignedRoles.find(({ role }) => role === this.avlRowDataClicked.lud_code);
        
      }
      catch (e) {
        found = [];
      }

      if (!found){

            var data = {_id:this.rowDataClicked._id , role:{role:this.avlRowDataClicked.lud_code}}
            this.webService.addRole(data).subscribe(
              (response) => {
                
                this.getThisUserRoles(this.rowDataClicked._id);
                
              
                //this.addRole(this.previousSelectedNode , {role:this.avlRowDataClicked.lud_code} );
              
                // this.loadAllUsers();
        
              },
              (error) => {
                //Handle the error here
                //If not handled, then throw it
                console.error(error);
        
              })
            }
            else{
               alert('This role has already been assigned.');
            }
    }
    else { alert('Please select a role to asign.'); }
    //addRole
  }


  revokeRole(){

    if (this.assRowDataClicked.role) {
      var data = {_id:this.rowDataClicked._id , sub_id:this.assRowDataClicked._id}
      this.webService.deleteRole(data).subscribe(
        (response) => {
                   
          this.getThisUserRoles(this.rowDataClicked._id);
          
         
          //this.addRole(this.previousSelectedNode , {role:this.avlRowDataClicked.lud_code} );
         
          // this.loadAllUsers();
  
        },
        (error) => {
          //Handle the error here
          //If not handled, then throw it
          console.error(error);
  
        })
    }
    else { alert('Please select a role to rewoke.'); }
    //addRole
  }


  

  onGridReady(params){
    //alert('its main grid ready ')
      this.gridAPI = params.api;
      this.columnAPI = params.columnApi;
      
  }

  onAvlGridReady(params){
   // alert('its roles grid ready ')
    this.avlGridAPI = params.api;
    this.avlColumnAPI = params.columnApi;
     
}

async getThisUserRoles(id: any) {
  this.isAssignedBusy = true;
  var userToLoad = [{name: "resource_id" , value: id}];
  this.response = await this.webService.getThisUserRoles(userToLoad);
  //alert('data - ' + this.response.name);
  console.log(this.response)
  this.assignedRoles = this.response.app_role;
  
 
  this.isAssignedBusy = false;
};
 

}
