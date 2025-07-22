import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { data, event } from 'jquery';
import { PurchaseRequestService } from '../service/purchase-request.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from 'primeng/dialog';
import { StoreReqMatlDetComponent } from '../store-req-matl-det/store-req-matl-det.component';
import { MatTableDataSource } from '@angular/material/table';
import { concatMap, forkJoin, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss'],

})
export class PurchaseRequestComponent implements OnInit {

  form!: FormGroup;

  loactionId: number = 0


  constructor(private dialog: MatDialog, private date: DatePipe, private formBuilder: FormBuilder, private service: PurchaseRequestService) { }
  ngOnInit(): void {
    this.loactionId = JSON.parse(sessionStorage.getItem('location') || '{}');
    console.log(this.loactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);

    this.form = this.formBuilder.group({
      indent: new FormControl('0', Validators.required),
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
    this.service.Department(this.loactionId,this.Empid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          const Departmentdata = res
          this.Deptid = Departmentdata[0].deptid
          if (this.Deptid == 15) {
            this.form.controls['']
          }
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
          frm_model: 1,
          IndentType:this.form.controls['indent'].value
        },
      });
      this.StoreReqMatlDetDiaolg.afterClosed().subscribe((result) => {
        if (result) {
          this.dataSource.data = [...this.dataSource.data, ...result];
        }
      });
    }
  }

  // SchdataSource = new MatTableDataSource()
  SelectedRawmtId: number = 0
  SchMatch: boolean = false
  reqQty: number = 0
  SchduleArr: any[] = []
  SchdataSource: { [materialId: number]: any[] } = {};
  // UpdateScduleDatasource = new MatTableDataSource()
  IndentSch(row: any) {
    this.SelectedRawmtId = row.MaterialId
    this.reqQty = row.Qty
    this.StoreReqMatlDetDiaolg = this.dialog.open(StoreReqMatlDetComponent, {
      disableClose: true,
      width: 'auto',
      height: 'auto',
      panelClass: 'custom-dialog',
      autoFocus: false,
      data: {
        Comp_Name: "PurchaseRequestionSch",
        OrdQty: row.Qty,
        Uom: row.Uom,
        isSch: row.isSch,
        Material: row.MaterialName,
        MaterialId: row.MaterialId,
        SchDatSource: this.SchdataSource[row.MaterialId] || [],
        IsEdit: ''
      },
    });
    this.StoreReqMatlDetDiaolg.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.SchdataSource[row.MaterialId] = result;
        // this.UpdateScduleDatasource.data = [...result];
        const item = this.dataSource.data.find((x: any) => x.MaterialId === row.MaterialId);
        if (item) {
          item.isSch = true;
        }
        this.dataSource.data = [...this.dataSource.data];
        const allSchedules = Object.values(this.SchdataSource).flat();
        console.log(allSchedules);
      }
    });
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
  OldPoArr: any[] = new Array()
  async getOldPO() {
    this.SelectedRawmtId = 862
    try {
      const res: any = await new Promise((resolve, reject) => {
        this.service.OldPOView(this.loactionId, this.SelectedRawmtId).subscribe({
          next: resolve,
          error: reject
        });
      });

      if (res.length > 0) {
        if (res[0].staus === 'N') {
          this.Error = res[0].Msg;
          this.userHeader = 'Error';
          return this.opendialog();
        }

        this.OldPoArr = res;

        for (let po of this.OldPoArr) {
          const potot: any = await new Promise((resolve, reject) => {
            this.service.oldPo_Tot(po.poid).subscribe({
              next: resolve,
              error: reject
            });
          });

          if (potot.length > 0 && potot[0].staus === 'N') {
            this.Error = potot[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
            return;
          }

          po.gtotal = potot[0]?.gtotal;
        }

        // Open the dialog only after all async operations finish
        this.StoreReqMatlDetDiaolg = this.dialog.open(StoreReqMatlDetComponent, {
          disableClose: true,
          width: 'auto',
          height: 'auto',
          panelClass: 'custom-dialog',
          autoFocus: false,
          data: {
            Comp_Name: "PurchaseRequestionOldPo",
            OldPOData: this.OldPoArr
          },
        });
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  getSaveVaild() {
    this.Error = 'Do You Want To Save ?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        const allSchedules = Object.values(this.SchdataSource).flat();

        const hasNoRawMaterial = this.dataSource.data.length === 0;
        const hasNoSchedule = allSchedules.length === 0;

        if (hasNoRawMaterial || hasNoSchedule) {
          this.userHeader = 'Information';

          if (hasNoRawMaterial && hasNoSchedule) {
            this.Error = 'No Raw Material and Schedule have been added.';
          } else if (hasNoRawMaterial) {
            this.Error = 'No Raw Material has been added.';
          } else {
            this.Error = 'No Schedule has been added.';
          }

          return this.opendialog();
        }


        const matchedItems: any[] = [];
        const unmatchedItems: any[] = [];

        this.dataSource.data.forEach((res: any) => {
          const match = allSchedules.find((item: any) => item.MaterialId === res.MaterialId);
          if (match) {
            matchedItems.push(res);
          } else {
            unmatchedItems.push(res);
          }
        });
        if (matchedItems.length > 0) {
          if (unmatchedItems.length == 0) {
            this.GetSave()
          } else {
            this.Error = 'Please schedule all the added items'
            this.userHeader = 'Information'
            return this.opendialog()
          }
        }
      } else {
        this.Error = 'Save Cancelled'
        this.userHeader = 'Information'
        return this.opendialog()
      }
    })




  }


  GetSave() {
    this.getStockReqno()
    let SchArr: any[] = []
    let MatlArr: any[] = []
    let SaveArr={}
    const allSchedules = Object.values(this.SchdataSource).flat();
    allSchedules.forEach((Sch: any) => {
      SchArr.push({
        SchDate: Sch.SchDate,
        SchQty: Sch.SchQty,
        RawMatid: Sch.MaterialId
      })
    })
    console.log(SchArr, SchArr);
    this.dataSource.data.forEach((Matl: any) => {
      MatlArr.push({
        Rawmatid: Matl.MaterialId,
        Srqty: Matl.Qty,
        Uom: Matl.Uom,
        Materialspec: Matl.MaterialName,
        Stockqty: Matl.Qty,
        Descripation: Matl.Desc,
        Priority: Matl.Priority,
      })
    })

    SaveArr={
      SrRefNo: this.form.controls['StockReqNo'].value,
      Empid: this.Empid,
      DeptID: this.Deptid,
      sr_newtype: parseInt(this.form.controls['indentype'].value),
      capexno: parseInt(this.form.controls['Capex'].value?this.form.controls['Capex'].value:0),
      capexnumber: this.form.controls['CapexDesc'].value?this.form.controls['CapexDesc'].value:'',
      SRDesc: this.form.controls['SrDesc'].value?this.form.controls['SrDesc'].value:'',
      LocationId: this.loactionId,
      EntryEmpid: this.Empid,
      MatlDetail: MatlArr,
      SchDet: SchArr
    }
    console.log(SaveArr);

    this.service.Save(SaveArr).subscribe({
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
              this.form.controls['indent'].setValue('0')
              this.form.controls['indentype'].setValue('1')
              this.form.controls['FromDate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
              this.form.controls['planmonth'].setValue(this.date.transform(new Date(), 'yyyy/MM'))
              this.form.controls['planmonth'].disable()
              this.form.controls['FromDate'].disable()
              this.dataSource.data=[]
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
