  
import { Component, OnInit } from '@angular/core';
import {ItemCategoriesWS} from '../ws/itemCategoriesWS';
import {CategoryNewComponent} from '../item-categories/category-new/category-new.component';
import {ItemsWS} from '../ws/itemsWS';
import {ItemNewComponent} from '../item-categories/item-new/item-new.component';
import { sessionService } from '../ws/sessionWS';
//import { MatDialog, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import * as momentNs from 'moment';
const moment = momentNs;

interface DialogData {
  data: string;
}

@Component({
  selector: 'app-item-categories',
  templateUrl: './item-categories.component.html',
  styleUrls: ['./item-categories.component.css']
})
export class ItemCategoriesComponent implements OnInit {

  constructor(
    private itemCategoriesSevice: ItemCategoriesWS,
    private itemsSevice: ItemsWS,
    private sessionService: sessionService,
    public dialog: MatDialog
  ) {

  }
  model: any = [];
  itemCategoryDataList: any = [];
  itemDataList: any = [];
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
    
 defaultColDef = {
  //flex: 1,
  cellClass: 'number-cell',
  resizable: true,
  sortable: true, filter:true
};

  style2 = {
  marginTop: '5px',
  width: '100%',
  height: '100%',
  flex: '1 1 auto'
};
  async loadItemCategories() {
    this.isBusy = true;
    let response = await this.itemCategoriesSevice.getItemCategories();
    this.itemCategoryDataList = response;

    this.columnDefs = [
      {
        headerName: '',
         width: 35,
         sortable: false,
         filter: false,
        checkboxSelection: true
        },
      {headerName: 'Code', field: 'cat_uid' , width: 125 },
      {headerName: 'Name', field: 'cat_name', width: 340 },
      {headerName: 'Desc', field: 'cat_desc', width: 340 },
      {headerName: 'Active', field: 'active', width: 340 },
      {headerName: 'Vat Rate', field: 'vat_rate', width: 340 },
     ];
    this.rowData = response;


    //if (this.userList.active == "true") {this.userList.active = "Y";} else {this.userList.active="N;"}
    //if (this.userList.locked == "true") {this.userList.locked = "Y";} else {this.userList.locked="N;"}
    this.isBusy = false;
  };



  async loadItems(id: any) {
    //alert("loading lud comp");  
    this.isDetailBusy = true;
  
   let resp = await this.itemsSevice.getOneCategoryItems(id);

   this.itemDataList = resp;
   
   this.columnDefs2 = [
    {
      headerName: '',
       width: 35,
       sortable: false,
       filter: false,
      checkboxSelection: true
      },
    {headerName: 'Id', field: 'item_uid', width: 140 },
    {headerName: 'Code', field: 'item_code', width: 140 },
    {headerName: 'Name', field: 'item_name', width: 275 },
    {headerName: 'Reorder', field: 'reorder_quantity' , width: 140 },
    {headerName: 'Active', field: 'active' , width: 140 ,
    cellClass: params => {
      return params.value === true ? 'ag-allow' : 'ag-denay';
  }, 
  cellRenderer: function(params) {
    if (params.value){return '<span><i class="fa fa-check-square"></i></span>'}
    else {return '<span><i class="fa fa-times"></i></span>'}
}
},
    // {headerName: 'Bar Code', field: 'item_bar_code', width: 150 }, 
  ];
  
   this.rowData2 = resp;

   
    this.isDetailBusy = false;
   
  };

  LoadItemsForOneCategory() {
    this.selectedID = this.rowDataClicked.cat_uid;
    this.isluhCodeSelected = true;
    this.selectedCode = [];
    this.selectedCode.push({ "name": "cat_uid", "value": this.rowDataClicked.cat_uid });
    
    this.loadItems(this.selectedCode);
  }

  deleteItemCategory(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUH(this.LUHdataList[id]).subscribe(
      if (this.rowDataClicked._id) {
        if (confirm('Are you sure to delete record?')) {
           this.itemCategoriesSevice.deleteItemCategories(this.rowDataClicked).subscribe(
      (response) => {
        this.loadItemCategories();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked.cat_uid + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');}
}


  deleteItem(id: any) {
    this.selectedID = id;

    //alert( 'data: ' + this.selectedID );
    //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
      if (this.rowDataClicked2._id) {
        if (confirm('Are you sure to delete record?')) {
           this.itemsSevice.deleteItems(this.rowDataClicked2).subscribe(
      (response) => {
        this.LoadItemsForOneCategory();

      },
      (error) => {
        //Handle the error here
        //If not handled, then throw it
        console.error(error);
        alert(this.rowDataClicked2.item_uid + " cannot be deleted.");

     }
   )
    }
  }
    else { alert('Please select a record to delete.');}
}


  ngOnInit() {


    this.loadItemCategories();
    this.userPrivs = this.sessionService.getUsersPrivs('ITM');
    if (this.selectedCode.length > 0){this.LoadItemsForOneCategory();}
   
  };

 
  // open the new / update form
  openItemCategoryDialog(operation: any) {
    // operation = 1 for new , operation = 2 for update
    
    var operationOK = false;
       
        // operation is new record
        if (operation == 1 ){
        
           operationOK = true;
          
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
                                             cat_id: this.rowDataClicked._id }]);
                                          
        
    
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '1000px';
        
       
        const dialogRef = this.dialog.open(CategoryNewComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (result == "save") {
            
           
            this.loadItemCategories();
            this.rowDataClicked = {};
          
          }
          return (result);
        });
      }
     // else
     //{ alert('Please select a record to update.');}
      }

// open the new / update form
openItemsDialog(operation: any) {
  // operation = 1 for new , operation = 2 for update
  
  var operationOK = false;
  var cat_uid = this.rowDataClicked.cat_uid;
     
      // operation is new record
      if (operation == 1 ){
      
         operationOK = true;
        
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
                                            cat_uid: cat_uid,
                                            item_id: this.rowDataClicked2._id  }]);
                                        
      
  
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '1000px';
      
     
      const dialogRef = this.dialog.open(ItemNewComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result == "save") {
          
         
          this.LoadItemsForOneCategory();
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
    this.LoadItemsForOneCategory();
 }
 else
 {

 // alert("De-Selected row  for - " + e.node.data.name );
 // if deselected and already selected is deselected then wash the data
  if (this.rowDataClicked){
      if (this.rowDataClicked._id == e.node.data._id ){
      this.rowDataClicked = {};
      this.rowDataClicked2 = {};
      this.LoadItemsForOneCategory();
     
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

