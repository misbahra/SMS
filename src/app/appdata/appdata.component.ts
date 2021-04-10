import { Component, OnInit } from '@angular/core';
  import { Router } from "@angular/router";
  import { sessionService } from '../ws/sessionWS';
  import { appdataWS } from '../ws/appdataWS';
  import {GridOptions, AllCommunityModules} from "@ag-grid-community/all-modules";
  import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
  import {ImgUploadComponent} from "../img-upload/img-upload.component";
  import * as momentNs from 'moment';
  const moment = momentNs;
  import {utilWS} from '../ws/utilWS'
  import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
  import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine-dark.css';
  import { WSASERVICE_NOT_FOUND } from 'constants';

@Component({
  selector: 'app-appdata',
  templateUrl: './appdata.component.html',
  styleUrls: ['./appdata.component.css']
})
export class AppdataComponent implements OnInit {

  
  
   
      public gridOptions:GridOptions;
      constructor(
        private router: Router,
        private sessionService: sessionService,
        public appDataService: appdataWS,
        public dialog: MatDialog,
        private utilService : utilWS
      ) {
        // this.gridOptions = <GridOptions>{
        //   onGridReady: () => {
        //     this.gridOptions.api.sizeColumnsToFit();
        //   }   
        // }
        this.configureGrid();
      }
    
      appDataList: any = [];
      appDataListDisplay: any = [];
      selectedDataList: any = [];
      appImagesList: any = [];
      totalImages = 0;
      term: string;
      isBusy = false;
      isDetailBusy = false;
      totalAmount : any = 0;
      response : any = [];
      columnDefs = [];
      defaultColDef ;
      columnDefsImg;
      rowData: any = [];
      rowDataImg: any = [];
      rowDataClicked:any = {};
      rowDataClickedImage:any = {};
      selectedIndex : any;

      final_amount = 0;
      venderUID = "";
      venderName = "";
      userPrivs = {	insert_allowed : false,
					update_allowed : false,
					delete_allowed : false,
					view_allowed : false};
       
        style = {
        marginTop: '0px',
        padding:'0px',
        width: '100%',
        height: '500px  ',
        flex: '1 1 auto'
    };
    
    pinnedTopRowData;
    pinnedBottomRowData; 
    gridApi;
    gridColumnApi;
    data = [];
    topRowData = [];
    bottomRowData = [];
  
    public modules = AllCommunityModules;
    
    
      async loadAppData() {
        this.isBusy = true;
        this.isDetailBusy = true;
        
        this.rowData = [];
        this.response = [];
  
        //alert("Vender - " + vender_uid);
         this.response = await this.appDataService.getAD();
        
        //setTimeout(this.refreshDetail, 2000 , response);
        setTimeout(() => { 
          this.rowData = this.response;
          this.refreshGrid();
          this.isDetailBusy = false; 
        }, 
        1000);
        // this.rowData = response;
        // this.isDetailBusy = false;
    
        };
  
  refreshDetail(data:any){
    this.rowData = data;
    this.isDetailBusy = false;
  }
  configureGrid(){
  
   
    
    this.columnDefs = [
      {
        headerName: '',
        width: 35,
        sortable: false,
        filter: false,
        checkboxSelection: true
      
      },
      { headerName: 'Category', field: 'category', width: 200, sortable: true, filter: true ,},
      { headerName: 'Type', field: 'types', width: 200, sortable: true, filter: true },
      { headerName: 'Suit', field: 'suit_type', width: 150, sortable: true, filter: true,},
      { headerName: 'stuff', field: 'stuff', width: 200, sortable: true, filter: true ,},
      { headerName: 'brand', field: 'brand', width: 420, sortable: true, filter: true },
      { headerName: 'Active', field: 'active', width: 120, sortable: true, filter: true },
    ];

    this.columnDefsImg = [
      {
        headerName: '',
        width: 35,
        sortable: false,
        filter: false,
        checkboxSelection: true
      
      },
      //{ headerName: 'Vender', field: 'vender_name', width: 150, sortable: true, filter: true },
      { headerName: 'Name', field: 'name', width: 150, sortable: true, filter: true },
      { headerName: 'Desc', field: 'desc', width: 150, sortable: true, filter: true },
      { headerName: 'price', field: 'price', width: 150, sortable: true, filter: true },
      { headerName: 'Price Unit', field: 'price_unit', width: 150, sortable: true, filter: true },
      { headerName: 'Active', field: 'active', width: 150, sortable: true, filter: true },
      { headerName: 'In Stock', field: 'is_in_stock', width: 150, sortable: true, filter: true },
      { headerName: 'Is New', field: 'is_new', width: 150, sortable: true, filter: true },
      { headerName: 'Is In Offer', field: 'is_offer', width: 150, sortable: true, filter: true },
      { headerName: 'Offer Type', field: 'offer_type', width: 150, sortable: true, filter: true },
      { headerName: 'Discount Rate', field: 'discount_rate', width: 150, sortable: true, filter: true },
      { headerName: 'Image Name', field: 'image_name', width: 150, sortable: true, filter: true },
      { headerName: 'Uploaded By', field: 'uploaded_by', width: 150, sortable: true, filter: true },
      { headerName: 'Uploaded On', field: 'uploaded_on', width: 150, sortable: true, filter: true },
    ];
  
       
      this.defaultColDef = {
        //flex: 1,
        cellClass: 'number-cell',
        resizable: true,
      };
  
      this.rowData = [];
      this.pinnedTopRowData = [];
      this.pinnedBottomRowData = [];
  }
  
  onGridReady(params) {
    //alert("grid ready - " + this.rowData.length );
    console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  
   
    //params.api.setPinnedBottomRowData(this.bottomRowData);
  }
  
  refreshGrid() {
    //scramble();
    //alert("refreshGrid ready - " + this.rowData.length );
    var params = {
      force: 'Y',
      suppressFlash: 'N',
    };
    
    this.gridApi.setRowData(this.rowData);
  
    this.gridApi.refreshCells(params);
  }
  
      
deleteGL() {

//this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
  if (this.rowDataClicked._id) {
    if (confirm('Are you sure to delete record?')) {
        this.appDataService.deleteAD(this.rowDataClicked).subscribe(
  (response) => {
    //this.selectGL(this.venderUID, this.venderName);

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
else { alert('Please select a record to delete.');}
}

      
deleteImage() {

  //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
    if (this.rowDataClickedImage._id) {
      if (confirm('Are you sure to delete record?')) {
          this.appDataService.deleteImage(this.rowDataClicked).subscribe(
    (response) => {
      //this.selectGL(this.venderUID, this.venderName);
  
    },
    (error) => {
      //Handle the error here
      //If not handled, then throw it
      console.error(error);
      alert(this.rowDataClickedImage.name + " cannot be deleted.");
  
    }
  )
  }
  }
  else { alert('Please select a record to delete.');}
  }
      
  ngOnInit() {
    this.loadAppData();
    this.userPrivs = this.sessionService.getUsersPrivs('APPD');
    //this.configureGrid();
    
  };
  
      formatNumber(params) {
        var number = params.value;
        return Math.floor(number)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
  
      formatDate(params) {
        return moment(params.value).format('yyyy-MM-dd');
      }

       // select the stock based on 
        selectIndex(data_id: any ) {
         
          var found = this.rowData.find(function(post, index) {
            if(post._id == data_id){
              
              this.selectedIndex = index;
              return true;
                        }
          });
        };
    
      onRowSelected(e) {
    
        if (e.node.selected) {
            // alert("Selected row is for  - " + e.node.data.name);
          this.rowDataClicked = e.node.data;
          alert(this.rowDataClicked._id + ' - ' + this.rowData.length )
          //this.selectIndex(this.rowDataClicked._id);
          this.selectedIndex = this.rowData.findIndex(x => x._id ===this.rowDataClicked._id);
          alert(this.selectedIndex)
          //this.appImagesList = this.rowData.find(({ _id }) => _id === this.rowDataClicked._id);
          this.rowDataImg = this.rowDataClicked.images;
          this.totalImages = this.rowDataClicked.images.length;
          }
        else {
            // alert("De-Selected row  for - " + e.node.data.name );
          // if deselected and already selected is deselected then wash the data 
          this.appImagesList = {};
          this.totalImages = 0;//this.appImagesList.length;
          if (this.rowDataClicked) {
            if (this.rowDataClicked._id == e.node.data._id) {
              this.rowDataClicked = {};
    
            }
          }
        }
    
      }

      onRowSelectedImg(e) {
    
        if (e.node.selected) {
            // alert("Selected row is for  - " + e.node.data.name);
           this.rowDataClickedImage = e.node.data;
         
          }
        else {
            // alert("De-Selected row  for - " + e.node.data.name );
          // if deselected and already selected is deselected then wash the data 
         
         
          if (this.rowDataClickedImage) {
            if (this.rowDataClickedImage._id == e.node.data._id) {
              this.rowDataClickedImage = {};
          
            }
          }
        }
    
      }
    
   

    
        // open the new / update form
        openGLDialog(id: any) {
          // create new record is clicked
          var operationOK = false;
         var vender_uid;
          // operation is new record
          if (id == 1 ){
            if (this.venderUID == "" || this.venderUID == null) 
              {       
                    vender_uid = '-1'
              }
              else{
                    vender_uid = this.venderUID;
              };
            
            operationOK = true;
          }
          // operation is update
          else if (id == 2){
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
          this.sessionService.setParameters([{ operation: id, 
                                              vender_uid: vender_uid, 
                                              vender_name: this.venderName, 
                                              gl_id: this.rowDataClicked._id }]);
                                            
          
      
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '1000px';
          
         
         // const dialogRef = this.dialog.open(GlNewComponent, dialogConfig);
      
          // dialogRef.afterClosed().subscribe(result => {
          //   console.log(result);
          //   if (result == "save") {
          //     if (this.venderUID != "-1"){
          //     //alert("vender uid " + this.venderUID)
          //     this.selectGL(this.venderUID, this.venderName);
          //   }
          //   else{this.venderUID = null;}
          //     //this.loadGL();
          //     this.rowDataClicked = {};
  
          //   }
          //   return (result);
          // });
        }
       // else
       //{ alert('Please select a record to update.');}
        }
    
         // open the new / update form
         openImageDialog(id: any) {
          // create new record is clicked
          var operationOK = false;
          
          // operation is new record
          if (id == 1 ){
            // add data operation       
            operationOK = true;
          }
          // operation is update
          else if (id == 2){
             if (!this.rowDataClickedImage._id )
             { alert('Please select a record to update.');}
             else {operationOK = true};
          }
          
          if (operationOK)
          {
          // update record is clicked
          //if (this.rowDataClicked._id ) {
          // delete the parameters array
          this.sessionService.deleteParameters();
          this.sessionService.setParameters([{ operation: id, 
                                               id:this.rowDataClicked._id,
                                               data:this.rowDataClickedImage }]);
                                            
          
      
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '1000px';
          
         
          const dialogRef = this.dialog.open(ImgUploadComponent, dialogConfig);
      
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result == "save") {
              alert(this.rowDataClicked._id);
              if (this.rowDataClicked._id){
                var appData = this.appDataService.getThisAD([{value: this.rowDataClicked._id}]) 
                // update the selected row
                console.log(JSON.stringify(appData))
                alert(this.selectedIndex);

             this.rowData[this.selectedIndex] = appData;
              console.log(JSON.stringify(this.rowData[this.selectedIndex]))
                  }
                  // result is cancelled
                  // else{this.venderUID = null;}
                  //   //this.loadGL();
                  //   this.rowDataClicked = {};
        
                  }
            return (result);
          });
        }
        else
       { alert('Please select a record to update.');}
        }

    }

    




