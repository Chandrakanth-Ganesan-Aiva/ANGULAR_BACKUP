import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReworkissueService } from '../service/reworkissue.service';;
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { data } from 'jquery';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-reworkissue',
  templateUrl: './reworkissue.component.html',
  styleUrls: ['./reworkissue.component.scss']
})
export class ReworkissueComponent implements OnInit {
  form!: FormGroup;
  LoactionId: number = 0
  Empid: number = 0

  constructor(private date: DatePipe, private formBuilder: FormBuilder, private dialog: MatDialog, private service: ReworkissueService) {
    this.form = this.formBuilder.group({
      IssueNo: new FormControl('', Validators.required),
      Issuedate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, Validators.required),
      // frmdate: new FormControl(this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
      frmdate: new FormControl('2024-05-01', Validators.required),
      todate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, Validators.required),
      Department: new FormControl('', Validators.required),
      Refno: new FormControl('', Validators.required),
      material: new FormControl('', Validators.required),
      Warehouse: new FormControl('', Validators.required),
    })
  }


  ngOnInit() {
    this.LoactionId = JSON.parse(sessionStorage.getItem('location') || '{}');
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.getStockReqno()
  }
  masterid: number = 459
  StockReq: any[] = new Array();
  getStockReqno() {
    let Issuedate = this.form.controls['Issuedate'].value
    this.service.Stockreno(this.masterid, Issuedate, this.LoactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.StockReq = res
          this.form.controls['IssueNo'].setValue(res[0].translno)
        }
      }
    })
  }
  Frmdatevent(e: any) {
    if (this.form.controls['frmdate'].value) {
      this.form.controls['frmdate'].setValue(this.date.transform(e.target.value, 'yyyy-MM-dd'))
      this.form.controls['Department'].setValue('')
      this.form.controls['Refno'].setValue('')
      this.form.controls['Warehouse'].setValue('')
      this.form.controls['material'].setValue('')
      this.GetDepartment()
      console.log(this.form.controls['frmdate'].value);

    }

  }
  DepatmentArr: any[] = new Array()
  GetDepartment() {
    let fromdt = this.form.controls['frmdate'].value
    let todate = this.form.controls['todate'].value
    this.service.Dept(this.LoactionId, fromdt, todate).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.DepatmentArr = data
        }
      }
    })
  }
  DeptEvent() {
    if (this.form.controls['Department'].value) {
      this.form.controls['Department'].value
      this.GetRefno()
      this.form.controls['Refno'].setValue('')
      this.form.controls['Warehouse'].setValue('')
      this.form.controls['material'].setValue('')
    }
  }
  RefnoDataArr: any[] = new Array()
  GetRefno() {
    let fromdt = this.form.controls['frmdate'].value
    let todate = this.form.controls['todate'].value
    let deptid = this.form.controls['Department'].value
    this.service.RefNo(this.LoactionId, deptid, fromdt, todate).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.RefnoDataArr = data
        }
      }
    })
  }
  WarehouseArr: any[] = []
  SelectedtRefNoPath: string = ''
  RefnoEvent() {
    if (this.form.controls['Refno'].value) {
      this.RefnoDataArr.filter((res: any) => {
        if (res.SrNo == this.form.controls['Refno'].value) {
          this.SelectedtRefNoPath = res.Sr_Ref_No
        }
      })
      this.service.Warehouse(this.LoactionId).subscribe({
        next: (data: any) => {
          if (data.length > 0) {
            if (data[0].status == 'N') {
              this.Error = data[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            this.WarehouseArr = data
            this.form.controls['Warehouse'].setValue(data[0].Location_ID)
          }
        }
      })
      this.GetMaterial()
      this.form.controls['material'].setValue('')
    }
  }
  Rawmateriladata: any[] = new Array()
  GetMaterial() {
    let deptid = this.form.controls['Department'].value
    this.service.Material(this.LoactionId, deptid, this.SelectedtRefNoPath).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.Rawmateriladata = data
        } else {
          this.Error = 'No Records To Found for this Refno'
          this.userHeader = 'Information'
          return this.opendialog()
        }
      }
    })
  }
  capexattach:string=''
  dataSource = new MatTableDataSource()
  MaterialRealase: any[] = []
  Add() {
    let RefNo = this.form.controls['Refno'].value
    let RawMatId = this.form.controls['material'].value
    let deptid = this.form.controls['Department'].value
    if (this.form.invalid) return this.form.markAllAsTouched()
    this.service.Add(this.LoactionId, deptid, RefNo, RawMatId).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.MaterialRealase = data;
          this.MaterialRealase = this.MaterialRealase.map((element: any) => ({
            ...element,
            issueQty: '',
            isReleaseVaild: 'N'
          }))
          let isDuplicate: boolean = this.dataSource.data.some((item: any) => item.RawMatID === this.form.controls['material'].value)
          if (isDuplicate) {
            this.Error = 'You cannot select same Material'
            this.userHeader = 'Information'
            return this.opendialog()
          } else {

            this.dataSource.data = [...this.dataSource.data, ... this.MaterialRealase]
          }
        } else {
          this.Error = 'No Records To Found'
          this.userHeader = 'Information'
          return this.opendialog()
        }
      }
    })
  }
  Clear() {
    this.form.enable()
    this.form.reset()
    this.form.markAsUntouched()
    this.form.controls['Issuedate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.form.controls['frmdate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.form.controls['todate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.getStockReqno()
    this.form.controls['Issuedate'].disable()
    this.form.controls['todate'].disable()
    this.dataSource.data = []
  }
  releaseDisabled: boolean[] = [];
  Materialdata: any
  onReleaseValidation(row: any, index: any) {
    this.form.disable()
    this.Materialdata = row
    const { srqty, minqty, issueQty, stock, min_level } = row
    if (Number(issueQty == 0) || issueQty == '') {
      this.Error = 'Issue qty should be Greater Than Zero'
      this.userHeader = 'Information'
      return this.opendialog()
    }
    if ((Number(srqty - minqty)) < Number(issueQty)) {
      row.issueQty = 0
      this.Error = 'You cannot issue more than Requested qty'
      this.userHeader = 'Information'
      return this.opendialog()
    }
    if (Number(stock) < Number(issueQty)) {
      row.issueQty = 0
      this.Error = 'You cannot issue more than Stock'
      this.userHeader = 'Information'
      return this.opendialog()
    }
    if (Number(min_level) < Number(issueQty)) {
      this.Error = 'Shall I Issue More than Minimum Level Qty'
      this.userHeader = 'Warning!!!'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.Release()
        } else {
          row.issueQty = 0
        }
      })
    }
  }
  TabIndex = 0
  TabChageEvent(e: MatTabChangeEvent) {
    this.TabIndex = e.index

  }
  issuDetarr: any[] = []
  IssueDataSource = new MatTableDataSource()
  Release() {
    let Warehouse = this.form.controls['Warehouse'].value
    let RawMatId = this.form.controls['material'].value
    const { issueQty, SRId, RawMatID, SrNo, SRDate, Sr_Ref_No, gStrMatDisp, SRUom, srqty, deptname, DeptID, isReleaseVaild } = this.Materialdata
    let dblqty: number = issueQty
    if (parseInt(issueQty) > 0) {
      this.TabIndex = 1
      let issueTableArray: any[] = []
      this.service.IssueDet(RawMatId, this.LoactionId, Warehouse).subscribe({
        next: (data: any) => {
          if (data.length > 0) {
            if (data[0].status == 'N') {
              this.Error = data[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            this.issuDetarr = data;
            console.log(this.issuDetarr);

            this.issuDetarr = this.issuDetarr.map((element: any) => ({
              ...element,
              IssueQty: '',
            }))
            if (Warehouse != 32) {
              this.issuDetarr.forEach((issuetable: any) => {
                console.log(dblqty, issuetable.Stock);
                if (dblqty > 0) {
                  if (dblqty <= issuetable.Stock) {
                    console.log(1);
                    issueTableArray.push({
                      Srid: SRId,
                      Rawmatid: RawMatID,
                      SRNo: SrNo,
                      Ref_no: Sr_Ref_No,
                      Date: SRDate,
                      Rawmaterial: gStrMatDisp,
                      UOM: SRUom,
                      SRQty: srqty,
                      GRNQTY: issuetable.Stock,
                      IssueQty: dblqty,
                      GRNID: issuetable.GRNID,
                      GRNNO: issuetable.GrnNo,
                      GRNREFNO: issuetable.Grn_Ref_no,
                      STOREID: issuetable.StoreEntryId,
                      Deptid: DeptID,
                      DeptName: deptname,
                      isReleaseVaild: 'Y'
                    })
                    dblqty = 0
                  } else {
                    let UpdatedIssueQty: number
                    if (issuetable.Stock < dblqty) {
                      UpdatedIssueQty = issuetable.Stock
                      dblqty = dblqty - issuetable.Stock
                    } else {
                      UpdatedIssueQty = dblqty
                    }
                    issueTableArray.push({
                      Srid: SRId,
                      Rawmatid: RawMatID,
                      SRNo: SrNo,
                      Ref_no: Sr_Ref_No,
                      Date: SRDate,
                      Rawmaterial: gStrMatDisp,
                      UOM: SRUom,
                      SRQty: srqty,
                      GRNQTY: issuetable.Stock,
                      IssueQty: UpdatedIssueQty,
                      GRNID: issuetable.GRNID,
                      GRNNO: issuetable.GrnNo,
                      GRNREFNO: issuetable.Grn_Ref_no,
                      STOREID: issuetable.StoreEntryId,
                      Deptid: DeptID,
                      DeptName: deptname,
                      isReleaseVaild: 'Y'
                    })
                  }
                }
              })
              this.IssueDataSource.data = [...issueTableArray]
              this.IssueDataSource.data = [...this.IssueDataSource.data]
              console.log(this.IssueDataSource.data);
            }
            if (Warehouse == 32) {
              this.issuDetarr.forEach((issuetable: any) => {
                if (issuetable.Stock > 0) {
                  issueTableArray.push({
                    Srid: SRId,
                    Rawmatid: RawMatID,
                    SRNo: SrNo,
                    Ref_no: Sr_Ref_No,
                    Date: SRDate,
                    Rawmaterial: gStrMatDisp,
                    UOM: SRUom,
                    SRQty: srqty,
                    GRNQTY: issuetable.Stock,
                    IssueQty: dblqty,
                    GRNID: issuetable.GRNID,
                    GRNNO: issuetable.GrnNo,
                    GRNREFNO: issuetable.Grn_Ref_no,
                    STOREID: issuetable.StoreEntryId,
                    Deptid: DeptID,
                    DeptName: deptname,
                    isReleaseVaild: 'Y'
                  })
                  dblqty = 0
                }
              })
              this.IssueDataSource.data = [...issueTableArray]
              this.IssueDataSource.data = [...this.IssueDataSource.data]
            }
          }
        }
      })
    }
    this.Rawmateriladata = this.Rawmateriladata.filter((res: any) => res.RawMatID !== this.form.controls['material'].value)
  }
  saveVaild() {
    if (this.IssueDataSource.data.length > 0) {
      const isVaild = this.IssueDataSource.data.some((item: any) => item.isReleaseVaild == 'Y')
      if (isVaild) {
        this.Error = 'Do You Want To Save?'
        this.userHeader = 'Save'
        this.opendialog()
        this.dialogRef.afterClosed().subscribe((res: boolean) => {
          if (res) {
            this.Save()
          } else {
            this.Error = 'Before Save..Release All The Records'
            this.userHeader = 'Information'
            return this.opendialog()
          }
        })
      } else {
        this.Error = 'Before Save..Release All The Records'
        this.userHeader = 'Information'
        return this.opendialog()
      }
    } else {
      this.Error = 'Before Save Add Atleast One Material For Rework Issue'
      this.userHeader = 'Information'
      return this.opendialog()
    }
  }
  Deletemat(index: any) {

  }
  Save() {
 this.getStockReqno()
    let MatlArr: any[] = []
    let SaveArr = {}

    this.IssueDataSource.data.forEach((Matl: any) => {
      MatlArr.push({
        Rawmatid: Matl.Rawmatid,
        Qty: Matl.GRNQTY,
        Uom: Matl.UOM,
        GrnNo: Matl.GRNNO,
        EmpId: this.Empid,
        GrnId: Matl.GRNID,
        Min_Ref_No: this.form.controls['IssueNo'].value,
        SrId: Matl.Srid,
        StoreEntryId:Matl.STOREID,
        WarehouseId:this.form.controls['Warehouse'].value,
        LocationId:this.LoactionId,
      })
    })
    SaveArr = {
      min_ref_no: this.form.controls['IssueNo'].value,
      DeptID: this.form.controls['Department'].value,
      LocationId: this.LoactionId,
      Empid: this.Empid,
      MatlDetail:MatlArr
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
              this.form.enable()
              // this.GetDepartment()
              this.form.controls['frmdate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
              this.form.controls['todate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
              this.form.controls['todate'].disable()
              this.dataSource.data = []
               this.IssueDataSource.data = []
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
