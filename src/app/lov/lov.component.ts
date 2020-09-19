  import { Component, OnInit , Inject} from '@angular/core';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import * as luWS from '../ws/luWS';
  import * as wsrSessionService from '../ws/sessionWS';
  import { Router } from "@angular/router";
  
  import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
  import { AbstractControl } from '@angular/forms';
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
    };
    term: string;
    uidName: string;
    uidDescName: string;
    response : any;
    rowSelection = "";

    rowData: any = [];
  
      constructor(private webService: luWS.luWS,
        private sessionService: wsrSessionService.sessionService,
        private router: Router,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<LovComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
      ) {  }
    
      ngOnInit() {
        this.queryParams = this.data;
        alert ("Parameter Received is -" + this.queryParams.type )
        this.loadData();
          
        
      };
    
     
    
      async loadData() {
        this.isBusy = true;
        if (this.queryParams.lovNature == 'M')
        {
          this.rowSelection = 'multiple';
        }
        else
        {
          this.rowSelection = 'single';
        }

        if (this.queryParams.type == "LUH"){
        this.response = await this.webService.getLUH();
        this.uidName = "luh_code";
        this.uidDescName =  "luh_desc";
        }
        else if (this.queryParams.type == "LUH"){
        }

        else {}
        

        this.dataList = this.response;

        this.columnDefs = [
          {
            headerName: '',
            width: 45,
            sortable: false,
            filter: false,
            checkboxSelection: true
          
          },
          { headerName: 'ID', field: this.uidName, width: 150  },
          { headerName: 'Desc', field: this.uidDescName, width: 250  },
          
        ];
        this.rowData = this.dataList;
        this.isBusy = false;
    
        };

onCancel() {
      
        this.dialogRef.close('cancel');
      }
     
onSubmit() {
       
         this.dialogRef.close('save');
    
      }
    
onRowSelected(e) {
    if (e.node.selected) {
         this.rowDataClicked.push(e.node.data);
    
        }
        else {
          var selectedIndex;
          var found = this.rowDataClicked.find(function(post, idx) {
            if(post.luh_code == e.node.data.luh_code){
              
              selectedIndex = idx
              alert("found - " + e.node.data.luh_code + " - " + selectedIndex );
              return true;
            }
          });
          this.rowDataClicked.splice(selectedIndex , 1);
           
          
          
    
          }
        }
    
      
      
    
    }