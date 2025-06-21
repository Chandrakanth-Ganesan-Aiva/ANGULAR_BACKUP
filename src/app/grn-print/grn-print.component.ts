import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { from, map, pipe } from 'rxjs';
import { GrnprintService } from '../service/grnprint.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-grn-print',
  templateUrl: './grn-print.component.html',
  styleUrl: './grn-print.component.scss'
})
export class GrnPrintComponent implements OnDestroy, OnInit, AfterViewInit {
  form!: FormGroup
  LocationId: number = 0
  Empid: number = 0
  UnitFilter = new FormControl('')
  SupplierFilter = new FormControl('')
  constructor(private date: DatePipe, private fb: FormBuilder, private dialog: MatDialog, private service: GrnprintService) {

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]

    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid

    this.form = this.fb.group({
      frmdate: [this.date.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      todate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, [Validators.required]],
      unit: ['', [Validators.required]],
      Supplier: ['', [Validators.required]]
    })
  }
  @ViewChild('paginator') paginator!: MatPaginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    this.getUnit()
    this.getSupplier()
    this.UnitFilter.valueChanges.pipe(map((search) =>
      this.Unit.filter((option: any) =>
        option.location.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.UnitFilterArr = filtered))

    this.SupplierFilter.valueChanges.pipe(map((search) =>
      this.supplierArr.filter((option: any) =>
        option.supname.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.SupplierFilterArr = filtered))
  }
  dateChageEvent(e: any) {
    this.form.controls['frmdate'].setValue(e.target.value)
  }
  Unit: any[] = new Array()
  UnitFilterArr: any[] = new Array()
  getUnit() {
    this.service.Unit().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.Unit = res
          this.UnitFilterArr = res
          this.form.controls['unit'].setValue(res[0].companyid)
        }
      }
    })
  }
  supplierArr: any[] = new Array
  SupplierFilterArr: any[] = new Array
  getSupplier() {
    this.service.Supplier().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.supplierArr = res
          this.SupplierFilterArr = res
          this.form.controls['Supplier'].setValue(res[0].supid)
        }
      }
    })
  }
  dataSource = new MatTableDataSource<any>()
  ViewPrintItems: any[] = new Array()
  View() {
    if (this.form.invalid) {
      return this.form.markAllAsTouched()
    } else {
      this.form.disable()
      let startdate = this.form.controls['frmdate'].value
      let enddate = this.form.controls['todate'].value
      this.service.View(this.form.controls['unit'].value, startdate, enddate, this.form.controls['Supplier'].value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            this.ViewPrintItems = res
            this.ViewPrintItems = this.ViewPrintItems.map((element: any) => ({
              ...element,
              select: false
            }));
            this.dataSource.data = [...this.ViewPrintItems]
          } else {
            this.Error = `No Records Found for this  Fromdate: <b style="color:Brown">${startdate} </b> ToDate: <b style="color:Brown">${startdate}</b>`
            this.userHeader = 'Information'
            return this.opendialog()
          }
        }
      })
    }
  }
  clear() {
    this.form.enable()
    this.form.reset()
    this.form.markAsUntouched()
    this.dataSource.data = []
    this.form.controls['frmdate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.form.controls['todate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
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
  Print() {
    let isSelected = this.dataSource.data
      .filter((item: any) => item.select)
      .map((select: any) => select.grn_ref_no)
    console.log(isSelected);
    isSelected = ['GRN/GPO/U1/25-26/5431','GRN/GPO/U1/25-26/543']
    if (isSelected.length > 0) {
      this.service.Print(isSelected).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              let messageParts = ''
              messageParts = res[0].Msg.split('@#');
              this.Error = messageParts[0]
              this.userHeader = messageParts[1]
              return this.opendialog()
            }
          }
        }
      })
    } else {
      this.Error = 'Please Select atleast one Item From the Table to Print'
      this.userHeader = 'Information'
      return this.opendialog()
    }
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
