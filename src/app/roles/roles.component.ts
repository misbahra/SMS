import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {sessionService} from './../ws/sessionWS';
import { luWS } from './../ws/luWS';
import { rolePermissionsWS } from './../ws/rolePermissionsWS';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  dataForm: FormGroup;
  title = 'sample-app';
  classesData = [];
  rolesList: any = [];
  modulesList: any = [];
  rolesData: any = [];
  submitted = false;
  isBusy = false;
  selectedRole = '';
  dataId = '';
  columnDefs = [];
  queryParams: any = [];
  action = 'C';
  userPrivs = {	insert_allowed : false,
					update_allowed : false,
					delete_allowed : false,
					view_allowed : false};
gridAPI;
columnAPI;
rowDataClicked:any = {};
  
  
  constructor(
    private LUDService : luWS,
    private sessionService: sessionService,
    private roleService:rolePermissionsWS,
    private fb: FormBuilder,
  ) { 

    this.columnDefs = [
      {
        headerName: '',
         width: 35,
         sortable: false,
         filter: false,
        checkboxSelection: true
        },

       //{ headerName: 'id', field: 'sal_header_uid' , width: 100  },
       {  headerName: 'Role', field: 'role_desc' , width: 450 , cellStyle: {textAlign: "left" } ,},
       {  headerName: 'Module', field: 'module_desc' , width: 400 , cellStyle: {textAlign: "left" }, },
       {  headerName: 'Insert', field: 'insert_allowed' , width: 100  , 
       cellClass: params => {
        return params.value === true ? 'ag-allow' : 'ag-denay';
    }, 
    cellRenderer: function(params) {
      if (params.value){return '<span><i class="fa fa-check-square"></i></span>'}
      else {return '<span><i class="fa fa-times"></i></span>'}
  }
  },
       {  headerName: 'Update', field: 'update_allowed' , width: 100 ,
       cellClass: params => {
        return params.value === true ? 'ag-allow' : 'ag-denay';
    }, 
    cellRenderer: function(params) {
      if (params.value){return '<span><i class="fa fa-check-square"></i></span>'}
      else {return '<span><i class="fa fa-times"></i></span>'}
  }
  },
       {  headerName: 'Delete', field: 'delete_allowed' , width: 100  ,
       cellClass: params => {
        return params.value === true ? 'ag-allow' : 'ag-denay';
    },
    cellRenderer: function(params) {
      if (params.value){return '<span><i class="fa fa-check-square"></i></span>'}
      else {return '<span><i class="fa fa-times"></i></span>'}
  }
  },
       {  headerName: 'View', field: 'view_allowed' , width: 100  ,
       cellClass: params => {
        return params.value === true ? 'ag-allow' : 'ag-denay';
    },
    cellRenderer: function(params) {
      if (params.value){return '<span><i class="fa fa-check-square"></i></span>'}
      else {return '<span><i class="fa fa-times"></i></span>'}
  }
  },
    
     ];
    
  }

  ngOnInit(): void {
    //this.loadAllRolesData();

    this.dataForm = this.fb.group({
      id:  ['', []],
      role:  [ '', []],
      module:  ['', [Validators.required]],
      insert_allowed:  [false, []],
      update_allowed:  [false, []],
      delete_allowed:  [false, []],
      view_allowed:  [false, []],
      created_by: ['', []],
      created_on:['', []],
      modified_by: ['', []],
      modified_on: ['', []],
    })

    this.userPrivs = this.sessionService.getUsersPrivs('ROLE');
    this.loadAllLUD('USR');
    this.loadAllLUD('APPM');
    
  }


  // single getter for all form controls to access them from the html
  get fc() { return this.dataForm.controls; }


  async loadAllLUD(id: any) {
    //alert("loading lud comp");  
    var luhData = [{value:id}]
    let response = await this.LUDService.getLUD(luhData);
    if (id=='USR'){this.rolesList = response;}
    if (id=='APPM'){this.modulesList = response;}

  };

  async loadAllRolesData() {
    this.isBusy=true;
    //alert("selected role:" + this.selectedRole);  
    this.rolesData = await this.roleService.getAllThisRolePermissions([{'value':this.selectedRole}]);
    //console.log(this.rolesData);
    this.isBusy=false;
  };

  duplicate() {
    const newData = JSON.parse(JSON.stringify(this.classesData[1]));
    newData.title += 'Copy';
    this.classesData.splice(1, 0, newData);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  formatValue(param){
    if (param) {return '<i class="fa fa-tick"></i>'} 
     else {return '<i class="fa fa-cross"></i>'}
  }

  roleChange(){
    this.loadAllRolesData();
  }

  onSubmit() {
    

    this.submitted = true;
    this.isBusy = true;
    var found;
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
    console.log('On submit');
    //console.log('Data: ' +  this.angForm.value  );
    //alert('Role selected   -  ' + this.selectedRole);
    if (this.dataForm.valid) {
      if (this.action == 'C') {
        try {
          found = this.rolesData.find(({ role, module }) => role === this.selectedRole && module === this.dataForm.value.module);
          
        }
        catch (e) {
           found = [];
        }

        if (found) {alert("This role has already permissions defined for this page");}
        //alert('add user');
        else{
          this.addData();
          this.loadAllRolesData();
        }
        
      }
      else {
        //alert('update user');
        this.updateData();
        this.loadAllRolesData();
      }
      //alert('all is ok');
      this.submitted = false;
      
     
    }
    else {
     alert('Remove Errors first ')
      
      
      // alert('clear errors');
    }
    this.isBusy = false;
    this.action = 'C';
    this.dataForm.reset();
  }

  addData() {
    console.log(this.selectedRole);
    this.dataForm.controls.created_on.setValue(Date.now());

    this.dataForm.controls.role.setValue(this.selectedRole);

    if (this.dataForm.value.insert_allowed ||
      this.dataForm.value.update_allowed ||
      this.dataForm.value.delete_allowed 
   ){this.dataForm.controls.view_allowed.setValue(true);}

    this.roleService.addRolePermission(this.dataForm.value).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Data added' + response);

        // this.loadAllUsers();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);

      })

  }


  updateData() {
    console.log('data: ' + this.dataForm.value.name);

    this.dataForm.controls.modified_on.setValue(Date.now());
    this.dataForm.removeControl('id');

    if (this.dataForm.value.insert_allowed ||
      this.dataForm.value.update_allowed ||
      this.dataForm.value.delete_allowed 
   ){this.dataForm.controls.view_allowed.setValue(true);}

    this.dataForm.addControl('_id', new FormControl(['', []]));
    this.dataForm.controls._id.setValue(this.rowDataClicked._id);
    //alert("Value is set to - " + this.userForm.controls._id.value);

    //this.userForm.controls.user_name.setValue(upper(this.user_name));
    this.roleService.updateRolePermission(this.dataForm.value).subscribe(
      (response) => {
        //this.resp = response;
        console.log('Data updated' + response);

        // this.loadAllUsers();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);

      })
    this.dataForm.removeControl('_id');
  }

  onGridReady(params){
    this.gridAPI = params.api;
    this.columnAPI = params.columnApi;
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

  newData(){ this.action = 'C';} //create
  modifyData(){
    if (!this.rowDataClicked._id) {alert('Please select a record to update.');
    this.action = '';
    }
    else
    {
      this.dataForm.disable();
      this.dataForm.patchValue(this.rowDataClicked);
      this.dataForm.enable();
      this.action = 'M';} 
    } //modify
  
  
  deleteData(){
    this.action = 'D';

 
    //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
      if (this.rowDataClicked._id) {
        if (confirm('Are you sure to delete record?')) {
           this.roleService.deleteRolePermission(this.rowDataClicked).subscribe(
                      (response) => {
                        this.loadAllRolesData();

                      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked.gl_uid + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');
  }
  this.action = 'C';
  }// delete
  
}
