
import { AfterViewInit, ChangeDetectorRef, Component, effect, Input, OnInit, ViewChild } from '@angular/core';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../service/login.service';
import { filter, map } from 'rxjs/operators';
import { data } from 'jquery';
import { DataSource } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { startWith } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardService } from '../service/dashboard.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';




// interface Menu {
//   Name: string;
//   icon?: string;
//   subTitle?: string[];

// }
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],

})
export class DemoComponent implements OnInit, AfterViewInit {
  walletData = [
    { name: 'BTC', percentage: 15, value: '27.215', color: '#f7931a' },
    { name: 'ETH', percentage: 5, value: '4.367', color: '#62688f' },
    { name: 'GBP', percentage: 25, value: '£ 147.562,32', color: '#00b300' },
    { name: 'EUR', percentage: 11, value: '€ 137.457,25', color: '#5eab3d' },
    { name: 'USD', percentage: 29, value: '$ 133.364,12', color: '#00a6c4' },
    { name: 'XAU', percentage: 29, value: '200 g', color: '#f4b400' }
  ];
  constructor(private service: DashboardService, private dialog: MatDialog) { }
  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.stockDataSource.paginator = this.paginator
  }
  stockDataSource = new MatTableDataSource()
  FilterControl = new FormControl
  CategoryArr: any[] = new Array()
  FilterCatg: any = new Array()
  LocationId: number = 0
  Type = new FormControl(1)
  ngOnInit() {
    this.FilterControl.valueChanges.pipe(map((search: string) =>
      this.CategoryArr.filter((option: any) =>
        option.grntype.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.FilterCatg = filtered));
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]
    this.getWarehouse()
    this.getCatogory()
    this.getCategoryMatl()
  }
  WarehouseArr: any[] = new Array()
  getWarehouse() {
    this.service.ListWarhouse().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'Y') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.WarehouseArr = res
        }
      }
    })
  }



  getCatogory() {
    this.service.Category().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'Y') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          // console.log(res);
          
          this.CategoryArr = res.slice(0, 2);  
          this.FilterCatg = res.slice(0, 2); 
          console.log(  this.FilterCatg);
          
          this.Type.setValue(res[0].grntypeid)
        }
      }
    })
  }
  getCategoryMatl() {
    this.service.MatlData(this.LocationId, this.Type.value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'Y') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          let arr = {
            Avl_stock: this.i + 1
          }
          this.StockList = res
          this.StockList.forEach((element) => {
            return Object.assign(element, arr)
          })

          console.log(this.StockList);
          this.stockDataSource.data = [...this.StockList];
          this.stockDataSource.paginator = this.paginator
        } else {
          this.stockDataSource.data = []
        }
      }
    })
  }
  StockList: any[] = []
  i: number = 0
  TypeEvent() {
    if (this.Type.value) {
      this.service.MatlData(this.LocationId, this.Type.value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'Y') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            let arr = {
              Avl_stock: this.i + 1
            }
            this.StockList = res
            this.StockList.forEach((element) => {
              return Object.assign(element, arr)
            })
            this.StockList = res
            this.stockDataSource.data = [...this.StockList];
            this.stockDataSource.paginator = this.paginator
          } else {
            this.stockDataSource.data = []
          }
        }
      })
    }
  }
  materialInput(e: any) {
    let materialName = e.target.value.trim().toLowerCase();

    if (materialName) {
      this.stockDataSource.data = this.StockList.filter(element =>
        element.rawmatname?.toLowerCase().startsWith(materialName)
      );
    } else {
      this.stockDataSource.data = [...this.StockList];
    }
  }
  SubCard: boolean = true
  MainCard: Boolean = false
  View() {
    this.SubCard=false
    this.MainCard=true
  }
  back(){
    this.SubCard=true
    this.MainCard=false
  }



  getSeverity(minLevel?: number, stock?: number): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    if (minLevel === undefined || stock === undefined) {
      return "info";
    }

    if (minLevel === 0) {
      return "danger";
    } else if (minLevel >= stock) {
      return "warning";
    } else {
      return "success";
    }
  }

  getCompanyColor(companyID: number): string {
    switch (companyID) {
      case 1: return '#00b4d8 ';
      case 2: return '#7cb518';
      case 3: return 'blue';
      case 5: return '#00798c';
      case 6: return 'purple';
      case 7: return '#00798c';
      default: return 'black'; // Default color for unknown CompanyID
    }
  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }
}