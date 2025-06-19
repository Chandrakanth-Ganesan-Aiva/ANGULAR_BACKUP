import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { PurchaseRequestService } from '../service/purchase-request.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { StoreReqMatlDeptService } from '../service/store-req-matl-dept.service';
import { debounceTime, distinctUntilChanged, filter, map, startWith, Subscription, switchMap, tap, pipe } from 'rxjs';
import { PurchaseRequestComponent } from '../purchase-request/purchase-request.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-store-req-matl-det',
  templateUrl: './store-req-matl-det.component.html',
  styleUrl: './store-req-matl-det.component.scss'
})
export class StoreReqMatlDetComponent implements OnInit {
  PurchaseForm!: FormGroup
  Schform!: FormGroup
  Status: boolean = false
  locationId: number = 0
  constructor(private date: DatePipe, private service: StoreReqMatlDeptService, private fb: FormBuilder,
    private dialog: MatDialog, public StReqMatlDetCom: MatDialogRef<StoreReqMatlDetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.PurchaseForm = this.fb.group({
      Material: ['', [Validators.required]],
      Checkbox: [''],
      IndentPen: [''],
      uom: [''],
      StReqPen: [''],
      Qty: ['', [Validators.required]],
      AllocQty: [''],
      Min: [''],
      PlanTot: [''],
      Max: [''],
      IssQty: [''],
      Reorder: [''],
      PackQty: [''],
      Location: [''],
      StockAvl: [''],
      Priority: ['1', Validators.required],
      Machine: [''],
      DeptStock: [''],
      MaxStock: [''],
      AllowQty: [''],
      DeptStckQty: [''],
      AllowPackQty: [''],
      Spec: [''],
      Desc: ['', [Validators.required]],
      balanceQty:['']
    })

    this.Schform = this.fb.group({
      OrderQty: [this.data.OrdQty],
      Uom: [this.data.Uom],
      Qty: ['', [Validators.required]],
      StockQty: [''],
      Comments: [''],
      Schdule_Dt: [this.date.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
    })

    this.locationId = JSON.parse(sessionStorage.getItem('location') || '{}');
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid

  }
  Empid: number = 0
  filterMatl = new FormControl('')
  filterSubscription: Subscription | undefined;
  rawmaterialArr: any
  OriginalDSValue: any
  filterMach = new FormControl('')
  ngOnInit() {
    this.filterSubscription = this.filterMatl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((search): search is string => search !== null && search.trim().length >= 2),
        switchMap((search: string) => this.service.Material(search))
      )
      .subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            this.rawmaterialArr = res;
            if ((this.filterMatl.value || '').trim().length <= 2) {
              this.rawmaterialArr = [];
            }
          }
        }
      });

    if (this.data.Comp_Name === 'PurchaseRequestionOldPo') {
      this.getOldPo()
    }
    if (this.data.Comp_Name === 'PurchaseRequestionSch') {
      if (this.data.isSch == false) {
        this.data.IsEdit = 'Update'
      } else {
        this.data.IsEdit = 'Edit'
      }
      if (this.data.IsEdit == 'Update') {
        this.SchdataSource.data = [...this.data.SchDatSource]
        this.SchdataSource.data = [... this.SchdataSource.data]
        this.Schform.controls['OrderQty'].disable()
      } else {
        this.SchdataSource.data = [...this.data.SchDatSource]
        this.SchdataSource.data = [... this.SchdataSource.data]
        this.Schform.disable()
      }
    }

    this.filterMach.valueChanges.pipe(map((search: any) =>
      this.MachArr.filter((option: any) => option.machname.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.MachArrFilter = filtered))

    if (this.data.frm_model == 9) {
      if (this.data.deptId == 12 || this.data.deptId == 49 || this.data.deptId == 79) {
        this.PurchaseForm.controls['Machine'].setValidators([Validators.required]);
        this.PurchaseForm.controls['Machine'].updateValueAndValidity();
        this.getMachine()
      }
    }
  }
  isSelectingText:any

checkTextSelectionStart(event: MouseEvent) {
  const selection = window.getSelection();
  if (selection && selection.toString().length === 0) {
    this.isSelectingText = true;
  }
}

checkTextSelectionEnd(event: MouseEvent) {
  setTimeout(() => {
    const selection = window.getSelection();
    this.isSelectingText = selection && selection.toString().length > 0;
    // Reset drag-disabled after short delay
    setTimeout(() => this.isSelectingText = false, 200);
  }, 0);
}

  RawmaterialLoction: any[] = new Array()
  MatlChangeEvent() {
    if (this.PurchaseForm.controls['Material'].value) {
      const result = this.rawmaterialArr.filter((res: any) => {
        if (this.PurchaseForm.controls['Material'].value == res.RawMatID) {
          this.PurchaseForm.controls['uom'].setValue(res.uom)
          this.PurchaseForm.controls['Spec'].setValue(res.rawmatname)
        }
      })
      this.StoreReqMatlDet()
    }
  }
  StoreReqMatlDetArr: any[] = []
  StoreReqMatlDet() {
    this.service.StoreReqMatlDet(this.locationId, this.PurchaseForm.controls['Material'].value, this.data.frm_model, this.data.IndentType, this.Empid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.StoreReqMatlDetArr = []
          this.StoreReqMatlDetArr = res
          if (this.StoreReqMatlDetArr[0].RawMatLoc == '' || this.StoreReqMatlDetArr[0].RawMatLoc == null) {
            this.Error = 'Please set the Location Name in location Master. Shall I continue ? "'
            this.userHeader = 'Warning!!!'
            this.opendialog()
            this.dialogRef.afterClosed().subscribe((result: boolean) => {
              if (!result) {
                this.PurchaseForm.reset()
                this.PurchaseForm.controls['Priority'].setValue('1')
                this.PurchaseForm.markAsUntouched()
                this.rawmaterialArr = []
              }
            })
          }
          this.PurchaseForm.controls['IndentPen'].setValue(this.StoreReqMatlDetArr[0].IndentPend)
          this.PurchaseForm.controls['StReqPen'].setValue(this.StoreReqMatlDetArr[0].StoreReqPend)
          this.PurchaseForm.controls['AllocQty'].setValue(this.StoreReqMatlDetArr[0].Allocatedqty)
          this.PurchaseForm.controls['Min'].setValue(this.StoreReqMatlDetArr[0].Min_level)
          this.PurchaseForm.controls['PlanTot'].setValue(this.StoreReqMatlDetArr[0].PlanToleranceQty)
          this.PurchaseForm.controls['Max'].setValue(this.StoreReqMatlDetArr[0].Max_level)
          this.PurchaseForm.controls['IssQty'].setValue(this.StoreReqMatlDetArr[0].IssueQty)
          this.PurchaseForm.controls['Reorder'].setValue(this.StoreReqMatlDetArr[0].Reorder_level)
          this.PurchaseForm.controls['PackQty'].setValue(this.StoreReqMatlDetArr[0].PackQty)
          this.PurchaseForm.controls['Location'].setValue(this.StoreReqMatlDetArr[0].RawMatLoc)
          this.PurchaseForm.controls['StockAvl'].setValue(this.StoreReqMatlDetArr[0].StockAvl)
          this.PurchaseForm.controls['DeptStock'].setValue(this.StoreReqMatlDetArr[0].DeptStock)
          this.PurchaseForm.controls['MaxStock'].setValue(this.StoreReqMatlDetArr[0].DeptMaxStock)
          this.PurchaseForm.controls['AllowQty'].setValue(this.StoreReqMatlDetArr[0].DeptAlwQty)
          this.PurchaseForm.controls['DeptStckQty'].setValue(this.StoreReqMatlDetArr[0].DeptAlwQtyPack)
          this.PurchaseForm.controls['AllowPackQty'].setValue(this.StoreReqMatlDetArr[0].DeptPackQty)
           this.PurchaseForm.controls['balanceQty'].setValue(this.StoreReqMatlDetArr[0].BalQty)
        }
      }
    })
    this.PurchaseForm.valueChanges.subscribe(() => {
      this.checkStockLevel();
    });
  }
  stockColor: any
  stockTextColor: any
  checkStockLevel() {
    const min = +this.PurchaseForm.get('Min')?.value || 0;
    const stock = +this.PurchaseForm.get('StockAvl')?.value || 0;
    if (stock < min) {
      this.stockColor = 'red';
      this.stockTextColor = 'black';
    } else {
      this.stockColor = '';
      this.stockTextColor = '';
    }
  }
  AddVaild() {
    if (this.PurchaseForm.invalid) {
      return this.PurchaseForm.markAllAsTouched()
    } else {
      let Desc = this.PurchaseForm.controls['Desc'].value
      if (Desc < 10) {
        this.Error = 'Please fill the clear description. without clear Description you cannot save, It should be atleast 10 character'
        this.userHeader = 'Information'
        return this.opendialog()
      }
      let Max = this.PurchaseForm.controls['Max'].value
      let Min = this.PurchaseForm.controls['Min'].value
      let Reorder = this.PurchaseForm.controls['Reorder'].value
      let StockAvl = this.PurchaseForm.controls['StockAvl'].value
      let Qty = this.PurchaseForm.controls['Qty'].value
      let balQty = this.StoreReqMatlDetArr[0].BalQty

      if (this.data.frm_model == 9) {
        let GrnTypeId = this.StoreReqMatlDetArr[0].GrnTypeId
        if (GrnTypeId != 115 && GrnTypeId != 116 && GrnTypeId != 117 && GrnTypeId != 118 && GrnTypeId != 104) {
          if (!this.PurchaseForm.controls['Machine']) {
            this.Error = 'Please select Machine'
            this.userHeader = 'Information'
            return this.opendialog()
          }
        }
      }

      if (this.data.frm_model == 1) {
        if (this.data.IndentType == 1) {
          if (parseFloat(Max) + parseFloat(Min) + parseFloat(Reorder) > 0) {
            if ((parseFloat(StockAvl) - parseFloat(Qty)) < parseFloat(Min)) {
              this.Error = 'Now you reached Minimum Level Quantity'
              this.userHeader = 'Information'
              return this.opendialog()
            }
          }

          if (parseFloat(balQty) < parseInt(Qty)) {
            this.Error = 'Now you reached Minimum Level Quantity'
            this.userHeader = 'Information'
            return this.opendialog()
          }
        }
        if (parseFloat(this.StoreReqMatlDetArr[0].Txt_avl) - parseFloat(Min) > 0) {
          this.Error = 'Please raise Issue Indent. Already Stock is available'
          this.userHeader = 'Information'
          return this.opendialog()
        }
      }

      this.AddPurchaseReq()
    }
  }

  PurchaseCom!: MatDialogRef<PurchaseRequestComponent>
  purcahseDatasource: any[] = new Array()
  AddPurchaseReq() {
    let PriorityName = ''
    const selectedMaterialId = this.PurchaseForm.controls['Material'].value;
    const isDuplicate = this.purcahseDatasource.some((res: any) => res.MaterialId == selectedMaterialId)
    if (this.PurchaseForm.controls['Priority'].value == 1) {
      PriorityName = 'Low'
    }
    else if (this.PurchaseForm.controls['Priority'].value == 2) {
      PriorityName = 'Medium'
    } else {
      PriorityName = 'High'
    }
    if (!isDuplicate) {
      this.purcahseDatasource.push({
        MaterialName: this.PurchaseForm.controls['Spec'].value,
        MaterialId: this.PurchaseForm.controls['Material'].value,
        Qty: this.PurchaseForm.controls['Qty'].value,
        Uom: this.PurchaseForm.controls['uom'].value,
        Desc: this.PurchaseForm.controls['Desc'].value,
        Min: this.PurchaseForm.controls['Min'].value,
        Max: this.PurchaseForm.controls['Max'].value,
        Reorder: this.PurchaseForm.controls['Reorder'].value,
        PriorityName: PriorityName,
        Priority: this.PurchaseForm.controls['Priority'].value,
        Machid: this.PurchaseForm.controls['Machine'].value,
        Machtype: this.MachType,
        isSch: false
      })
    } else {
      this.Error = 'Material already selected'
      this.userHeader = 'Information'
      return this.opendialog()
    }
    console.log(this.purcahseDatasource);
    this.PurchaseForm.reset()
    this.PurchaseForm.controls['Priority'].setValue('1')
    this.PurchaseForm.markAsUntouched()
    this.rawmaterialArr = []
  }
  Update() {
    if (this.purcahseDatasource.length < 1) {
      this.Error = 'Please fill detalis and Add By Click add Afer Update it'
      this.userHeader = 'Information'
      return this.opendialog()
    } else {
      this.StReqMatlDetCom.close(this.purcahseDatasource)
    }
  }
  changeDate: any
  schduleDateChangeEvent(e: any) {
    this.changeDate = this.date.transform(e.value, 'yyyy-MM-dd')
    this.Schform.controls['Schdule_Dt'].setValue(this.changeDate)
  }
  SchdataSource: any = new MatTableDataSource()
  // ReamingQty: number = 0
  UpdatebtnIsEditUpdate: boolean = true
  UpdateAdd: boolean = false
  EditUpdate: boolean = true
  ReamingQty: number = 0
  Insert() {
    if (this.Schform.valid) {
      if (this.data.IsEdit == 'Update') {
        let Currdate: any = this.date.transform(new Date(), 'yyyy-MM-dd')
        if (Currdate > this.changeDate) {
          this.Error = 'Please Select More than PO Date'
          this.userHeader = 'Information'
          return this.opendialog()
        }
        let VaildReamingQty = this.ReamingQty

        this.SchdataSource.data.push({
          Material: this.data.Material,
          MaterialId: this.data.MaterialId,
          SchQty: parseInt(this.Schform.controls['Qty'].value),
          Uom: this.data.Uom,
          SchDate: this.Schform.controls['Schdule_Dt'].value,
          CommDt: this.Schform.controls['Schdule_Dt'].value,
          isSch: true
        })
        this.ReamingQty = this.SchdataSource.data.reduce((sum: any, item: any) => parseInt(sum) + parseInt(item.SchQty, 10), 0);

        // this.ReamingQty = this.Schform.controls['OrderQty'].value - this.ReamingQty
        // console.log(this.ReamingQty , parseInt(this.Schform.controls['OrderQty'].value));

        if (this.ReamingQty > parseInt(this.Schform.controls['OrderQty'].value)) {
          this.ReamingQty = VaildReamingQty
          this.Schform.controls['Qty'].setValue('')
          this.Schform.markAsUntouched()
          this.SchdataSource.data.pop()
          this.Error = 'You Cannot Enter More Than Po Quantity'
          this.userHeader = 'Information'
          return this.opendialog()
        }
        console.log(this.ReamingQty, parseInt(this.Schform.controls['OrderQty'].value));

        if (this.ReamingQty > 0) {
          if (this.ReamingQty == this.Schform.controls['OrderQty'].value) {
            this.Schform.controls['OrderQty'].disable()
          }
        }
        this.SchdataSource.data = [...this.SchdataSource.data]
        this.Schform.controls['Qty'].setValue('')
        this.Schform.markAsUntouched()
        if (this.RemQty() == 0) {
          this.Schform.controls['Qty'].disable()
          this.UpdatebtnIsEditUpdate = false
          this.UpdateAdd = true
          this.Schform.controls['OrderQty'].disable()
        }
        // }
      } else {
        this.SchdataSource.data[this.Selectedindex].SchQty = this.Schform.controls['Qty'].value
        this.SchdataSource.data[this.Selectedindex].SchDate = this.Schform.controls['Schdule_Dt'].value
        this.Selectedindex = -1
        this.SchdataSource.data = [...this.SchdataSource.data]
        console.log(this.SchdataSource.data);
        this.Schform.controls['Qty'].setValue('')
        this.Schform.markAsUntouched()
        this.cancelBtn = true
        if (this.totalSchQty() == parseInt(this.Schform.controls['OrderQty'].value)) {
          this.Schform.controls['Qty'].disable()
          this.EditUpdate = false
          this.UpdateBtn = false
          this.cancelBtn = true
          this.AddBtn = true
        }
      }

    } else {
      this.Schform.markAllAsTouched()
    }
  }

  deletsch(row: any, index: any) {
    this.Selectedindex = index
    this.Error = 'Do You Want To delete ?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.SchdataSource.data.splice(index, 1)
        this.SchdataSource.data = [...this.SchdataSource.data]
        let totq: any = 0
        totq = this.SchdataSource.data.reduce((sum: any, item: any) => parseInt(sum) + parseInt(item.SchQty), 0);
        if (this.data.IsEdit == 'Update') {
          this.Schform.controls['Qty'].enable()
          this.UpdatebtnIsEditUpdate = true
          this.UpdateAdd = false
          this.RemQty()
        } else {
          this.Schform.controls['Qty'].enable()
          this.AddBtn = false
          this.UpdateBtn = true
        }

        if (totq > 0) {
          if (totq == this.Schform.controls['OrderQty'].value) {
            this.Schform.controls['OrderQty'].disable()
          } else {
            this.Schform.controls['OrderQty'].enable()
          }
        }
      } else {
        this.Error = 'Delete Cancelled'
        this.userHeader = 'Information'
        this.opendialog()
      }
    })
  }
  UpdateSch() {

    let totq: any = 0
    totq = this.SchdataSource.data.reduce((sum: any, item: any) => parseInt(sum) + parseInt(item.SchQty), 0);
    if (totq != this.Schform.controls['OrderQty'].value) {
      this.Error = 'Please fill the full schedule'
      this.userHeader = 'Information'
      return this.opendialog()
    } else {
      if (this.data.IsEdit = 'Update') {
        this.StReqMatlDetCom.close(this.SchdataSource.data)
      }
      if (this.data.IsEdit = 'Edit') {
        this.StReqMatlDetCom.close(this.SchdataSource.data)
      }


    }
  }


  SelectedMatl: string = ''
  Selectedindex: any
  cancelBtn: boolean = true
  AddBtn: boolean = true
  UpdateBtn: boolean = true
  edit(row: any, index: number) {
    this.data.IsEdit = 'Edit'
    this.SelectedMatl = row.MaterialId
    this.Selectedindex = index
    this.Schform.enable()
    this.Schform.patchValue({
      Qty: row.SchQty,
      StockQty: '',
      Schdule_Dt: row.SchDate,
    })
    console.log(this.Schform.value);
    this.Schform.controls['OrderQty'].disable()
    this.cancelBtn = false
    // this.UpdateBtn = false
    this.AddBtn = false
  }
  Cancelbtn() {
    this.data.IsEdit = 'Edit'
    this.Selectedindex = -1
    this.cancelBtn = true
    this.UpdateBtn = true
    this.AddBtn = true
  }
  SearchOldPo(e: any) {

  }
  OldPodataSource = new MatTableDataSource()
  getOldPo() {
    let oldPO: any[] = this.data.OldPOData
    console.log(this.data);
    this.OldPodataSource.data = [...oldPO]
    this.OldPodataSource.data = [...this.OldPodataSource.data]
  }
  @ViewChild('matlprevrec') matlprevrec!: TemplateRef<any>; // use TemplateRef, not HTMLTemplateElement
  MatlPrevIssueRecDatasource = new MatTableDataSource();
  RecDialog: any = '';
  MatlPrevIssueRec() {
    if (!this.PurchaseForm.controls['Material'].value) {
      this.Error = 'Please the Select Material'
      this.userHeader = 'Information'
      return this.opendialog()
    }
    this.service.MatlPrevIssueRec(this.locationId, this.PurchaseForm.controls['Material'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            return this.opendialog();
          }

          // Update data source
          this.MatlPrevIssueRecDatasource.data = res;

          // Open dialog after data is ready
          this.RecDialog = this.dialog.open(this.matlprevrec, {
            disableClose: true,
            width: '70%',
            height: '50%',
            panelClass: 'custom-dialog'
          });
        }
      },
    });
  }

  matlprevrecclose() {
    this.RecDialog.close()
  }
  @ViewChild('indentPendingView') indentPendingView!: TemplateRef<any>; // use TemplateRef, not HTMLTemplateElement
  indentPendingViewDatasource = new MatTableDataSource();
  indentPending: any = '';
  getIndentPendingView() {
    if (!this.PurchaseForm.controls['Material'].value) {
      this.Error = 'Please the Select Material'
      this.userHeader = 'Information'
      return this.opendialog()
    }
    this.service.IntendPendingView(this.locationId, this.PurchaseForm.controls['Material'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            return this.opendialog();
          }
          this.indentPendingViewDatasource.data = res;
          this.indentPending = this.dialog.open(this.indentPendingView, {
            disableClose: true,
            width: 'fit-content',
            height: 'fit-content',
            panelClass: 'custom-dialog'
          });
        }
      },
    });
  }
  indentPendingClose() {
    this.indentPending.close()
  }
  closeDialog() {
    this.StReqMatlDetCom.close()
  }

  RemQty(): number {
    const totq = this.SchdataSource.data.reduce((sum: number, item: any) => {
      return sum + parseInt(item.SchQty);
    }, 0);
    // console.log(totq);

    const orderQty = parseInt(this.Schform.controls['OrderQty'].value);
    return orderQty - totq;
  }

  totalSchQty(): number {
    const totq = this.SchdataSource.data.reduce((sum: number, item: any) => {
      return sum + parseInt(item.SchQty, 10);
    }, 0);

    return totq;
  }

  MachArr: any[] = []
  MachArrFilter: any[] = []
  getMachine() {
    this.service.IssueReq_machine(this.locationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            return this.opendialog();
          }
          this.MachArr = res;
          this.MachArrFilter = res;
        }
      },
    });
  }
  MachType: string = ''
  MachChangeEvent() {
    if (this.PurchaseForm.controls['Machine'].value) {
      this.MachArr.filter((res: any) => {
        if (res.machid == this.PurchaseForm.controls['Machine'].value) {
          this.MachType = res.mtype
        }
      })
    }
  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}