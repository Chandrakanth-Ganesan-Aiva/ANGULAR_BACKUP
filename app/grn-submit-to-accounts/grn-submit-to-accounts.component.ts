import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GrnSubmitToAccountsService } from '../service/grn-submit-to-accounts.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

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
  constructor(private service: GrnSubmitToAccountsService, private dialog: MatDialog, private fb: FormBuilder, private date: DatePipe) {

    this.CurrDate = this.date.transform(new Date(), 'yyyy-MM-dd')

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]

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
          this.ViewGrnDet = res
          this.ViewGrnDet = this.ViewGrnDet.map((element: any) => ({
            ...element,
            select: false
          }));
          this.dataSource.data = [...this.ViewGrnDet]
        }
      }
    })
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
  View() {
    let isSelected = this.dataSource.data.filter((item: any) => item.select)
    if (isSelected.length == 0) {
      this.Error = 'Please Select Atleast One row To Move Grn To Accounts'
      this.userHeader = 'Information'
      return this.opendialog()
    } else {
      this.dataSource1.data = []
      this.dataSource1.data = [...isSelected]
    }

  }
  dataSource1 = new MatTableDataSource<any>()
  Print() {
    this.Error = 'Do You Want To Print/Save ?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        let updateData: any[] = []
        for (let data of this.dataSource1.data) {
          updateData.push({
            PrintId: this.form.controls['id'].value,
            Printedby: this.Empid,
            grn_ref_no: data.Grn_Ref_no
          })
        }
        console.log(updateData);

        // this.service.update(updateData).subscribe({
        //   next: (res: any) => {
        //     if (res.length > 0) {
        //       if (res[0].status == 'N') {
        //         this.Error = res[0].Msg
        //         this.userHeader = 'Error'
        //         return this.opendialog()
        //       } else {
        //         let printContents = document.getElementById('printableDiv')?.innerHTML;
        //         let originalContents = document.body.innerHTML;
        //         if (printContents) {
        //           document.body.innerHTML = printContents;
        //           window.print();
        //         }
        //         this.Error = res[0].Msg
        //         this.userHeader = 'Information'
        //         this.opendialog()
        //         this.dialogRef.afterClosed().subscribe((res: any) => {
        //           if (res) {
        //             document.body.innerHTML = originalContents;
        //             location.reload(); // Optional: reload to restore Angular bindings
        //           }
        //         });
        //       }
        //     }
        //   }
        // })
      } else {
        this.Error = 'Print/Save  Cancelled?'
        this.userHeader = 'Information'
        return this.opendialog()
      }
    })


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
