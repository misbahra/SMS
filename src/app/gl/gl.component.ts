import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
import { glWS } from '../ws/glWS';
import {GridOptions} from "@ag-grid-community/all-modules";
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {GlNewComponent} from "../gl/gl-new/gl-new.component";
import * as momentNs from 'moment';
const moment = momentNs;
import {utilWS} from '../ws/utilWS'

@Component({
  selector: 'app-gl',
  templateUrl: './gl.component.html',
  styleUrls: ['./gl.component.css']
})
export class GlComponent implements OnInit {
 
    public gridOptions:GridOptions;
    constructor(
      private router: Router,
      private sessionService: sessionService,
      public glService: glWS,
      public dialog: MatDialog,
      private utilService : utilWS
    ) {
      this.gridOptions = <GridOptions>{
        onGridReady: () => {
          this.gridOptions.api.sizeColumnsToFit();
        }   
      }
    }
  
    glDataList: any = [];
    glDataListDisplay: any = [];
    selectedDataList: any = [];
    term: string;
    isBusy = false;
    totalAmount : any = 0;
    venderGlDataList : any = [];
    columnDefs = [];
    defaultColDef ;
    rowData: any = [];
    rowDataClicked:any = {};
    autoGroupColumnDef;
    venderUID = "";
    venderName = "";
      userPrivs = {"viewAllowed":"N",
                  "editAllowed":"N",
                  "deleteAllowed":"N",
                  "createAllowed":"N"};
     
      style = {
      marginTop: '0px',
      padding:'0px',
      width: '100%',
      height: '600px',
      flex: '1 1 auto'
  };
  
    
  
  
    async loadGL() {
      this.isBusy = true;
      
      //let response = await this.stockService.getStock();
      let response = await this.glService.getSummaryGL();
      this.glDataList = response;
      this.glDataListDisplay = [];
      this.glDataList.forEach(element => {
        if (element.vender_uid != null){
        this.glDataListDisplay.push({"vender_uid":element.vender_uid , 
                                        "vender_name":element.vender_name,
                                       "fund_amount" : element.fund_amount,
                                        "cargo_amount" : element.cargo_amount,
                                      "balance": element.fund_amount - element.cargo_amount });
                                    };
                                    });
    
      this.isBusy =  false;
    };
  
    // select the stock based on 
    async selectGL(vender_uid: any , vender_name:any ) {
      //alert("item_uid - " + item_uid);
      this.venderName = vender_name;
      this.venderUID = vender_uid;
      let response = await this.glService.getVenderGL([{"value":vender_uid}]);
      this.venderGlDataList = response;

      this.defaultColDef = {
        //flex: 1,
        cellClass: 'number-cell',
        resizable: true,
      };
      
      this.columnDefs = [
        {
          headerName: '',
          width: 45,
          sortable: false,
          filter: false,
          checkboxSelection: true
        
        },
        //{ headerName: 'Vender', field: 'vender_name', width: 150, sortable: true, filter: true },
        { headerName: 'Date', field: 'gl_date', width: 130, sortable: true, filter: true 
        , valueFormatter: function (params) {
          return moment(params.value).format('DD-MMM-YYYY');}},
        { headerName: 'Head', field: 'account_head_name', width: 200, sortable: true, filter: true },
        { headerName: 'Curr', field: 'currency_desc', width: 130, sortable: true, filter: true },
        { headerName: 'Sent', field: 'fund_amount', width: 150, sortable: true, filter: true 
        ,cellClass: 'number-cell', resizable: true, cellStyle: {textAlign: "right",color:"green"}
        , valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
        { headerName: 'Received', field: 'cargo_amount', width: 150, sortable: true, filter: true 
        , cellStyle: {textAlign: "right", color:"red"}
        , valueFormatter: function(params) {
          var num =   Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          if (num == "0" ){return null;}
          else {return num;}
          
        },
      },
      { headerName: 'Sent To', field: 'sent_to_vender_name', width: 150, sortable: true, filter: true },
      { headerName: 'Sent to Account', field: 'sent_to_vender_account_uid', width: 150, sortable: true, filter: true },
      { headerName: 'Through', field: 'through_vender_name', width: 150, sortable: true, filter: true },
        { headerName: 'Account', field: 'vender_account_uid', width: 150, sortable: true, filter: true },
        { headerName: 'Payment Sent On', field: 'funds_sent_on', width: 150, sortable: true, filter: true },
        { headerName: 'Payment Received On', field: 'funds_received_on', width: 150, sortable: true, filter: true },
        { headerName: 'Exchange', field: 'exchange', width: 150, sortable: true, filter: true },
        { headerName: 'Other Charges', field: 'other_charges', width: 150, sortable: true, filter: true },
        { headerName: 'Bill Amount', field: 'cargo_bill_amount', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo Amount', field: 'cargo_charges', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo VAT', field: 'cargo_vat', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo Comission', field: 'cargo_commission', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo Customs', field: 'customs_charges', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo Requested on', field: 'cargo_requested_on', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo Shipped on', field: 'cargo_shipped_on', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo Received on', field: 'cargo_received_on', width: 150, sortable: true, filter: true },
        { headerName: 'Courier', field: 'courier_code', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo weight', field: 'cargo_weight', width: 150, sortable: true, filter: true },
        { headerName: 'Cargo Items', field: 'cargo_items_count', width: 150, sortable: true, filter: true },
        { headerName: 'Ref#', field: 'ref_number', width: 130, sortable: true, filter: true },
        { headerName: 'Status', field: 'gl_status', width: 130, sortable: true, filter: true },
        { headerName: 'Additional Details', field: 'additional_details', width: 150, sortable: true, filter: true },
        { headerName: 'Remarks', field: 'remarks', width: 150, sortable: true, filter: true },
  
      ];
      this.rowData = response;
      this.isBusy = false;
  
      };


   
      deleteGL() {
        
    
        //alert( 'data: ' + this.selectedID );
        //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
          if (this.rowDataClicked._id) {
            if (confirm('Are you sure to delete record?')) {
               this.glService.deleteGL(this.rowDataClicked).subscribe(
          (response) => {
            this.selectGL(this.venderUID, this.venderName);
    
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
    
    ngOnInit() {
  
      
      this.loadGL();
      this.userPrivs = this.sessionService.getUsersPrivs();
      
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
  
  
      // open the new / update form
      openGLDialog(id: any) {
        // create new record is clicked
        var operationOK = false;
        //alert("operation - " + id);
        // operation is new record
        if (id == 1 ){
          if (this.venderUID == "" || this.venderUID == null) 
            {alert("Please select an item first.");}
          else {operationOK = true};
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
                                            vender_uid: this.venderUID, 
                                            vender_name: this.venderName, 
                                            gl_id: this.rowDataClicked._id }]);
                                          
        
    
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '1000px';
        
       
        const dialogRef = this.dialog.open(GlNewComponent, dialogConfig);
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (result == "save") {
            
            this.selectGL(this.venderUID, this.venderName);
            this.loadGL();
            this.rowDataClicked = {};
          
          }
          return (result);
        });
      }
     // else
     //{ alert('Please select a record to update.');}
      }
  
  }