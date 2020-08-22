import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { sessionService } from '../ws/sessionWS';
import { stockWS } from '../ws/stockWS';
import {GridOptions} from "@ag-grid-community/all-modules";
import {MatDialogModule, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {StockNewComponent} from "./stock-new/stock-new.component";

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
    public dialog: MatDialog
  ) {
    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      }   
    }
  }

  stockDataList: any = [];
  stockDataListDisplay: any = [];
  selectedDataList: any = [];
  term: string;
  isBusy = false;
  totalAmount : any = 0;
  itemStockDataList : any = [];
  columnDefs = [];
  rowData: any = [];
  rowDataClicked:any = {};
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

  


  async loadStock() {
    this.isBusy = true;
    //let response = await this.stockService.getStock();
    let response = await this.stockService.getSummaryStock();
    this.stockDataList = response;
    this.stockDataList.forEach(element => {
      this.stockDataListDisplay.push({"item_uid":element.item_uid , 
                                      "item_name":element.item_name,
                                      "stock_bar_code" : "",
                                      "items_count" : element.total_items,
                                      "stock_sold" : element.total_sold,
                                    "available_stock": element.available_stock});
    });
    this.isBusy =  false;
  };

  // select the stock based on 
  async selectStock(item_uid: any ) {
    //alert("item_uid - " + item_uid);
    let response = await this.stockService.getItemStock([{"value":item_uid}]);
    this.itemStockDataList = response;

    this.columnDefs = [
      {
        headerName: '',
        width: 45,
        sortable: false,
        filter: false,
        checkboxSelection: true
      
      },
      { headerName: 'Stock#', field: 'stock_uid', width: 150, sortable: true, filter: true },
      { headerName: 'Item#', field: 'item_uid', width: 150, sortable: true, filter: true },
      { headerName: 'Item Name', field: 'item_name', width: 300, sortable: true, filter: true },
      { headerName: 'Item Count', field: 'items_count', width: 150, sortable: true, filter: true },
      { headerName: 'Sold', field: 'stock_sold', width: 150, sortable: true, filter: true },
      { headerName: 'Remaining', field: 'remaining', width: 150, sortable: true, filter: true },
      { headerName: 'Requested On', field: 'request_placed_on', width: 200, sortable: true, filter: true },
      {
        headerName: 'Received On', field: 'stock_received_on', width: 200, sortable: true, filter: true,
      },
      {
        headerName: 'Bar Code', field: 'stock_bar_code', width: 250, sortable: true, filter: true,
      },
  
    ];
    this.rowData = response;
    this.isBusy = false;

    };
 
  deleteStock(index : any ) {
  
  };
  
  ngOnInit() {

    
    this.loadStock();
    this.userPrivs = this.sessionService.getUsersPrivs();
    
  };

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
      if (this.rowDataClicked._id || id == null ) {
      // delete the parameters array
      this.sessionService.deleteParameters();
      this.sessionService.setParameters([{ name: "item_uid", value: this.rowDataClicked.item_uid }]);
      // check if any parameter is sent or not
      //if sent then this will be opened for update
      //alert("test 1")
      if (id != null) {
  //alert("test 2")
        this.sessionService.deleteParameters();
        this.sessionService.setParameters([{ name: "stock_id", value: this.rowDataClicked._id }]);
  
      }
  
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '1000px';
      
     
      const dialogRef = this.dialog.open(StockNewComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result == "save") {
          this.selectStock(this.rowDataClicked.item_uid);
          this.rowDataClicked = {};
        
        }
        return (result);
      });
    }
    else
   { alert('Please select a record to update.');}
    }

}