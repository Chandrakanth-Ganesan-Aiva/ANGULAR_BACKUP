import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreIssueService } from '../service/store-issue.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, map, of, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
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

  constructor(private date: DatePipe, private toastr: ToastrService, private formBuilder: FormBuilder,
    private service: StoreIssueService, private dialog: MatDialog, private router: Router) {
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
    this.checkLayout();
    this.LoactionId = JSON.parse(sessionStorage.getItem('location') || '{}');
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid

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

  isHalfWidth: boolean = true;
  checkLayout() {
    // Example: You can make this dynamic based on window width
    this.isHalfWidth = window.innerWidth >= 992; // Bootstrap lg breakpoint
  }
  @HostListener('window:resize')
  onResize() {
    this.checkLayout();
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
  dataSource = new MatTableDataSource<any>()
  MaterialRealase: any[] = new Array()
  stockInfo: any
  View() {
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
        this.MaterialRealase = issueData;
        this.MaterialRealase = this.MaterialRealase.map((element: any) => ({
          ...element,
          stock: this.stockInfo.stock,
          PendingQty: element.srqty - element.minqty,
          issueQty: '',
          stockcheck: false,
          stockcolor: false
        }))
        const isDuplicate = this.dataSource.data
          .find(row => row.RawMatID === this.Rawmatid)
        if (isDuplicate) {
          this.Error = `Material <strong style="color:brown"> ${isDuplicate.gStrMatDisp} </strong> is already added.`;
          this.userHeader = 'Information';
          this.opendialog();
        } else {
          this.dataSource.data = [...this.dataSource.data, ...this.MaterialRealase];
        }
        this.dataSource.data.forEach((res: any) => {
          if (res.stock < res.min_level) {
            res.stockcheck = true
          } else {
            res.stockcheck = false
          }
        })
      });
    }
  }
  Clear() {
    this.getStockReqno()
    this.form.reset()
    this.form.controls['Issuedate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    // this.form.controls['frmdate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.form.controls['todate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.dataSource.data = []
    this.issueDetDatasource.data = []
    this.batchWiseDataSource.data = []
    this.form.enable()
    this.form.controls['Issuedate'].disable()
    this.form.controls['frmdate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
    this.form.controls['todate'].disable()
  }

  issuedetalisIndex: number = 0
  Issueqty: number = 0
  PendingQty: number = 0
  Sr_Ref_No: string = ''
  Srid: number = 0
  Uom: string = ''
  stock: number = 0
  deptname: string = ''
  onReleaseValidation(row: any, Index: number) {
    this.Issueqty = row.issueQty
    this.PendingQty = row.PendingQty
    this.issuedetalisIndex = Index
    this.Sr_Ref_No = row.Sr_Ref_No
    this.Srid = row.SRId
    this.Uom = row.SRUom
    this.stock = row.stock
    this.deptname = row.deptname
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
      this.userHeader = 'Warning!!!'
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
  IssueDettable: boolean = true
  issueDetDatasource = new MatTableDataSource<any>()
  batchWiseDataSource = new MatTableDataSource<any>()
  batchWiseArr: any[] = new Array()
  Release() {
    // this.issueDetDatasource.data=[]
    this.stock_check()
    if (this.Issueqty > 0) {
      let dblQty: any = this.Issueqty
      let dblQty1: any = this.Issueqty
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
                  if (dblQty > 0) {
                    if (dblQty <= IssueTable.stocknew) {
                      let issuedData = {
                        ...IssueTable,
                        Sr_Ref_No: this.Sr_Ref_No,
                        Srid: this.Srid,
                        Uom: this.Uom,
                        issueQty: this.Issueqty,
                        SrQty: this.PendingQty,
                        deptname: this.deptname
                      };
                      this.issueDetDatasource.data.push(issuedData);
                      this.issueDetDatasource.data = [...this.issueDetDatasource.data];
                      let tcount = 0
                      this.service.BatchWiseTable(IssueTable.GRNID).subscribe({
                        next: (batch: any) => {
                          if (batch.length > 0) {
                            if (batch[0].status == 'N') {
                              this.Error = batch[0].Msg
                              this.userHeader = 'Error'
                              return this.opendialog()
                            }
                            this.batchWiseArr = batch
                            this.batchWiseArr = this.batchWiseArr.map((element: any) => ({
                              ...element,
                              issueQty: '',
                              isExpired: false
                            }))
                            this.batchWiseArr.forEach((batchTabel: any) => {
                              if (batchTabel.balqty > 0) {
                                let CurrDt: any = this.date.transform(new Date(), 'yyyy-MM-dd')
                                this.batchWiseDataSource.data = [...this.batchWiseArr]
                                batchTabel.batchdate = '2025-04-05'
                                console.warn(batchTabel.batchdate < CurrDt);
                                if (batchTabel.batchdate < CurrDt) {
                                  tcount = tcount + 1
                                  batchTabel.isExpired = true;
                                } else {
                                  batchTabel.isExpired = false;
                                }
                                dblQty = this.Issueqty
                                if (dblQty < batchTabel.balqty) {
                                  batchTabel.issueQty = dblQty
                                  dblQty = 0
                                } else {
                                  dblQty = (Number(dblQty) - Number(batchTabel.balqty)).toFixed(3)
                                  batchTabel.issueQty = batchTabel.balqty
                                }
                                console.log(this.batchWiseDataSource.data);
                              }
                            })
                            if (tcount > 0) {
                              this.Error = 'Already Expired this material. Please get the revalidation certificate otherwise you cannot issue'
                              this.userHeader = 'Information'
                              return this.opendialog()
                            }
                          }
                        },
                      })

                      tcount = 0
                      dblQty = 0
                    }
                    else {
                      let tcount = 0
                      let issuedData = {
                        ...IssueTable,
                        Sr_Ref_No: this.Sr_Ref_No,
                        Srid: this.Srid,
                        Uom: this.Uom,
                        issueQty: this.Issueqty,
                        SrQty: this.PendingQty
                      };
                      this.issueDetDatasource.data.push(issuedData);
                      this.issueDetDatasource.data = [...this.issueDetDatasource.data];
                      // console.log(this.issueDetDatasource.data);
                      this.service.BatchWiseTable(IssueTable.GRNID).subscribe({
                        next: (batch: any) => {
                          if (batch.length > 0) {
                            if (batch[0].status == 'N') {
                              this.Error = batch[0].Msg
                              this.userHeader = 'Error'
                              return this.opendialog()
                            }

                            this.batchWiseArr = batch
                            this.batchWiseArr = this.batchWiseArr.map((element: any) => ({
                              ...element,
                              Issue_Qty: '',
                              isExpired: false
                            }))
                            this.batchWiseArr.forEach((batchTabel: any) => {
                              if (batchTabel.balqty > 0) {
                                let CurrDt: any = this.date.transform(new Date(), 'yyyy-MM-dd')
                                this.batchWiseDataSource.data = [...this.batchWiseArr]
                                if (batchTabel.batchdate < CurrDt) {
                                  tcount = tcount + 1
                                  batchTabel.isExpired = true;
                                } else {
                                  batchTabel.isExpired = false;
                                }
                                if (dblQty1 < batchTabel.balqty) {
                                  batchTabel.issueQty = dblQty
                                  dblQty1 = 0
                                } else {
                                  dblQty1 = (Number(dblQty1) - Number(batchTabel.balqty)).toFixed(3)
                                  batchTabel.issueQty = batchTabel.balqty
                                }
                              }
                            })
                            dblQty = this.Issueqty
                            if (IssueTable.stocknew < dblQty) {
                              IssueTable.issueQty = IssueTable.stocknew
                              dblQty = dblQty - IssueTable.stocknew
                            } else {
                              IssueTable.issueQty = dblQty
                            }
                            console.log(this.batchWiseDataSource.data);

                          }
                        },
                      })
                      if (tcount > 0) {
                        this.Error = 'Already Expired this material. Please get the revalidation certificate otherwise you cannot issue'
                        this.userHeader = 'Information'
                        return this.opendialog()
                      }
                    }
                    this.IssueDettable = false
                  }
                }
              })
              console.log(this.issueDetDatasource.data);
            }
            else {
              if (this.stock > 0) {
                this.IssuetableArr.forEach((IssueTable: any) => {
                  this.issueDetDatasource.data.push({
                    ...IssueTable,
                    Sr_Ref_No: this.Sr_Ref_No,
                    Srid: this.Srid,
                    Uom: this.Uom,
                    issueQty: this.Issueqty,
                    SrQty: this.PendingQty
                  })
                  this.issueDetDatasource.data = [...this.issueDetDatasource.data]
                  console.log(this.issueDetDatasource.data);
                })
              }
            }
          }
          else {
            this.Error = 'No records Found For this <strong style=color:"brown"> ' + this.Rawmatid + ' <strong> '
            this.userHeader = 'Information'
            return this.opendialog()
          }
        },
      })
    }
    this.Rawmateriladata = this.Rawmateriladata.filter((item: any) => item.RawMatID !== parseInt(this.form.controls['material'].value))
    console.log(this.Rawmateriladata);
  }
  stock_check() {
    this.dataSource.data.forEach((Material: any) => {
      let warehouse = this.form.controls['Warehouse'].value
      if (this.Issueqty > 0) {
        this.service.StockCheck(Material.rawmatid, this.LoactionId, warehouse).subscribe({
          next: (res: any) => {
            if (res.length > 0) {
              if (res[0].status == 'N') {
                this.Error = res[0].Msg
                this.userHeader = 'Error'
                return this.opendialog()
              }
              let errn = 0
              res.forEach((element: any) => {
                if (Material.issueQty > 0) {
                  let stockupdateArr = {
                    Grnid: element.grnid,
                    StoreEntryId: element.StoreEntryId,
                    WareHouse: warehouse
                  }
                  this.service.stockupdate(stockupdateArr).subscribe({
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
                if (errn == 0 && Material.issueQty > 0) {
                  Material.issueQty = 0
                  Material.stockcolor = true
                  errn = 0
                }
              });
            }
          }
        })
      }
    })
  }


  ReleaseAllMaterial: any[] = new Array()
  savebtn: boolean = false
  MaterialAllReleasebtn: boolean = true
  Issueqtymodaldisable = [false, false]

  Deletemat(index: number) {
    this.Error = 'Do You Want To Delete ?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const [removed] = this.dataSource.data.splice(index, 1);
        this.dataSource.data = [...this.dataSource.data];
        if (removed?.RawMatID) {
          const rawMatId = removed.RawMatID;

          this.issueDetDatasource.data = this.issueDetDatasource.data.filter(
            item => item.Rawmatid !== rawMatId
          );
          this.issueDetDatasource.data = [...this.issueDetDatasource.data]
          this.batchWiseDataSource.data = this.batchWiseDataSource.data.filter(
            item => item.rawmatid !== rawMatId
          );
          this.batchWiseDataSource.data = [...this.batchWiseDataSource.data]


        }
        this.Rawmateriladata = [
          ...this.Rawmateriladata,
          { RawMatID: removed.RawMatID, RawMatName: removed.gStrMatDisp }
        ];
        this.form.controls['material'].enable()
        if (this.dataSource.data.length == 0) {
          this.Clear()
        }
      } else {
        this.Error = 'Delete Cancelled?'
        this.userHeader = 'Information'
        return this.opendialog()
      }
    })


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
    this.issueDetDatasource.data.forEach((res: any) => {
      this.StoreIssue_Invent_MinMaterial.push({
        Rawmatid: res.MaterialID,
        IssueQty: res.IssueQty,
        Uom: res.Uom,
        GrnNo: res.GRnNO,
        Empid: this.Empid,
        Grnid: res.Grnid,
        Min_ref_no: this.StockReqNo,
        Srid: res.Srid,
        StoreEntryId: res.StoreEntryId,
        InventRawmatid: res.MaterialID,
        InventProdid: res.MaterialID,
        InventGrnid: res.Grnid,
        InventMinQty: res.IssueQty,
        WarehouseLocationId: this.form.controls['Warehouse'].value,
        CurrencyId: 1,
        Exrate: res.ExRate,
        LocationId: this.LoactionId,
        StrIssRef_no: this.StockReqNo
      })
    })

    console.log(this.StoreIssue_Invent_MinMaterial, 'StoreIssue_Invent_MinMaterial');
    if (this.batchWiseDataSource.data.length !== 0) {
      this.batchWiseDataSource.data.forEach((res: any) => {
        this.StoreIssue_invent_batchqtyissue.push({
          Grnno: res.Grnno,
          GrnId: res.GrnId,
          Grn_Ref_No: res.GrnRefNo,
          RawMatId: res.MaterialID,
          BatchNo: res.BatchNo,
          ExpiryDate: res.ExpiryDate,
          BatchId: res.BatchId,
          IssQty: res.IssueQty
        })
      })
      console.log(this.StoreIssue_invent_batchqtyissue, 'StoreIssue_invent_batchqtyissue');
    } else {
      this.StoreIssue_invent_batchqtyissue = []
    }
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


    this.service.Save(this.UpdateStoreIssue).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          } else {
            this.Error = res[0].Msg
            this.userHeader = 'Information'
            this.opendialog()
            this.dialogRef.afterClosed().subscribe((res: any) => {
              if (res == true) {
                this.Clear()
              }
            })
          }

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
  ngOnDestroy() {
    let ModeuleId = 166
    let logoutStoreissue: any[] = new Array()

    logoutStoreissue.push({
      locid: this.LoactionId,
      loginid: this.Empid,
      modid: ModeuleId,
      loginsystem: 'Tab-Entry'
    })


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

