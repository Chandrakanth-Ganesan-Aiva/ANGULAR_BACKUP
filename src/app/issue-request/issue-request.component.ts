import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IssueRequestService } from '../service/issue-request.service';
import { data, event } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StoreReqMatlDetComponent } from '../store-req-matl-det/store-req-matl-det.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-issue-request',
  templateUrl: './issue-request.component.html',
  styleUrls: ['./issue-request.component.scss']
})
export class IssueRequestComponent implements OnInit {

  form!: FormGroup;

  loactionId: number = 0

  constructor(private date: DatePipe, private formBuilder: FormBuilder, private service: IssueRequestService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.loactionId = JSON.parse(sessionStorage.getItem('location') || '{}');
    console.log(this.loactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);

    this.form = this.formBuilder.group({
      indent: new FormControl('1', Validators.required),
      indentype: new FormControl('1'),
      Capex: new FormControl(''),
      SrDesc: new FormControl(''),
      StockReqNo: new FormControl(''),
      FromDate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }),
      planmonth: new FormControl({ value: this.date.transform(new Date(), 'yyyy/MM'), disabled: true }),
      desc: new FormControl(''),
      CapexDesc: new FormControl(''),
    })

    this.getStockReqno()
    this.GetDepartment()
    this.getCapex()
  }
  Empid: number = 0
  Deptid: number = 0
  masterid: number = 3929
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    this.service.Stockreno(this.masterid, this.form.controls['FromDate'].value, this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.StockReq = res
          this.form.controls['StockReqNo'].setValue(this.StockReq[0].translno)
        }
      }
    })
  }

  GetDepartment() {
    this.service.Department(this.loactionId, this.Empid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          const Departmentdata = res
          this.Deptid = Departmentdata[0].deptid
        }
      }
    })
  }

  CapexArr: any[] = new Array()
  getCapex() {
    this.service.Capex(this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.CapexArr = res
        }
      }
    })
  }
  ProjName: string = ''
  AttachmentText: any
  AttachmentPath: any
  CapexChangeEvent() {
    if (this.form.controls['Capex'].value) {
      this.CapexArr.filter((item: any) => {
        if (this.form.controls['Capex'].value == item.capexno) {
          this.form.controls['CapexDesc'].setValue(item.description)
          this.AttachmentText = item.capexattach
          this.AttachmentPath = item.capexattach
        }
      })
    }
  }
  selectedFile: File | null = null;
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  AddAttachment(): void {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
  }
  // StoreReqMatlDetDiaolg!: MatDialogRef<StoreReqMatlDetComponent>
  StoreReqMatlDetDiaolg!: MatDialogRef<StoreReqMatlDetComponent>;
  dataSource = new MatTableDataSource<any>()
  Go() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
    } else {
      this.StoreReqMatlDetDiaolg = this.dialog.open(StoreReqMatlDetComponent, {
        disableClose: true,
        width: '90vw',
        height: 'auto',
        maxHeight: '90vh',
        panelClass: 'custom-dialog',
        autoFocus: false,
        data: {
          Comp_Name: "PurchaseRequestionMatl",
          deptId: this.Deptid,
          // deptId: 12,
          frm_model: 9,
          IndentType: this.form.controls['indent'].value
        },
      });
      this.StoreReqMatlDetDiaolg.afterClosed().subscribe((result) => {
        if (result) {
          this.dataSource.data = [...this.dataSource.data, ...result];
        }
      });
    }
  }
  Delete(row: any, index: number) {
    this.Error = 'Do You Want To delete ?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result) {
        this.Error = 'Delete Cancelled'
        this.userHeader = 'Inforamtion'
        this.opendialog()
      } else {
        this.dataSource.data.splice(index, 1)
        this.dataSource.data = [...this.dataSource.data]
      }
    })
  }
  getSaveVaild() {
    if (this.dataSource.data.length > 0) {
      this.Error = 'Do You Want To Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((res: boolean) => {
        console.log(res);
        if (res) {
          
          this.Save()

        } else {
          this.Error = 'Save Cancelled'
          this.userHeader = 'Information'
          return this.opendialog()
        }
      })
    } else {
      this.Error = 'Please Add atleast One Issue Material to Save'
      this.userHeader = 'Information'
      return this.opendialog()
    }
  }
  Save() {
    this.getStockReqno()
    let MatlArr: any[] = []
    let SaveArr = {}
    this.dataSource.data.forEach((Matl: any) => {
      MatlArr.push({
        Rawmatid: Matl.MaterialId,
        Srqty: Matl.Qty,
        Uom: Matl.Uom,
        Materialspec: Matl.MaterialName,
        Stockqty: Matl.Qty,
        MachId: Matl.Machid?Matl.Machid:0,
        MachType: Matl.Machtype,
      })
    })
    
    SaveArr = {
      SrRefNo: this.form.controls['StockReqNo'].value,
      Empid: this.Empid,
      DeptID: this.Deptid,
      sr_newtype: parseInt(this.form.controls['indentype'].value),
      capexno: parseInt(this.form.controls['Capex'].value ? this.form.controls['Capex'].value : 0),
      capexnumber: this.form.controls['CapexDesc'].value ? this.form.controls['CapexDesc'].value : null,
      SRDesc: this.form.controls['SrDesc'].value ? this.form.controls['SrDesc'].value : '',
      LocationId: this.loactionId,
      EntryEmpid: this.Empid,
      MatlDetail: MatlArr,
    }
    console.log(SaveArr);
    this.service.save(SaveArr).subscribe({
      next: (data: any) => {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          return this.opendialog()
        } else {
          this.Error = data[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
              this.getStockReqno()
              this.form.controls['indent'].setValue('1')
              this.form.controls['indentype'].setValue('1')
              this.form.controls['FromDate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
              this.form.controls['planmonth'].setValue(this.date.transform(new Date(), 'yyyy/MM'))
              this.form.controls['planmonth'].disable()
              this.form.controls['FromDate'].disable()
              this.dataSource.data = []
            }
          })
        }
      }
    })
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
