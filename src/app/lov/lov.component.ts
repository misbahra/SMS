  import { Component, OnInit , Inject} from '@angular/core';
  import {luWS} from '../ws/luWS';
  import {vendersWS} from '../ws/vendersWS';
  import {venderAccountsWS} from '../ws/venderAccountsWS';
  import {customersWS} from '../ws/customersWS';
  import {citiesWS} from '../ws/citiesWS';
  import {countriesWS} from '../ws/countriesWS';
  import {statesWS} from '../ws/statesWS';
  import {mainWS} from '../ws/mainWS';
  import {ItemCategoriesWS} from '../ws/itemCategoriesWS';
  import {ItemsWS} from '../ws/itemsWS';
  //import {utilWS} from '../ws/utilWS';
  import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
  interface DialogData {
    data: string;
  }

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.css']
})
export class LovComponent implements OnInit {
  
 
      resp: any = [];
      isBusy = false;
      queryParams: any = [];
      dataList: any = [];
      selectedDataList = [];
      style = {
        marginTop: '0px',
        padding:'0px',
        width: '100%',
        height: '400px',
        flex: '1 1 auto'
    };
    rowDataClicked:any = [];
    columnDefs = [];
    defaultColDef = {
      //flex: 1,
      cellClass: 'number-cell',
      resizable: true,
      sortable: true, 
      filter: true
    };

    term: string;
    uidName: string;
    uidDescName: string;
    response : any;
    rowSelection = "";

    rowData: any = [];
  
      constructor(
        private luService: luWS,
        private venderService: vendersWS,
        private vaService: venderAccountsWS,
        private customerService: customersWS,
        private countriesService: countriesWS,
        private citiesService: citiesWS,
        private statesService: statesWS,
        private mainService: mainWS,
       
       // private utilService: utilWS,
        public dialogRef: MatDialogRef<LovComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
      ) {  }
    
      ngOnInit() {
        this.queryParams = this.data;

        //alert ("Parameter Received is -" + this.queryParams.type )
        // data will have two values lov_type and lov_nature
        // values are described below
          // parameters lov type can be LUH - LU Header, 
          //                            LUD  - LU Details
          //                            USR  - Users
          //                            VEN  - Venders
          //                             CAT  - Categories
          //                             ITM  - Items
          //                             CIT  - Cities
          //                             CON  - Countries
          //                             STA  - States
          //                             VAC  - Vender Accounts
          //                             CUS  - Customers                           
          // Nature : S - single value selection , M - Multile value selection

        this.loadData();
          
        
      };

      async loadData() {
        this.isBusy = true;
        // lovNature handeling to enamble single select or multiselect
        if (this.queryParams.lovNature == 'M')
        {
          this.rowSelection = 'multiple';
        }
        else
        {
          this.rowSelection = 'single';
        }
// lovtype handeling to load data
        if (this.queryParams.type == "LUH"){this.response = await this.luService.getLUH();}
        else if (this.queryParams.type == "LUD"){this.response = await this.luService.getLUDFromDB({});}
        //else if (this.queryParams.type == "USR"){this.response = await this. .getLUH();}
        else if (this.queryParams.type == "VEN"){this.response = await this.venderService.getVenders();}
        //else if (this.queryParams.type == "CAT"){this.response = await this.;}
       // else if (this.queryParams.type == "ITM"){this.response = await this.item;}
       // else if (this.queryParams.type == "CIT"){this.response = await this.webService.getLUH();}
       // else if (this.queryParams.type == "CON"){this.response = await this.webService.getLUH();}
       // else if (this.queryParams.type == "VAC"){this.response = await this.vender;}
        else if (this.queryParams.type == "CUS"){this.response = await this.customerService.getCustomers();}

        else {}
        

        this.dataList = this.response;
        // each response will have two column LOV_UID and LOV_DESC which are 
        // basically virtual columns of each model 
        this.columnDefs = [
          {
            headerName: '',
            width: 45,
            sortable: false,
            filter: false,
            checkboxSelection: true
          
          },
          { headerName: 'lov_uid', field: 'lov_uid', width: 150  },
          { headerName: 'lov_desc', field: 'lov_desc', width: 250  },
          
        ];
        this.rowData = this.dataList;
        this.isBusy = false;
    
        };

onCancel() {
      
        this.dialogRef.close('C');
      }
     
onSubmit() {
      // this.utilService.lov_selected_values = this.rowDataClicked;
         this.dialogRef.close('S');
    
      }
    
onRowSelected(e) {
    if (e.node.selected) {
         this.rowDataClicked.push(e.node.data);
    
        }
        else {
          var selectedIndex;
          var found = this.rowDataClicked.find(function(post, idx) {
            if(post.lov_uid == e.node.data.lov_uid){
              
              selectedIndex = idx
              //alert("found - " + e.node.data.lov_uid + " - " + selectedIndex );
              return true;
            }
          });
          this.rowDataClicked.splice(selectedIndex , 1);
           
          
          
    
          }
        }
    
      
      
    
    }