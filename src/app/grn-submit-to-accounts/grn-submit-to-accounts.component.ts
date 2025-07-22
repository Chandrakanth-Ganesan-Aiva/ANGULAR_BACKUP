import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GrnSubmitToAccountsService } from '../service/grn-submit-to-accounts.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PrintPageComponent } from '../print-page/print-page.component';
import { data } from 'jquery';

@Component({
  selector: 'app-grn-submit-to-accounts',
  templateUrl: './grn-submit-to-accounts.component.html',
  styleUrl: './grn-submit-to-accounts.component.scss'
})
export class GrnSubmitToAccountsComponent implements OnInit, OnDestroy, AfterViewInit {
  LocationId: number = 0
  form!: FormGroup;
  CurrDate: any
  Empid: number = 0
  constructor(private service: GrnSubmitToAccountsService, private dialog: MatDialog,
    private fb: FormBuilder, private date: DatePipe, private router: Router) {

    this.CurrDate = this.date.transform(new Date(), 'yyyy-MM-dd')

    this.LocationId = JSON.parse(sessionStorage.getItem('location') || '{}');
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid

    this.form = this.fb.group({
      unit: ['', [Validators.required]],
      id: ['', [Validators.required]],
    })
  }
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  dataSource = new MatTableDataSource<any>()
  ngOnInit() {
    this.getUnit()
    this.service.Id(this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.form.controls['id'].setValue(res[0].Id)
        }
      }
    })
  }

  getUnit() {
    this.service.Unit(this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.form.controls['unit'].setValue(res[0].location)

        }
      }
    })
    this.getView()
  }
  ViewGrnDet: any[] = new Array()
  getView() {
    this.service.View(this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
            console.log('yes');
          this.ViewGrnDet = res
          this.ViewGrnDet = this.ViewGrnDet.map((element: any) => ({
            ...element,
            select: false,
            value: Number(element.value).toFixed(2)
          }));
          this.dataSource.data = [...this.ViewGrnDet]
          this.dataSource.data = [...this.dataSource.data]
            console.log('yes');
        } else {
          this.dataSource.data = [...res]
           this.dataSource.data = [... this.dataSource.data]
           console.log('no');
           
        }
      }
    })
  }
  SelectAll: boolean = false;
  isIndeterminate: boolean = false;
  toggleSelectAll(event: any) {
    this.SelectAll = event.checked;
    this.dataSource.data.forEach(row => row.select = this.SelectAll);
    this.isIndeterminate = false;
  }
  onCheckboxChange() {
    const total = this.dataSource.data.length;
    const selectedCount = this.dataSource.data.filter(row => row.select).length;
    this.SelectAll = selectedCount === total;
    this.isIndeterminate = selectedCount > 0 && selectedCount < total;
  }
  Search(e: any) {
    let searchValue = e.target.value
    if (searchValue) {
      this.dataSource.filter = searchValue.trim().toLowerCase()
      this.dataSource.data = [... this.dataSource.data];
    } else {
      searchValue = ''
    }
  }
  PrintComDialog!: MatDialogRef<PrintPageComponent>;
  View() {
    let isSelected = this.dataSource.data.filter((item: any) => item.select)
    if (isSelected.length == 0) {
      this.Error = 'Please Select Atleast One row To Move Grn To Accounts'
      this.userHeader = 'Information'
      return this.opendialog()
    } else {
      this.dataSource1.data = []
      this.dataSource1.data = [...isSelected]
      this.PrintComDialog = this.dialog.open(PrintPageComponent, {
        disableClose: true,
        data: {
          Comp_Name: "grnSubmitToAcc",
          dataSource: this.dataSource1.data,
          PrintId: this.form.controls['id'].value,
        },
      });
      this.PrintComDialog.afterClosed().subscribe((result: any) => {
        console.log(result);
        if (result) {
          this.getView()
        }
      });
    }
  }
  dataSource1 = new MatTableDataSource<any>()
  clear() {
    this.ViewGrnDet = this.ViewGrnDet.map((element: any) => ({
      ...element,
      select: false,
      value: Number(element.value).toFixed(2)
    }));
    this.dataSource.data = [...this.ViewGrnDet]
  }

  ngOnDestroy() {

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
