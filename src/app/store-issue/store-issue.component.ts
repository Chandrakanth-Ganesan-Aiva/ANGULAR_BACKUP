import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreIssueService } from '../service/store-issue.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, map, of, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-store-issue',
  templateUrl: './store-issue.component.html',
  styleUrls: ['./store-issue.component.scss']
})
export class StoreIssueComponent implements OnInit, OnDestroy {
  currentDate = new Date()
  currentDate1 = new Date()
  currentDate2 = new Date()
  Issuedate: any
  // fromdt: any
  Todate: any
  form!: FormGroup;
  LoactionId: number = 0
  Empid: number = 0

  constructor(private date: DatePipe, private toastr: ToastrService, private formBuilder: FormBuilder, private service: StoreIssueService, private dialog: MatDialog) {
    this.form = this.formBuilder.group({
      IssueNo: new FormControl('', Validators.required),
      Issuedate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, Validators.required),
      frmdate: new FormControl('', Validators.required),
      todate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, Validators.required),
      Department: new FormControl('', Validators.required),
      Refno: new FormControl('', Validators.required),
      material: new FormControl('', Validators.required),
      Warehouse: new FormControl('', Validators.required),
    })
    this.Issuedate = this.form.controls['Issuedate'].value
    this.Todate = this.form.controls['todate'].value
  }

  filterControl = new FormControl('')
  RefNofilterControl = new FormControl('')
  ngOnInit() {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid

    // let ModeuleId = 166
    // this.service.StoreissueloginDet(ModeuleId, this.LoactionId, this.Empid).subscribe({
    //   next: (res: any) => {
    //     if (res.length > 0) {
    //       if (res[0].status == 'N') {
    //         this.Error = res[0].Msg
    //         this.userHeader = 'Error'
    //         return this.opendialog()
    //       }
    //       this.Error = 'Already Logged in By <strong style="color:brown"> ' + res[0].empname + ' </strong> in <strong style="color:brown"> ' + res[0].loginsystem + ' </strong>'
    //       this.userHeader = 'Information'
    //       this.opendialog()
    //       this.dialogRef.afterClosed().subscribe((res: any) => {
    //         if (res) {
    //           this.router.navigate(['/Dashboard']);
    //         }
    //       })
    //     }else{
    //       this.lockScreen()
    //     }

    //   }
    // })

    this.getStockReqno()
    this.Disablebackbutton()
    this.filterControl.valueChanges.pipe(map((search) =>
      this.Depatment.filter((option: any) =>
        option.Deptname.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.DepatmentArr = filtered));
    this.RefNofilterControl.valueChanges.pipe(map((serarch) =>
      this.RefnoData.filter((option: any) =>
        option.Sr_Ref_No.toLowerCase().includes(serarch?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => this.RefnoDataArr = filtered)
  }

  lockScreen() {
    let ModeuleId = 166
    let logoutStoreissue = {}
    logoutStoreissue = {
      modid: ModeuleId,
      locid: this.LoactionId,
      loginid: this.Empid
    }
    this.service.InsertScrrenlock(logoutStoreissue).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
        }
      }
    })
  }

  Disablebackbutton() {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
    }

  }
  apiErrorMsg: string = ''
  masterid: number = 459
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    this.service.Stockreno(this.masterid, this.Issuedate, this.LoactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.StockReq = res
          console.log(this.StockReq, 'StockReqNo');
          if (this.StockReq.length != 0) {
            this.StockReqNo = this.StockReq[0].translno
            this.form.controls['IssueNo'].setValue(this.StockReqNo)
          }
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
      this.MaterilaDetalis = []

      this.GetDepartment()
    }

  }

  Depatment: any[] = new Array()
  DepatmentArr: any[] = new Array()
  GetDepartment() {
    let fromdt = this.form.controls['frmdate'].value
    this.service.Department(this.LoactionId, this.Issuedate, fromdt, this.Todate).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.Depatment = data
          this.DepatmentArr = data
        } else {
          this.toastr.warning('No Records Found')
        }
      }
    })

  }
  Deptid: number = 0
  DeptEvent() {
    if (this.form.controls['Department'].value) {
      this.Deptid = this.form.controls['Department'].value
      this.GetRefno()
      this.form.controls['Refno'].setValue('')
      this.form.controls['Warehouse'].setValue('')
      this.form.controls['material'].setValue('')
      this.MaterilaDetalis = []

    }
  }


  RefnoData: any[] = new Array()
  RefnoDataArr: any[] = new Array()
  GetRefno() {
    let fromdt = this.form.controls['frmdate'].value
    this.service.Refno(this.LoactionId, this.Issuedate, fromdt, this.Todate, this.Deptid).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.RefnoData = data
          this.RefnoDataArr = data
        }
      }
    })
  }
  RefSrno: string = ''
  srno: number = 0
  RawMatIDChckwarehouse: any
  RefnoEvent() {
    let srno = this.form.controls['Refno'].value
    console.log(srno, 'asdasd', this.form.controls['Refno'].value);

    const ref = this.RefnoData.filter((data: any) => {
      if (srno == data.SrNo) {
        this.RefSrno = data.Sr_Ref_No
      }
    })
    if (srno) {
      this.service.warehousechck(this.RefSrno).subscribe((data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          const hasOtherRawMat = data.some(
            (item: { RawMatID: number; }) => item.RawMatID !== 261709 && item.RawMatID !== 261590
          );
          this.GetWarehouse();

          if (hasOtherRawMat) {
            this.RawMatIDChckwarehouse = true;
            this.warehouseInputbox = 'Incoming Store - U1';
            this.form.controls['Warehouse'].setValue(26);
            this.GetMaterial();
          } else {
            this.RawMatIDChckwarehouse = false;
          }
        }
      })
    }
    this.form.controls['Warehouse'].setValue('')
    this.form.controls['material'].setValue('')
    this.MaterilaDetalis = []

    this.viewbtn = false
  }
  warehousedata: any[] = new Array()

  GetWarehouse() {
    this.service.Warehouse(this.LoactionId).subscribe((data: any) => {
      if (data.length > 0) {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          return this.opendialog()
        }
        this.warehousedata = data
      } else {
        this.Error = 'No GenRefNo Found'
        this.userHeader = 'Infromation'
        return this.opendialog()
      }
    })
  }
  warehouseInputbox: string = ''
  // warehouseno: number = 0
  WarehouseEvent() {
    if (this.form.controls['Warehouse'].value) {
      this.GetMaterial()
      // this.form.controls['material'].setValue('')
      this.MaterilaDetalis = []

    }

  }
  Rawmateriladata: any[] = new Array()
  GetMaterial() {
    let fromdt = this.form.controls['frmdate'].value
    this.service.Rawmaterial(this.LoactionId, this.Deptid, fromdt, this.Todate, this.RefSrno).subscribe({
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
          this.userHeader = 'Infroamtion'
          return this.opendialog()
        }
      }
    })
  }

  Rawmatid: any = 0
  issueQtyvalue: any
  Issuevalue: number = 0
  issueQty(event: any) {
    //debugger
    this.issueQtyvalue = parseInt(event.target.value)
    this.Issuevalue = parseInt(event.target.value)

  }
  Releasebtndisable = [false, false]
  Isuuechck() {
    this.Issuevalue = 0
  }
  dataSource = new MatTableDataSource<any>()
  viewbtn: any
  MaterialRealase: any[] = new Array()
  cmpname: string = 'SFPL'
  deptname: string = ''
  Viewmat: boolean = false
  RawmaterialInd: any
  MaterilaDetalis: any[] = new Array()
  IndentDetalisData: any[] = new Array()
  StockAvl: number = 0
  StockMinimumcheck: any
  matlcolor: any
  NostockMaterial: any[] = new Array()
  stockInfo: any
  Add() {
    if (this.form.invalid) {
      return this.form.markAllAsTouched()
    } else {
      this.Rawmatid = this.form.controls['material'].value
      let fromdt = this.form.controls['frmdate'].value
      let warehouse = this.form.controls['Warehouse'].value
      let srno = this.form.controls['Refno'].value
      this.service.StockCheckMain(this.Rawmatid, this.LoactionId).pipe(
        switchMap((data: any) => {
          if (!data || data.length === 0) {
            this.Error = 'No stock check data available';
            this.userHeader = 'Information';
            this.opendialog();
            return EMPTY; // Stop the chain
          }
          this.stockInfo = data[0];
          if (this.stockInfo.status === 'N') {
            this.Error = this.stockInfo.Msg;
            this.userHeader = 'Error';
            this.opendialog();
            return EMPTY; // Stop the chain
          }
          if (this.stockInfo.stock == 0) {
            this.Error = 'Stock is not available for this material';
            this.userHeader = 'Information';
            this.opendialog();
            return EMPTY; // Stop the chain
          }
          // If all checks passed, proceed to second API call
          return this.service.IssueMaterialViewbtn(
            this.LoactionId, this.Issuedate, warehouse, this.Deptid, srno, this.Rawmatid, fromdt, this.Todate)
        }),
      ).subscribe((issueData: any) => {
        if (!issueData || issueData.length === 0) {
          this.Error = 'No Records Avialable For the Selected Item';
          this.userHeader = 'Information';
          this.opendialog();
          return EMPTY; // Stop the chain
        }
        if (issueData[0].status === 'N') {
          this.Error = issueData[0].Msg;
          this.userHeader = 'Error';
          return this.opendialog();
        }
        this.form.disable()
        this.form.controls['material'].enable()
        this.MaterialRealase = issueData;
        this.MaterialRealase = this.MaterialRealase.map((element: any) => ({
          ...element,
          stock: this.stockInfo.stock,
          PendingQty: element.srqty - element.minqty,
          issueQty: ''
        }))
        const isDuplicate = this.dataSource.data
          .find(row => row.RawMatID === this.Rawmatid)
        if (isDuplicate) {
          this.Error = `Material <strong style="color:brown"> ${isDuplicate.gStrMatDisp} </strong> is already added.`;
          this.userHeader = 'Information';
          this.opendialog();
        } else {
          this.Rawmateriladata = this.Rawmateriladata.filter((item: any) => item.RawMatID !== parseInt(this.form.controls['material'].value))
          console.log(this.Rawmateriladata);

          this.dataSource.data = [...this.dataSource.data, ...this.MaterialRealase];
        }
      });
    }

  }
  Clear() {
    this.form.reset()
    this.form.controls['Issuedate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.form.controls['frmdate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.form.controls['todate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.dataSource.data = []
  }
  Tab1 = 0;
  tablabelname: string = '';
  tabChangedRegular(e: MatTabChangeEvent) {
    this.Tab1 = e.index;
    this.tablabelname = e.tab.textLabel
  }

  issuedetalisIndex: number = 0

  onReleaseValidation(row: any, Index: number) {
    this.issuedetalisIndex = Index
    const detail = this.dataSource.data.find(
      d => d.RawMatID === row.RawMatID
    );
    if (!detail) {
      this.Error = 'Cannot find material details';
      this.userHeader = 'Information';
      return this.opendialog();
    }

    // now you can destructure safely
    const { issueQty, PendingQty, stock, min_level } = row;
    console.error(issueQty, PendingQty, stock, min_level);

    if (issueQty <= 0 || issueQty == '') {
      return this.showInfo('Issue Qty should be greater than zero.');
    }
    if (issueQty > PendingQty) {
      return this.showInfo('You cannot issue more than requested quantity.');
    }

    if (issueQty > stock) {
      return this.showInfo('You cannot issue more than available stock.');
    }
    if (stock < min_level) {
      this.Error = 'Stock Is Lesser Than Than The Minimum Quantity...'
      this.userHeader = 'Information'
      this.opendialog()
    }
    if (issueQty > min_level) {
      this.Error = 'Shall I Issue More than Minimum Level Qty...'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: any) => {
        if (result == false) {
          row.issueQty = 0
          return
        }
      })
    }

    this.Release();
    this.ReleaseAllMaterial = [];
    this.releaseDisabled[Index] = true;
  }
  releaseDisabled: boolean[] = [];
  private showInfo(message: string): void {
    this.Error = message;
    this.userHeader = 'Information';
    this.opendialog();
  }
  IssuetableArr: any[] = new Array()
  ExpiryDate: any
  Issuedetalisarr: any[] = new Array()
  Sr_Ref_No: string = ''
  ind: any
  batchqty: number = 0
  BatchData: any[] = new Array()
  balqty: number = 0
  Batcharr: any[] = new Array()
  ExpiryDateVailadCheck: any
  GrnQty: number = 0
  IssueDettable: boolean = true
  issueDetDatasource = new MatTableDataSource<any>()
  batchWiseDataSource = new MatTableDataSource<any>()
  batchWiseArr: any[] = new Array()
  Release() {
    this.dataSource.data.forEach((Material: any): any => {
      if (Material.issueQty > 0) {
        let dblQty = Material.issueQty
        this.service.IssueDetTable(this.form.controls['Warehouse'].value, this.Rawmatid, this.LoactionId).subscribe({
          next: (data: any) => {
            if (data.length > 0) {
              if (data[0].status == 'N') {
                this.Error = data[0].Msg
                this.userHeader = 'Error'
                return this.opendialog()
              }
              this.IssuetableArr = data
              if (this.form.controls['Warehouse'].value != 32) {
                this.IssuetableArr.forEach((IssueTable: any) => {
                  if (IssueTable.stocknew > 0) {
                    if (dblQty <= IssueTable.stocknew) {
                      this.issueDetDatasource.data = [...this.dataSource.data]
                      this.issueDetDatasource.data = this.issueDetDatasource.data.map((element: any) => ({
                        ...element,
                        stocknew: element.stocknew,
                        grnid: element.grnid,
                        grnno: element.grnno,
                        grn_ref_no: element.grn_ref_no,
                        storeentryid: element.storeentryid
                      }))
                      this.service.BatchWiseTable(IssueTable.grnid).subscribe({
                        next: (batch: any) => {
                          if (batch.length > 0) {
                            if (batch[0].status == 'N') {
                              this.Error = batch[0].Msg
                              this.userHeader = 'Error'
                              return this.opendialog()
                            }
                            this.batchWiseArr = batch
                            this.batchWiseArr=this.batchWiseArr.map((element:any)=>({
                              ...element,
                              Issue_Qty:''
                            }))
                            let tcount = 0
                            this.batchWiseArr.forEach((batchTabel: any) => {
                              if (batchTabel.balqty > 0) {
                                let CurrDt :any=this.date.transform(new Date(), 'yyyy-MM-dd')
                                this.batchWiseDataSource.data=[...this.batchWiseArr]
                                if(batchTabel.batchdate < CurrDt){
                                  // Style Color Red
                                  for(let i=0;i< this.batchWiseDataSource.data.length;i++){
                                    tcount = tcount + 1
                                  }
                                }
                                if(dblQty < batchTabel.balqty){
                                  batchTabel.Issue_Qty=dblQty
                                  dblQty=0
                                }else{
                                  dblQty=(Number(dblQty)-Number(batchTabel.balqty)).toFixed(3)
                                  batchTabel.Issue_Qty=batchTabel.balqty
                                }
                              }
                            })
                            if(tcount >0){
                              this.Error='Already Expired this material. Please get the revalidation certificate otherwise you cannot issue'
                              this.userHeader='Information'
                              return this.opendialog()
                            }
                            tcount = 0
                            dblQty = 0
                          }
                        },
                      })
                    }
                    console.log(this.issueDetDatasource.data);
                    this.IssueDettable = false
                  }
                })
              }
            }else {
              this.Error = 'No records Found For this <strong style=color:"brown"> ' + this.Rawmatid + ' <strong> '
              this.userHeader = 'Information'
              return this.opendialog()
            }
          },
        })
      }
    })
    // this.service.Batch(parseInt(this.Batchwise[i].GRNID)).subscribe({
    //   next: (data: any) => {
    //       this.BatchData = data
    //   }
    // })


  }
  ExpirydateRawmatid: number = 0
  RemoveExpiryDateMatl() {
    this.MaterilaDetalis.splice(this.issuedetalisIndex, 1);
    for (let i = 0; i < this.Issuedetalisarr.length; i++) {
      if (this.Issuedetalisarr[i].MaterialID === this.ExpirydateRawmatid) {
        this.Issuedetalisarr.splice(i, 1);
      }
    }
    for (let i = 0; i < this.Batcharr.length; i++) {
      if (this.Batcharr[i].MaterialID === this.ExpirydateRawmatid) {
        this.Batcharr.splice(i, 1);

      }
    }
    this.Releasebtndisable[this.issuedetalisIndex] = false
    this.Issueqtymodaldisable[this.issuedetalisIndex] = false
    this.form.controls['material'].enable()
    if (this.Rawmateriladata.length === this.ReleaseAllMaterial.length) {
      this.savebtn = true
    } else {
      this.savebtn = false
    }
  }
  BatchEmptyClear() {
    this.Tab1 = 0
    this.MaterilaDetalis.splice(this.issuedetalisIndex, 1);
    this.Releasebtndisable[this.issuedetalisIndex] = false
    this.Issueqtymodaldisable[this.issuedetalisIndex] = false
    this.form.controls['material'].enable()
    if (this.Rawmateriladata.length === this.ReleaseAllMaterial.length) {
      this.savebtn = true
    } else {
      this.savebtn = false

    }
  }
  ReleaseAllMaterial: any[] = new Array()
  savebtn: boolean = false
  MaterialAllReleasebtn: boolean = true
  Issueqtymodaldisable = [false, false]

  Deletemat(index: number) {
    const [removed] = this.dataSource.data.splice(index, 1);
    this.dataSource.data = [...this.dataSource.data];
    this.Rawmateriladata = [
      ...this.Rawmateriladata,
      { RawMatID: removed.RawMatID, RawMatName: removed.gStrMatDisp }
    ];
    console.log(this.Rawmateriladata);
    this.form.controls['material'].setValue("")
  }
  batchwiseindex: number = 0
  DeleteBatchwise(Index: number) {
    this.batchwiseindex = Index
    this.Tab1 = 0
    this.MaterilaDetalis.splice(Index, 1);
    this.Issuedetalisarr.splice(Index, 1);
    this.Batcharr.splice(Index, 1);
    this.Releasebtndisable[Index] = false
    this.Issueqtymodaldisable[Index] = false
    this.form.controls['material'].enable()
    if (this.Rawmateriladata.length === this.ReleaseAllMaterial.length) {
      // this.MaterialAllReleasebtn = true

      this.savebtn = true
    } else {

      this.savebtn = false

    }

  }


  releasebtn: any
  StoreIssueSave: any[] = new Array()
  UpdateStoreIssue: any[] = new Array()
  StoreIssue_Invent_MinMaterial: any[] = new Array()
  StoreIssue_invent_batchqtyissue: any[] = new Array()
  Sts: string = ''
  Msg: string = ''
  GetSave() {
    this.getStockReqno()
    this.StoreIssue_invent_batchqtyissue = []
    this.StoreIssue_Invent_MinMaterial = []
    this.UpdateStoreIssue = []
    for (let i = 0; i < this.Issuedetalisarr.length; i++) {
      this.StoreIssue_Invent_MinMaterial.push({
        Rawmatid: this.Issuedetalisarr[i].MaterialID,
        IssueQty: this.Issuedetalisarr[i].IssueQty,
        Uom: this.Issuedetalisarr[i].Uom,
        GrnNo: this.Issuedetalisarr[i].GRnNO,
        Empid: this.Empid,
        Grnid: this.Issuedetalisarr[i].Grnid,
        Min_ref_no: this.StockReqNo,
        Srid: this.Issuedetalisarr[i].Srid,
        StoreEntryId: this.Issuedetalisarr[i].StoreEntryId,
        InventRawmatid: this.Issuedetalisarr[i].MaterialID,
        InventProdid: this.Issuedetalisarr[i].MaterialID,
        InventGrnid: this.Issuedetalisarr[i].Grnid,
        InventMinQty: this.Issuedetalisarr[i].IssueQty,
        WarehouseLocationId: this.form.controls['Warehouse'].value,
        CurrencyId: 1,
        Exrate: this.Issuedetalisarr[i].ExRate,
        LocationId: this.LoactionId,
        StrIssRef_no: this.StockReqNo
      })
    }
    console.log(this.StoreIssue_Invent_MinMaterial, 'StoreIssue_Invent_MinMaterial');
    if (this.Batcharr.length !== 0) {
      for (let i = 0; i < this.Batcharr.length; i++) {
        this.StoreIssue_invent_batchqtyissue.push({
          Grnno: this.Batcharr[i].Grnno,
          GrnId: this.Batcharr[i].GrnId,
          Grn_Ref_No: this.Batcharr[i].GrnRefNo,
          RawMatId: this.Batcharr[i].MaterialID,
          BatchNo: this.Batcharr[i].BatchNo,
          ExpiryDate: this.Batcharr[i].ExpiryDate,
          BatchId: this.Batcharr[i].BatchId,
          IssQty: this.Batcharr[i].IssueQty
        })
        console.log(this.StoreIssue_invent_batchqtyissue, 'StoreIssue_invent_batchqtyissue');
      }
    }
    if (this.Batcharr.length !== 0) {

      this.UpdateStoreIssue.push({
        Deptid: this.Deptid,
        StrIssRef_no: this.StockReqNo,
        LocationId: this.LoactionId,
        Empid: this.Empid,
        IssueId: this.Empid,
        ComputerName: 'Tab Entry',
        StoreIssue_Invent_MinMaterial: this.StoreIssue_Invent_MinMaterial,
        StoreIssue_invent_batchqtyissue: this.StoreIssue_invent_batchqtyissue
      })
      console.log(this.UpdateStoreIssue, 'saveData');
    } else {

      this.UpdateStoreIssue.push({
        Deptid: this.Deptid,
        StrIssRef_no: this.StockReqNo,
        LocationId: this.LoactionId,
        Empid: this.Empid,
        IssueId: this.Empid,
        ComputerName: 'Tab Entry',
        StoreIssue_Invent_MinMaterial: this.StoreIssue_Invent_MinMaterial,
        StoreIssue_invent_batchqtyissue: []
      })
      console.log(this.UpdateStoreIssue, 'saveData');
    }

    this.service.Save(this.UpdateStoreIssue).subscribe({
      next: (data: any) => {

        this.StoreIssueSave = data
        // console.log(this.StoreIssueSave, 'Save');
        this.Sts = this.StoreIssueSave[0].status
        this.Msg = this.StoreIssueSave[0].Msg
        if (this.Sts === 'Y') {
          const Save = document.getElementById('Save') as HTMLInputElement
          Save.click()
        } else {
          const Save = document.getElementById('Save') as HTMLInputElement
          Save.click()
        }
      }

    })

  }
  finalSave() {
    this.getStockReqno()
    this.UpdateStoreIssue = []
    this.StoreIssue_invent_batchqtyissue = []
    this.StoreIssue_Invent_MinMaterial = []
    this.viewbtn = false
    this.form.reset()
    this.MaterialRealase = []
    this.Issuedetalisarr = []
    this.Batcharr = []
    this.BatchData = []
    this.form.enable()
    this.Viewmat = false

    this.savebtn = false
    this.MaterilaDetalis = []
    this.Releasebtndisable = [false, false]
    this.Issueqtymodaldisable = [false, false]
  }

  ViewMaterilaDetalis: any[] = new Array()
  View(Index: number) {
    const MaterailTabView = document.getElementById('MaterailTabView') as HTMLInputElement
    MaterailTabView.click()
    this.ViewMaterilaDetalis = []
    this.ViewMaterilaDetalis.push({
      MaterialName: this.MaterilaDetalis[Index].gStrMatDisp,
      SRUom: this.MaterilaDetalis[Index].SRUom,
      loc_id: this.MaterilaDetalis[Index].loc_id,
      max_level: this.MaterilaDetalis[Index].max_level,
      reorder_level: this.MaterilaDetalis[Index].reorder_level,
      deptname: this.MaterilaDetalis[Index].deptname,
      popend: this.MaterilaDetalis[Index].popend,
    })
    // console.log(this.ViewMaterilaDetalis, 'view');
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
  ngOnDestroy() {
    let ModeuleId = 166
    let logoutStoreissue = {}
    logoutStoreissue = {
      locid: this.LoactionId,
      loginid: this.Empid,
      modid: ModeuleId,
      loginsystem: 'Tab-Entry'
    }
    this.service.UpdateStoreissueLogout(logoutStoreissue).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.toastr.success(res[0].Msg)
        }
      }
    })

  }
}

