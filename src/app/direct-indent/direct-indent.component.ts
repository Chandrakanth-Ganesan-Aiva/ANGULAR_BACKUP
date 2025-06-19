import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DirectIndentService } from '../service/direct-indent.service';
import { data } from 'jquery';
import { map, Observable, startWith } from 'rxjs'
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StoreReqMatlDetComponent } from '../store-req-matl-det/store-req-matl-det.component';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-direct-indent',
  templateUrl: './direct-indent.component.html',
  styleUrls: ['./direct-indent.component.scss']
})
export class DirectIndentComponent implements OnInit {
  form!: FormGroup;

  loactionId: number = 0
  constructor(private date: DatePipe, private fb: FormBuilder, private service: DirectIndentService, private dialog: MatDialog) {
    this.loactionId = JSON.parse(sessionStorage.getItem('location') || '{}');

    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    console.log(user);

    this.Empid = user.empid;
    this.form = this.fb.group({
      StockReqNo: new FormControl(''),
      FromDate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }),
      costcenter: new FormControl('', Validators.required),
      Category: new FormControl(''),
      dept: new FormControl(''),
      prnewtype: new FormControl('1'),
      Approvedby: new FormControl(''),
      Emp: new FormControl(user.cusername),
      PurDeptResponse: new FormControl('', Validators.required),
      Capex: new FormControl(''),
      desc: new FormControl(''),
      CapexDesc: new FormControl(''),

    })
  }

  ngOnInit() {
    this.getStockReqno()
    this.GetDepartment()
    this.getcostCenter()
    this.getResponsableEmp()
  }
  Empid: number = 0
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    this.service.Stockreno(this.form.controls['FromDate'].value, this.loactionId).subscribe({
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
  DepartmentArr: any[] = []
  GetDepartment() {
    this.service.Department(this.loactionId, this.Empid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.DepartmentArr = res
          this.form.controls['dept'].setValue(res[0].deptid)
          this.form.controls['Category'].setValue(res[0].catid)
          this.getApprovedby()
        }
      }
    })
  }
  costcentreArr: any[] = []
  getcostCenter() {
    this.service.CostCenter().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.costcentreArr = res
          this.form.controls['costcenter'].setValue(res[0].costcentreid)
        }
      }
    })
  }

  ApprovedbyArr: any[] = []
  getApprovedby() {
    this.service.Approvedby(this.loactionId, this.form.controls['dept'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.ApprovedbyArr = res
          this.form.controls['Approvedby'].setValue(res[0].empid)
        }
      }
    })
  }
  PrTypeChangeEvent() {
    if (this.form.controls['prnewtype'].value == 2) {
      this.getCapex()
    } else {
      this.form.controls['desc'].setValue('')
      this.CapexText = ''
      this.capexattach = ''
    }
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
  CapexText: any = 'null'
  capexattach: any = 'null'
  CapexChangeEvent() {
    if (this.form.controls['Capex'].value) {
      this.CapexArr.filter((item: any) => {
        if (this.form.controls['Capex'].value == item.capexno) {
          this.form.controls['desc'].setValue(item.description)
          this.CapexText = item.capexattach
          this.capexattach = item.capexattach
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
  ResponsableEmpArr: any[] = []
  getResponsableEmp() {
    this.service.ResponsableEmp().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.ResponsableEmpArr = res
        }
      }
    })
  }
  StoreReqMatlDetDiaolg!: MatDialogRef<StoreReqMatlDetComponent>;
  dataSource: any = new MatTableDataSource()
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
          deptId: this.form.controls['dept'].value,
          frm_model: 2,
          IndentType: 0
        },
      });
      this.StoreReqMatlDetDiaolg.afterClosed().subscribe((result) => {
        if (result) {
          this.dataSource.data = [...this.dataSource.data, ...result];
        }
      });
    }
  }
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
    // this.SelectedRawmtId = 862
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
    let SaveArr = {}
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
        Prqty: parseInt(Matl.Qty),
        Uom: Matl.Uom,
        Materialspec: Matl.MaterialName,
        MaterialDesc: Matl.MaterialName,
        DescRemark: Matl.Desc,
        Priority: Matl.Priority,
        capexno: parseInt(this.form.controls['Capex'].value ? this.form.controls['Capex'].value : 0),
        capexnumber: this.CapexText,
        capexattach: this.capexattach
      })
    })

    SaveArr = {
      pr_ref_no: this.form.controls['StockReqNo'].value,
      DeptID: this.form.controls['dept'].value,
      capexattach: parseInt(this.form.controls['Capex'].value ? this.form.controls['Capex'].value : 0),
      costcenter: parseInt(this.form.controls['costcenter'].value),
      pr_newtype: parseInt(this.form.controls['prnewtype'].value),
      PRDesc: this.form.controls['desc'].value ? this.form.controls['desc'].value : '',
      ApprovedBy: this.form.controls['Approvedby'].value,
      LocationId: this.loactionId,
      Empid: this.Empid,
      PurResponsable: this.form.controls['PurDeptResponse'].value,
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
              this.GetDepartment()
              this.getcostCenter()
              this.getResponsableEmp()
              this.form.controls['indent'].setValue('0')
              this.form.controls['prnewtype'].setValue('1')
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


