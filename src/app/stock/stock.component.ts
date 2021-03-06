import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
import { stockWS } from '../ws/stockWS';
import {GridOptions} from "@ag-grid-community/all-modules";
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {StockNewComponent} from "./stock-new/stock-new.component";
import * as momentNs from 'moment';
const moment = momentNs;
import {LovComponent} from '../lov/lov.component';
import { utilWS } from '../ws/utilWS';
import {jsPDF, jsPDFOptions} from 'jspdf';
//import 'jspdf-autotable';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  public gridOptions:GridOptions;
  constructor(
    private router: Router,
    private sessionService: sessionService,
    public stockService: stockWS,
    public dialog: MatDialog,
    public utilService : utilWS,
  ) {
    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      }   
    };
    
  }

  stockDataList: any = [];
  stockDataListDisplay: any = [];
  selectedDataList: any = [];
  term: string;
  isBusy = false;
  isDetailBusy = false;
  totalAmount : any = 0;
  itemStockDataList : any = [];
  columnDefs = [];
  defaultColDef ;
  rowData: any = [];
  rowDataClicked:any = {};
  itemUID = "";
  item_name = "";
    userPrivs = {	insert_allowed : false,
					update_allowed : false,
					delete_allowed : false,
					view_allowed : false};
   
    style = {
    marginTop: '0px',
    padding:'0px',
    width: '100%',
    height: '600px',
    flex: '1 1 auto'
};

  


  async loadStock() {
    this.isBusy = true;
    //let response = await this.stockService.getStock();
    let response = await this.stockService.getSummaryStock();
    this.stockDataList = response;
    this.stockDataListDisplay = [];
    this.stockDataList.forEach(element => {
      this.stockDataListDisplay.push({"item_uid":element._id.item_uid , 
                                      "item_name":element._id.item_name,
                                      "stock_bar_code" : "",
                                      "items_count" : element.total_items,
                                      "stock_sold" : element.total_sold,
                                    "available_stock": element.available_stock});
    });
    this.isBusy =  false;
  };

  // select the stock based on 
  async selectStock(item_uid: any , item_name:any ) {
    this.isDetailBusy = true
    this.item_name = item_name;
    this.itemUID = item_uid;
    let response = await this.stockService.getItemStock([{"value":item_uid}]);
    this.itemStockDataList = response;

    this.defaultColDef = {
      //flex: 1,
      cellClass: 'number-cell',
      resizable: true,
      sortable: true, 
      filter: true
    };


    
    this.columnDefs = [
      {
        headerName: '',
        width: 45,
        sortable: false,
        filter: false,
        checkboxSelection: true
      
      },
      
      //{ headerName: 'Item#', field: 'item_uid', width: 150, sortable: true, filter: true },
      { headerName: 'Code', field: 'stock_code', width: 200, sortable: true, filter: true },
      {
        headerName: 'Received On', field: 'stock_received_on', width: 150, sortable: true, filter: true
        ,valueFormatter: function (params) {
          return moment(params.value).format('DD-MMM-YYYY');}
      },
      { headerName: 'Vender', field: 'vender_name', width: 150, sortable: true, filter: true },
      // { headerName: 'Item Name', field: 'item_name', width: 300, sortable: true, filter: true },
      { headerName: 'Total', field: 'items_count', width: 120, sortable: true, filter: true },
      { headerName: 'Sold', field: 'stock_sold', width: 120, sortable: true, filter: true },
      { headerName: 'Rem.', field: 'remaining', width: 120, sortable: true, filter: true },
      
      { headerName: 'Bill Amount', field: 'total_bill_amount', width: 150, sortable: true, filter: true },
      { headerName: 'Shp Charges', field: 'shipping_charges', width: 150, sortable: true, filter: true },
      { headerName: 'Del Charges', field: 'delivery_charges', width: 150, sortable: true, filter: true },
      { headerName: 'vat', field: 'vat', width: 150, sortable: true, filter: true },
      { headerName: 'Cost Price', field: 'items_cost', width: 150, sortable: true, filter: true },
      { headerName: 'Sales Price', field: 'sales_price', width: 150, sortable: true, filter: true },
      
      { headerName: 'Requested On', field: 'request_placed_on', width: 200, sortable: true, filter: true 
      ,valueFormatter: function (params) {
        return moment(params.value).format('DD-MMM-YYYY');}
    },
      
      {
        headerName: 'Bar Code', field: 'stock_bar_code', width: 250, sortable: true, filter: true,
      },
      { headerName: 'Stock#', field: 'stock_uid', width: 150, sortable: true, filter: true },
    ];
    this.rowData = response;
    this.isDetailBusy = false;

    };
 
    deleteStock() {
      
  
      //alert( 'data: ' + this.selectedID );
      //this.webService.deleteLUD(this.LUDdataList[id]).subscribe(
        if (this.rowDataClicked._id) {
          if (confirm('Are you sure to delete record?')) {
             this.stockService.deleteStock(this.rowDataClicked).subscribe(
        (response) => {
          this.selectStock(this.itemUID, this.item_name);
  
        },
        (error) => {
          //Handle the error here
          //If not handled, then throw it
          console.error(error);
          alert(this.rowDataClicked.stock_uid + " cannot be deleted.");
  
       }
     )
      }
    }
      else { alert('Please select a record to delete.');}
  }
  
  ngOnInit() {

    
    this.loadStock();
    this.userPrivs = this.sessionService.getUsersPrivs('STK');
    
  };

  createPdf(){
    var opt: jsPDFOptions = {
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      // unit: "in",
      //   format: [4, 2]
     
     }

     var vHeader = ['a' , 'b' , 'c'];
     var vData = [
       {col1:'11' , col2:'12' , col3:'13'},
       {col1:'21' , col2:'22' , col3:'23'},
    ];

    var header = createHeaders(vHeader);

        function createHeaders(keys) {
            return keys.map(key => ({
              'name': key,
              'prompt': key,
              'width':65,
              'align':'center',
              'padding':0
            }));
        }
        let styles = {
          autoSize: true,
          printHeaders: false,
          columnWidths: 80
        }
   
    // Landscape export, 2×4 inches
    const doc = new jsPDF(opt);
    //doc.table(20, 10 , vData, header, styles);

    //doc.autoTable(col, rows, { startY: 10 });

    doc.text("Hello world!", 10, 10);
    doc.save("two-by-four.pdf");
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
    openStockDialog(id: any) {
      // create new record is clicked
      var operationOK = false;
      //alert("operation - " + id);
      // operation is new record
      if (id == 1 ){
        // if (this.itemUID == "" || this.itemUID == null) 
        //   {alert("Please select an item first.");}
       // else {
          operationOK = true
       // };
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
                                          item_uid: this.itemUID, 
                                          stock_id: this.rowDataClicked._id }]);
                                        
      
  
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '1000px';
      
     
      const dialogRef = this.dialog.open(StockNewComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result == "save") {
          this.selectStock(this.itemUID, this.item_name);
          this.loadStock();
          this.rowDataClicked = {};
        
        }
        return (result);
      });
    }
   // else
   //{ alert('Please select a record to update.');}
    }


    // open the new / update form
      openLov() {

  //     // parameters lov type can be LUH - LU Header, 
  //         //                            LUD  - LU Details
  //         //                            USR  - Users
  //         //                            VEN  - Venders
  //         //                             CAT  - Categories
  //         //                             ITM  - Items
  //         //                             CIT  - Cities
  //         //                             CON  - Countries
  //         //                             STA  - States
  //         //                             VAC  - Vender Accounts
  //         //                             CUS  - Customers                           
  //         // Nature : S - single value selection , M - Multile value selection
     
  //     this.utilService.openLov('CUS' , 'S', function(data){  
  //       alert( data.length)
  //     });
      
      
   }

}