import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GrnEntryService } from '../service/grn-entry.service';
import { CustomizeDialogComponent } from '../customize-dialog/customize-dialog.component';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { from, map, retry } from 'rxjs';
import {  MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-grnentry',
  templateUrl: './grnentry.component.html',
  styleUrl: './grnentry.component.scss'
})
export class GRNEntryComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FormGroup;
  subform: FormGroup;
  CleaningChargesForm: FormGroup;
  OthersForm: FormGroup;
  GeneralForm: FormGroup;
  PtcdForm: FormGroup;
  filterControl = new FormControl('');
  EmpId: number = 0
  constructor(private date: DatePipe, private dialog: MatDialog, private fb: FormBuilder, private service: GrnEntryService) {



    this.form = this.fb.group({
      grnType: ['', Validators.required],
      grnRefNo: [{ value: '', disabled: true }, Validators.required],
      grnDate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, Validators.required],
      creditPeriod: [{ value: '', disabled: true }, Validators.required],
      supplier: [null, Validators.required],
      gateEntryNo: ['', Validators.required],
      gateDate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, Validators.required],
      vechileNo: [{ value: '', disabled: true }, Validators.required],
      DcNo: [{ value: '', disabled: true }, Validators.required],
      invoiceNo: [{ value: '', disabled: true }, Validators.required],
      dcDate: [this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      invoiceDate: [this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      loadWeight: [{ value: '', disabled: true }, Validators.required],
      tareWeight: [{ value: '', disabled: true }, Validators.required],
      netWeight: [{ value: '', disabled: true }, Validators.required],
      netWeight1: [{ value: '', disabled: true }, Validators.required],
      packingWeight: [{ value: '', disabled: true }, Validators.required],
      supplierRate: [{ value: '', disabled: true }, Validators.required],
      ticketNo: ['', Validators.required],
      frieghtIncl: [{ value: '', disabled: true }, Validators.required],
      Type: ['single', Validators.required],
      Material: ['']
    })

    this.subform = this.fb.group({
      rate: [{ value: '', disabled: true }, Validators.required],
      currency: [{ value: '', disabled: true }, Validators.required],
      exRate: [{ value: '', disabled: true }, Validators.required],
      qcReq: ['', Validators.required],
    })

    this.PtcdForm = this.fb.group({
      poValue: [{ value: '', disabled: true },],
      subValue: [{ value: '', disabled: true },]
    })

    this.CleaningChargesForm = this.fb.group({
      ClearingAgent: ['', Validators.required],
      Port: ['', Validators.required],
      Gstno: ['', Validators.required]
    })

    this.GeneralForm = this.fb.group({
      taxType: ['', Validators.required],
    })

    this.OthersForm = this.fb.group({
      linerName: ['', Validators.required],
      Amount: ['', Validators.required],
      TaxType: ['', Validators.required],
      Billno: ['', Validators.required],
      Billdate: [this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required]
    })
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]
  }
  LocationId: number = 0
  filteredOptions: any[] = [];

  grandTotal = new FormControl()
  SupName = new FormControl()
  Splibtn: boolean = true
  customizeDialog!: MatDialogRef<CustomizeDialogComponent>;
  ngOnInit() {
    this.grandTotal.disable()
    this.SupName.disable()

    this.Splibtn = true
    this.service.gateEntryDelay(this.LocationId).subscribe({
      next: (res: any) => {
        res.length = 0
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.Error = 'Some Gateentry is found more than 1 days. Please clear'
          this.userHeader = 'Error'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(res => {
            this.customizeDialog = this.dialog.open(CustomizeDialogComponent, {
              disableClose: true,
              data: {
                Comp_Name: "grnEntry",
              },
            });
          })
        } else {


          this.getStockReqno()
          this.getGrnType()
          this.getParty()
          this.filterControl.valueChanges.pipe(map((search) =>
            this.grnPatyDetArr.filter((option: any) =>
              option.PartyName.toLowerCase().includes(search?.toLowerCase() || '')
            ))
          ).subscribe((filtered) => (this.grnPatyDetArrfilter = filtered));
        }
      }
    })
  }
  ngOnDestroy() {

  }
  // @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('MaterialPaginator', { static: false }) MaterialPaginator!: MatPaginator;
  @ViewChild('WeightPaginator', { static: false }) WeightPaginator!: MatPaginator;
  @ViewChild('PoSchedulePageinator', { static: false }) PoSchedulePageinator!: MatPaginator;
  ngAfterViewInit() {
    // this.poDetailDataSource.paginator = this.paginator;
    this.materialDataSource.paginator = this.MaterialPaginator
    // this.WeightDataSource.paginator = this.WeightPaginator
    this.PoScheduledatasource.paginator = this.PoSchedulePageinator
  }
  masterid: number = 461
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    let frmdate = this.date.transform(new Date(), 'yyyy-MM-dd')
    this.service.Stockreno(this.masterid, frmdate, this.LocationId).subscribe((res: any) => {
      if (res.length > 0) {
        if (res[0].status == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          return this.opendialog()
        }
        this.StockReq = res
        this.form.controls['grnRefNo'].setValue(this.StockReq[0].translno)
      }
    })
  }
  grnTypeArr: any[] = new Array()
  getGrnType() {
    this.service.GrnEntryType().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.grnTypeArr = res
          this.form.controls['grnType'].setValue(this.grnTypeArr[1].TypeID)
        }
      }
    })
  }
  GrnTypeEvent() {
    if (this.form.controls['grnType'].value) {

    }
  }
  grnPatyDetArr: any[] = new Array()
  grnPatyDetArrfilter: any[] = new Array()
  getParty() {
    this.service.GrnEntryParty().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.grnPatyDetArr = res
          this.grnPatyDetArrfilter = res
        }
      }
    })
  }
  Currid: number = 0
  CleaningChargesTabHide = true
  PartyChangeEvent() {
    if (this.form.controls['supplier'].value) {
      this.grnPatyDetArrfilter.filter((item: any) => {
        item.PartyID == this.form.controls['supplier'].value
        return this.Currid = item.currid
      })
      if (this.Currid == 1) {
        this.CleaningChargesTabHide = false
      } else {
        this.CleaningChargesTabHide = true
      }

      this.form.controls['Type'].setValue('single')
      this.getGateEntryNo()
      this.getCeditPeriod()
      this.getCurrency()
      this.getClearingAgent()
      this.getLinear()
      this.gettaxType()
      this.getPort()
      this.getMaterialTabelDet()
      // this.getWeigtDetalisTabel()
      this.gateEntryNofilter.valueChanges.pipe(map((search) =>
        this.gateEntryNoArr.filter((option: any) =>
          option.GateEntry_Ref_No.toLowerCase().includes(search?.toLowerCase() || '')
        ))
      ).subscribe((filtered) => (this.gateEntryNofilteredOptions = filtered));

      this.TaxTypefilterControl.valueChanges.pipe(map((search) =>
        this.taxTypeArr.filter((option: any) =>
          option.taxgroup.toLowerCase().includes(search?.toLowerCase() || '')
        ))
      ).subscribe((filtered) => (this.TaxTypeFilterOption = filtered));

    }
  }
  getCeditPeriod() {
    let Supid = this.form.controls['supplier'].value
    this.service.GrnCreditPeriod(Supid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.form.controls['creditPeriod'].setValue(res[0].creditperiod)
        }
      }
    })
  }
  getCurrency() {
    this.service.GrnCurrency(this.Currid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          // alert(1)
          res.forEach((element: any) => {
            if (element.CurrID == this.Currid) {
              this.subform.controls['currency']?.setValue(res[0].CurrWord)
            }
          });
          if (this.Currid !== 1) {
            this.form.controls['exRate']?.enable()
          } else {
            this.form.controls['exRate']?.disable()
          }
        }
      }
    })
  }
  selectedTabIndex: any
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  MainTab(event: any, index: number) {
    let label = event.tab.textLabel
    console.log(this.tabGroup.selectedIndex);

  }
  clearingAgentArr: any[] = new Array()
  getClearingAgent() {
    this.service.GrnClearingAgent().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.clearingAgentArr = res
        }
      }
    })
  }
  PortArr: any[] = new Array()
  getPort() {
    this.service.GrnPort().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.PortArr = res
        }
      }
    })
  }
  LinearArr: any[] = new Array()
  getLinear() {
    this.service.GrnLinear().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.LinearArr = res
        }
      }
    })
  }
  TaxTypefilterControl = new FormControl
  taxTypeArr: any[] = new Array()
  TaxTypeFilterOption: any[] = new Array()
  gettaxType() {
    this.service.GrnTaxType().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.taxTypeArr = res
          this.TaxTypeFilterOption = res
        }
      }
    })
  }
  selectedRow: any;
  materialDataSource = new MatTableDataSource()
  materialArr: any[] = new Array()
  getMaterialTabelDet() {
    const Supid = this.form.controls['supplier'].value
    this.service.GrnMaterialTabel(Supid, this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.materialArr = res
          this.materialArr = res.map((item: any, index: number) => ({
            SNo: index + 1, // Index starts at 0, so add 1 for numbering
            ...item,
            received: '',
            Net: '',
            Select: false,
            MaterialQty: ""
          }));

          this.materialDataSource.data = [...this.materialArr]
          console.log(this.materialDataSource.data, 'GridMain');
        }
      }
    })
  }
  isNotEmpty(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }

  gateEntryNoArr: any[] = new Array()
  gateEntryNofilter = new FormControl;
  gateEntryNofilteredOptions: any[] = [];
  getGateEntryNo() {
    let Supid = this.form.controls['supplier'].value
    this.service.GrmGateEntry(Supid, this.LocationId, Supid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.gateEntryNoArr = res
          this.gateEntryNofilteredOptions = res
          if (this.gateEntryNofilteredOptions.length == 1) {
            this.form.controls['gateEntryNo'].setValue(res[0].gateentryno)
          }
        }
      }
    })
  }
  GateEntryRefNo: number = 0
  gateEntryChangeEvent() {
    if (this.form.controls['gateEntryNo'].value) {
      this.gateEntryNofilteredOptions.filter((item: any) => {
        if (item.gateentryno == this.form.controls['gateEntryNo'].value) {
          return this.GateEntryRefNo = item.GateEntry_Ref_No
        }

      })
      this.gateEntryDelay()
      this.getMaterial()
      this.form.controls['netWeight1'].disable()
      this.form.controls['Type'].setValue('single')

      this.materialDataSource.data.forEach((gridMain: any) => {
        if (this.materialDataSource.data.length > 0) {
          if (gridMain.uom == 'Ton' && (gridMain.ord_qty ? gridMain.ord_qty : 0) > 1) {
            this.form.controls['netWeight1'].disable()
            this.form.controls['netWeight'].disable()
          }
        } else if (gridMain.uom == 'Kg' && (gridMain.ord_qty ? gridMain.ord_qty : 0) > 1) {
          this.form.controls['netWeight1'].disable()
          this.form.controls['netWeight'].disable()
        } else {
          this.form.controls['netWeight1'].enable()
          this.form.controls['netWeight'].disable()
        }

      })
    }
  }
  Item: any[] = new Array()
  getMaterial() {
    let Supid = this.form.controls['supplier'].value
    this.service.GrnMaterial(Supid, this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.Item = res
          this.form.controls['Material'].setValue(this.Item[0].rawmatid)
        }
      }
    })
  }
  DcDate(e: any) {
    this.form.controls['dcDate'].setValue(e.value)
  }
  WeightDataSource = new MatTableDataSource()
  DisplayTickedNo: string = ''
  getTicketNumber() {
    let Supid = this.form.controls['supplier'].value
    let Dcdate = this.form.controls['dcDate'].value
    this.service.ticketNumber(Dcdate, this.LocationId, this.GateEntryRefNo, Supid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.TicketNumberArr = res
          if (this.TicketNumberArr.length == 1) {
            this.form.controls['ticketNo'].setValue(this.TicketNumberArr[0].id)
            this.DisplayTickedNo = this.TicketNumberArr[0].ticketnumber
            this.TicketNumberArr.forEach((item: any) => {
              if (this.selectedUom == 'Ton') {
                this.form.controls['loadWeight'].setValue(item.loadedweight / 1000)
                this.form.controls['netWeight1'].setValue(item.NetWeight / 1000)
                this.form.controls['tareWeight'].setValue(item.EmptyWeight / 1000)
                this.form.controls['netWeight'].setValue((item.NetWeight / 1000) - (this.form.controls['packingWeight'].value))
              } else {
                this.form.controls['loadWeight'].setValue(item.loadedweight)
                this.form.controls['netWeight1'].setValue(item.NetWeight)
                this.form.controls['tareWeight'].setValue(item.EmptyWeight)
                this.form.controls['netWeight'].setValue((item.NetWeight) - (this.form.controls['packingWeight'].value))
              }

            })
          }
        }
      }
    })
  }

  gateEntryDelay() {
    let GatentryNo = this.form.controls['gateEntryNo'].value
    this.service.GrnGateEntrydelayVaild(GatentryNo).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          let GateEntryDate = this.date.transform(res[0].GateEntryDate, 'yyyy-MM-dd') || ''
          this.form.controls['DcNo'].setValue(res[0].dcno)
          this.form.controls['invoiceNo'].setValue(res[0].dcno)
          this.form.controls['dcDate'].setValue(res[0].dcdate)

          this.form.controls['invoiceDate'].setValue(res[0].dcdate)
          this.form.controls['gateDate'].setValue(GateEntryDate)
          this.form.controls['vechileNo'].setValue(res[0].VechicleNo)
          const today = new Date();
          const gateDate = new Date(GateEntryDate); // Convert string to Date object

          const gateDateTime = gateDate.getTime(); // Get time in milliseconds
          const diff = Math.floor((today.getTime() - gateDateTime) / (1000 * 60 * 60 * 24));
          this.getTicketNumber()
          if (diff > 3) {
            this.Error = 'You cannot enter more than 3 day gate entry details'
            this.userHeader = 'Error'
            return this.opendialog()
          }

        }
      }
    })

  }
  selectedRawmatControl = new FormControl(null);
  selectedRawmatid: number = 0
  selectedUom: string = ''
  SelectedRow: any
  SelectedRecivedQty: number = 0
  SelectedCf: number = 0
  SelectedUomId: number = 0
  SelectedNet: Number = 0
  SelectedSNo: Number = 0
  indexSelect: number = 0
  TicketNumberArr: any[] = new Array()
  getPackingDet(row: any, Index: number) {
    this.indexSelect = Index
    if (!this.form.controls['gateEntryNo'].value) {
      this.Error = 'Please Select Gate Entry No'
      this.userHeader = 'Warning!!'
      return this.opendialog()
      // return this.form.controls['gateEntryNo'].markAllAsTouched()
    }

    if (this.materialDataSource.data.length > 0) {
      this.SelectedRow = row
      this.selectedRawmatid = row.rawmatid;
      this.selectedUom = row.uom
      this.SelectedRecivedQty = row.received
      this.SelectedCf = row.stocktopurchasecf
      this.SelectedUomId = row.stockuomid
      this.SelectedNet = row.Net
      this.SelectedSNo = Index + 1
      // this.TicketNumberArr = structuredClone(this.WeightTabelArr)
    }
  }
  PoDetailsDdatasource = new MatTableDataSource()
  ticketChangeEvent() {
    this.TicketNumberArr.filter((item: any) => {
      if (this.form.controls['ticketNo'].value == item.id) {
        this.DisplayTickedNo = item.ticketnumber
      }
    })
    this.service.GrnPackingWt(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          const NetWt = res[0].netwt
          const TareWt = res[0].tarewt
          const PackingWt = Math.round((Number(this.SelectedRecivedQty) * Number(this.SelectedRow.stocktopurchasecf)) / NetWt * TareWt)
          this.form.controls['packingWeight'].setValue(PackingWt)
        }
      }
    })
    this.TicketNumberArr.forEach((item: any) => {
      if (this.selectedUom == 'Ton') {
        this.form.controls['loadWeight'].setValue(item.loadedweight / 1000)
        this.form.controls['netWeight1'].setValue(item.NetWeight / 1000)
        this.form.controls['tareWeight'].setValue(item.EmptyWeight / 1000)
        this.form.controls['netWeight'].setValue((item.NetWeight / 1000) - (this.form.controls['packingWeight'].value))
      } else {
        this.form.controls['loadWeight'].setValue(item.loadedweight)
        this.form.controls['netWeight1'].setValue(item.NetWeight)
        this.form.controls['tareWeight'].setValue(item.EmptyWeight)
        this.form.controls['netWeight'].setValue((item.NetWeight) - (this.form.controls['packingWeight'].value))
      }

    })
  }
  PODetailChck(row: any) {
    if (Number(row.Received) > 0) {
      row.selected = row.selected ? true : false; // Allow toggle
      console.log('selected POdetalis', row);

    } else {
      if (this.TicketNumberArr.length > 0) {
        let ticketItem = this.TicketNumberArr.find((item: any) => item.id == this.form.controls['ticketNo'].value);

        if (ticketItem && ticketItem.rejinv !== 'Y') {
          row.selected = false;
          this.Error = 'For this PO, Received Qty is Zero, so you cannot select this item';
          this.userHeader = 'Information';
          return this.opendialog();
        }
      }
    }
  }



  Pdetalis: any[] = [];
  ShelflifeDatasource = new MatTableDataSource()
  NetWt: number = 0
  TareWt: number = 0
  totperc: number = 0
  tolkgs: number = 0
  penqty: number = 0
  grnqty: number = 0
  texrate: number = 0
  poDetailArr: any[] = new Array()
  selectedIndex: number | null = null;
  disabledRows: { [key: number]: boolean } = {}; // Track disabled icons per row
  disabledReceived: { [key: number]: boolean } = {};
  ReceivedIndex: number | null = null;
  disabledCheckbox: { [key: number]: boolean } = {}
  selectedCheckboxInd: number | null = null;
  POdetalis(row: any, index: number) {
    if (!this.form.controls['ticketNo'].value) {
      this.Error = 'Please Select Ticket Number'
      this.userHeader = 'Warning!!'
      return this.opendialog()
    }
    if (row.received == 0) {
      this.Error = 'Please enter the GRN Qty'
      this.userHeader = 'Warning!!'
      return this.opendialog()
    }
    if (this.materialDataSource.data.length > 0) {
      this.SelectedRow = row
      this.selectedRawmatid = row.rawmatid;
      this.selectedUom = row.uom
      this.SelectedRecivedQty = row.received
      // this.TicketNumberArr = structuredClone(this.WeightTabelArr)
    }
    this.service.GrnPackingWt1(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.NetWt = res[0].netwt
          this.TareWt = res[0].tarewt
        }
      }
    })
    this.service.GrnShelflife(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          if (res[0].shelflifeitem == 'Y') {
            this.ShelflifeDatasource.data = row
          }
        }
      }
    })
    let PackingWt: number = Math.round((Number(row.received) * Number(this.SelectedRow.stocktopurchasecf)) / this.NetWt * this.TareWt)
    if (isNaN(PackingWt)) {
      console.warn("packingWeight is NaN, using 0 instead");
      PackingWt = 0;
    }
    this.form.controls['packingWeight'].setValue(PackingWt)
    this.form.controls['netWeight'].setValue((Number(this.form.controls['netWeight1'].value)) - (Number(this.form.controls['packingWeight'].value)))
    this.service.GrnInspecReq(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          if (res[0].InspecReq == 1) {
            this.subform.controls['qcReq'].setValue('')
            this.subform.controls['qcReq'].disable()
            // this.ShelflifeDatasource.data=row
          } else {
            this.subform.controls['qcReq'].setValue('')
            this.subform.controls['qcReq'].enable()
          }
        }
      }
    })
    if (this.Item.length > 0) {
      let Supid = this.form.controls['supplier'].value
      let rawmatId = this.form.controls['Material'].value
      this.service.GrnTolType(rawmatId, Supid).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            if (res[0].toltype == 'P') {
              this.totperc = res[0].totvalue
            }
            if (res[0].toltype == 'W') {
              this.tolkgs = res[0].totvalue
            }
          }
        }
      })

      if (this.Currid === 1 && this.subform.controls['exrate']?.value === 1) {
        this.Error = 'Exchange Rate cannot be 1 Rupee'
        this.userHeader = 'Warning!!'
        return this.opendialog()
      }
      this.service.GrnPoDetailTable(Supid, rawmatId, this.LocationId).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status === 'N') {
              this.Error = res[0].Msg;
              this.userHeader = 'Error';
              return this.opendialog();
            }
            this.poDetailArr = res;

            this.subform.controls['rate'].setValue(res[0].rate);
            this.totperc = res[0].percofexcp;
            this.tolkgs = res[0].tolerancekgs;
            this.subform.controls['exRate'].setValue(this.Currid > 1 ? res[0].exrate : 1);

            this.penqty = Number(this.form.controls['netWeight'].value) * Number(row?.stocktopurchasecf);
            this.grnqty = Number(this.SelectedRecivedQty) * Number(row?.stocktopurchasecf);

            let ExcessVal: any = 0
            let ReceivedVal = 0;
            let GRNQtyVal = 0;
            let DiffValue = 0;
            let ToleranceVal: any = 0
            let DebitVal: any = 0
            let totdif = 0;
            let tottol = 0;
            let tottoal: any = 0;
            this.Pdetalis = []
            for (let element of this.poDetailArr) {
              ReceivedVal = 0;
              GRNQtyVal = 0;
              DiffValue = 0;
              ToleranceVal = 0
              DebitVal = 0
              if (element.pending > 0) {

                let FreightVal = element.freight && element.ord_qty ? Number(element.freight) / Number(element.ord_qty) : 0;
                let ActFreightVal = (Math.round(Number(element.freight || 0) / Number(element.ord_qty || 1))).toFixed(2);

                if (this.form.controls['supplierRate'].value === 0) {
                  this.form.controls['supplierRate'].setValue(element.rate);
                }

                const disc = element.disc ? Number(element.disc) : 0;
                let GRateVal = Number(element.rate) - (Number(element.rate) * (disc > 0 ? disc / 100 : 0));
                this.form.controls['supplierRate'].setValue(GRateVal);
                this.subform.controls['rate'].setValue(GRateVal);
                this.texrate = this.subform.controls['rate'].value;

                if (Number(this.penqty) > 0) {
                  if (element.pending > this.penqty) {
                    ReceivedVal = this.penqty;
                    this.penqty = 0;
                  } else {
                    if ((Number(this.form.controls['netWeight'].value) * Number(row?.stocktopurchasecf)) > 0) {
                      ReceivedVal = element.pending;
                      this.penqty -= element.pending;
                    }

                  }
                }
                if (this.grnqty > 0) {
                  if (element.pending > this.grnqty) {
                    GRNQtyVal = this.grnqty;
                    this.grnqty = 0;
                  } else {
                    GRNQtyVal = element.pending;
                    this.grnqty -= element.pending;
                  }
                }
                // DebitVal = (Number(this.form.controls['netWeight1'].value) * element.PercofExcp) / 100
                // DebitVal = Math.abs((Number(GRNQtyVal) - Number(ReceivedVal)) - DebitVal)

                if (element.PercofExcp > 0) {
                  DiffValue = Number(GRNQtyVal) - Number(ReceivedVal)
                }

                this.Pdetalis.push({
                  selected: false,
                  poid: element.poid,
                  uom: element.UOM,
                  pono: element.pono,
                  podate: this.date.transform(element.podate, 'yyyy-MM-dd'),
                  poproductid: element.poproductid,
                  ord_qty: element.ord_qty,
                  grnqty: element.grnqty,
                  rejqty: element.rejqty,
                  pending: element.pending,
                  rate: Number(element.rate).toFixed(3),
                  Received: ReceivedVal,
                  postingaccountid: element.postingaccountid,
                  RateInclusiveOfAllTaxes: element.RateInclusiveOfAllTaxes,
                  disc: element.disc,
                  StockToPurchaseCF: element.StockToPurchaseCF,
                  Pack: element.pack,
                  ExRate: element.exrate,
                  GRate: Number(GRateVal),
                  GRNQty: GRNQtyVal,
                  Diff: DiffValue,
                  Debit: DebitVal,
                  Excess: ExcessVal,
                  Tolerance: ToleranceVal,
                  Freight: FreightVal,
                  ActFreight: Number(ActFreightVal)
                });
              }
              this.PoDetailsDdatasource.data = [...this.Pdetalis];
            }
            if (Number(this.form.controls['netWeight'].value) * Number(this.SelectedRow.stocktopurchasecf) > (Number(this.SelectedRecivedQty) * Number(this.SelectedRow.stocktopurchasecf))) {
              if (this.PoDetailsDdatasource.data.length > 1) {
                for (let item of this.Pdetalis) {
                  item.Excess = (Number(this.form.controls['netWeight'].value) * Number(this.SelectedRow.stocktopurchasecf)) - (Number(this.SelectedRecivedQty) * Number(this.SelectedRow.stocktopurchasecf))
                  break
                }

              }
            }
            // if (this.Pdetalis.length > 0) {

            // }

            if (Number(this.form.controls['netWeight'].value) * Number(this.SelectedRow.stocktopurchasecf) < (Number(this.SelectedRecivedQty) * Number(this.SelectedRow.stocktopurchasecf))) {
              if (this.penqty > 0) {
                this.Error = 'Received Qty and Po Qty is not match. Please raise Po for Excess Qty'
                this.userHeader = 'Warning!!'
                this.opendialog()
                this.Pdetalis.forEach((item: any) => {
                  item.Received = 0
                  item.GRNQty = 0
                  item.Diff = 0
                })
              }
              totdif = Number(this.SelectedRecivedQty) - Number(this.form.controls['netWeight'].value)
              if (this.totperc) {
                tottoal = Math.round((Number(this.form.controls['netWeight'].value) * this.totperc / 100)).toFixed(3)
              }
              if (this.tolkgs > 0) {
                tottoal = this.tolkgs
              }
              if (Number(this.SelectedRecivedQty) > 1000) {
                if (Number(totdif) > Number(tottoal)) {
                  if (ReceivedVal > 0) {
                    this.Pdetalis.forEach((item: any) => {
                      item.Tolerance = Math.round(((Number(tottoal)) / (Number(this.form.controls['netWeight'].value))) * ReceivedVal).toFixed(3)
                      item.Debit = Math.round((Number(totdif) - Number(tottoal)) / (Number(this.form.controls['netWeight'].value) * ReceivedVal)).toFixed(3)
                    })
                  }
                }
              } else {
                if (Number(ReceivedVal) > 0) {
                  this.Pdetalis.forEach((item: any) => {
                    item.Tolerance = Math.round(((Number(tottoal)) / (Number(this.form.controls['netWeight'].value))) * ReceivedVal).toFixed(3)
                    item.Debit = Math.round(((Number(totdif)) / (Number(this.form.controls['netWeight'].value))) * ReceivedVal).toFixed(3)
                  })
                }
              }
              if (Number(totdif) <= Number(tottoal)) {
                this.userHeader = 'Shall I split the tolerance Qty po wise'
                this.userHeader = 'Warning!!!'
                this.opendialog()
                this.dialogRef.afterClosed().subscribe((res: any) => {
                  if (res) {
                    if (Number(ReceivedVal) > 0) {
                      this.Pdetalis.forEach((item: any) => {
                        item.Tolerance = Math.round(((Number(totdif)) / (Number(this.form.controls['netWeight'].value))) * ReceivedVal).toFixed(2)
                      })
                    }
                  }
                })
              }
            }
            let remainingReceived = this.SelectedRecivedQty; // Total Received amount

            this.PoDetailsDdatasource.data.forEach((item: any) => {
              if (remainingReceived > 0) {
                if (remainingReceived >= item.pending) {
                  item.selected = true; // Select the entire row
                  remainingReceived -= item.pending; // Deduct pending amount from remainingReceived
                } else {
                  item.selected = true; // Partially select this row
                  remainingReceived = 0; // Stop as we've used up all Received
                }
              }
            });

            console.log(this.PoDetailsDdatasource.data, 'podeatlis');
          }
        }
      });
    }

    // --Disable SlectedIndex
    const totalRows = this.materialDataSource.data.length; // Replace with your actual row count
    for (let i = 0; i < totalRows; i++) {
      this.disabledRows[i] = true;
    }
    this.selectedIndex = null;
    // --Disable DeleteBtn
    this.DeleteselectedIndex = index;
    if (this.DeleteselectedIndex !== null) {
      this.disabledDeleteRows[this.DeleteselectedIndex] = true;
      this.DeleteselectedIndex = null;
    }
    // --Disable RecivedQty Input box
    this.ReceivedIndex = index;
    if (this.ReceivedIndex !== null) {
      this.disabledReceived[this.ReceivedIndex] = true;
      this.ReceivedIndex = null;
    }
    // --Disable CheckBox
    this.selectedCheckboxInd = index
    if (this.selectedCheckboxInd != null) {
      this.disabledCheckbox[this.selectedCheckboxInd] = true
      this.selectedCheckboxInd = null
    }
    this.okBtn = true
    this.Splibtn = true
    this.ptcdTab = true
    this.tabGroup.selectedIndex = 0
  }


  PoScheduledatasource = new MatTableDataSource()
  View() {
    let PdSelect = this.Pdetalis.filter((item: any) => item.selected)
    if (PdSelect.length == 0) {
      this.Error = 'Please Select Atleat One PoDeatail'
      this.userHeader = 'Error'
      return this.opendialog()
    }
    if (!Number(this.form.controls['supplierRate'].value)) {
      this.Error = 'Please enter the Bill Rate ...'
      this.userHeader = 'Error'
      return this.opendialog()
    }

    let SelectedArr: any = this.Pdetalis.filter((item: any) => item.selected)
    SelectedArr.forEach((Selected: any) => {
      if (SelectedArr.length > 0) {
        if (this.subform.controls['exRate'].value > 0) {
          this.subform.controls['exRate'].disable()
        }
        this.subform.controls['exRate'].enable()
        //
        this.service.GrnTransport(Selected.poid).subscribe({
          next: (res: any) => {
            if (res.length > 0) {
              if (res[0].status === 'N') {
                this.Error = res[0].Msg;
                this.userHeader = 'Error';
                return this.opendialog();
              }
              this.service.GrnTransname(res[0].transporterid).subscribe({
                next: (res: any) => {
                  if (res.length > 0) {
                    if (res[0].status === 'N') {
                      this.Error = res[0].Msg;
                      this.userHeader = 'Error';
                      return this.opendialog();
                    }
                    this.SupName.setValue(res[0].supname)
                  }
                }
              })
              this.service.Grnfrincl(Selected.poid).subscribe({
                next: (res: any) => {
                  if (res.length > 0) {
                    if (res[0].status === 'N') {
                      this.Error = res[0].Msg;
                      this.userHeader = 'Error';
                      return this.opendialog();
                    }
                    this.form.controls['frieghtIncl'].setValue(res[0].freight_incl)
                  }
                }
              })
            } else {
              this.SupName.setValue('')
              this.form.controls['frieghtIncl'].setValue('')
            }
          }
        })
        this.subform.controls['rate'].setValue(this.form.controls['supplierRate'].value)

      } else {
        this.Error = 'Please select PO No'
        this.userHeader = 'Warning!!'
        return this.opendialog()
      }
    });
    this.getPoSchedule()
    this.getPtcd()
    this.Splibtn = false
  }
  getPoSchedule() {
    let Selectedpoproductid: any = this.Pdetalis.filter((item: any) => item.selected)
      .map((item: any) => item.poproductid)
    let totdif = 0
    totdif = Number(this.SelectedRecivedQty) - Number(this.form.controls['netWeight1'].value)
    this.service.GrnPoschedule(Selectedpoproductid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            return this.opendialog();
          }
          let arr = {
            Adjust: '',
            Excess: '',
            Soratge: '',
            DebitQty: 0,
            Nrate: 0
          }
          res.forEach((element: any) => {
            Object.assign(arr, element)
          });
          res.forEach((element: any) => {
            if (Number(totdif) < Number(element.balqty)) {
              element.DebitQty = Number(element.balqty) + Number(totdif)
            } else {
              element.DebitQty = Number(element.balqty) + Number(totdif)
              totdif = Number(totdif) - Number(element.balqty)
            }
          });
          this.PoScheduledatasource.data = res
          this.PoScheduledatasource.data = [...this.PoScheduledatasource.data]
          console.log(this.PoScheduledatasource.data, 'POschdeule');
        }
      }
    })
  }
  PtcdDataSource = new MatTableDataSource()
  ptcdArr: any[] = []
  getPtcd() {
    let rawmatId = this.form.controls['Material'].value
    let Selectedpoid: any = this.Pdetalis.filter((item: any) => item.selected)
      .map((item: any) => item.poid)
    this.service.GrnTax(rawmatId, Selectedpoid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            return this.opendialog();
          }

          let arrList = res.map((element: any) => ({
            value: this.form.controls['netWeight'].value > 0 ? this.form.controls['netWeight'].value : 0,
            incluSIVE: '',
            CHTRAN: '',
            ...element
          }));

          this.ptcdArr = arrList
          this.PtcdDataSource.data = this.ptcdArr
          this.PtcdDataSource.data = [... this.PtcdDataSource.data]
          this.service.GrnRateInclusiveOfAllTaxes(Selectedpoid).subscribe((res: any) => {
            if (res.length > 0) {
              if (res[0].status === 'N') {
                this.Error = res[0].Msg;
                this.userHeader = 'Error';
                return this.opendialog();
              }
              this.PtcdDataSource.data = this.PtcdDataSource.data.map((element: any) => ({
                ...element,
                incluSIVE: res[0].RateInclusiveOfAllTaxes
              }));

              this.PtcdDataSource.data = [...this.PtcdDataSource.data]
              console.log(this.PtcdDataSource.data, 'ptcd');
            }
          })
        }

      }
    })

  }
  ptcdTab = true
  Split() {
    let tolqty = 0
    let totq: any = 0
    let balq: any = 0
    this.Pdetalis.forEach((pdDet: any) => {
      if (pdDet.selected == true) {
        if (Number(pdDet.Received) < Number(pdDet.GRNQty)) {
          balq = balq + Math.round(pdDet.Received).toFixed(3)
        } else {
          balq = balq + Math.round(pdDet.GRNQty).toFixed(3)
        }
      }
    })
    if (Number(balq) == 0) {
      this.Error = 'Please Enter Accepted Quantity'
      this.userHeader = 'Warning!!'
      return this.opendialog()
    }
    totq = 0
    this.PoScheduledatasource.data.forEach((POsch: any) => {
      totq = totq + Math.round(Number(POsch.balqty)).toFixed(2)
      if (Number(balq) <= Number(POsch.balqty)) {
        POsch.Adjust = Number(balq)
        balq = Math.round(balq - Number(POsch.balqty)).toFixed(2)
        return
      } else {
        POsch.Adjust = Math.round(Number(POsch.balqty))
        balq = Math.round(balq - Math.round(Number(POsch.balqty))).toFixed(2)
      }
      if (balq = 0) return
      if (totq == this.form.controls['netWeight'].value) return
    });
    let rawmatId = this.form.controls['Material'].value
    this.service.Splitvaild(rawmatId).subscribe((res: any) => {
      if (res.length > 0) {
        if (res[0].staus == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          return this.opendialog()
        }
        if (res[0].percofexcp > 0) {
          tolqty = (Number(this.form.controls['netWeight'].value) * Number(res[0].StockToPurchaseCF) * Number(res[0].percofexcp) / 100)
        }
        if (res[0].tolerancekgs > 0) {
          tolqty = (Number(res[0].tolerancekgs))
        }
      }
    })
    let Supid = this.form.controls['supplier'].value
    this.service.GrnTolType(rawmatId, Supid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          if (res[0].toltype == 'P') {
            tolqty = (Number(this.form.controls['netWeight'].value) * Number(res[0].StockToPurchaseCF) * Number(res[0].totvalue) / 100)
          }
          if (res[0].toltype == 'W') {
            tolqty = res[0].totvalue
          }
        }
      }
    })
    if (this.form.controls['netWeight'].value > 0) {
      balq = Number(balq) - Number(tolqty)
      if (balq > 0) {
        this.PoScheduledatasource.data.forEach((posch: any) => {
          posch.Adjust = 0
        })
        this.Error = 'Received Quantity is Greater than PO Qty. Please raise PO for Balance Quantity = ' + balq + 'Insufficient PO Qty '
        this.userHeader = 'Error'
        return this.opendialog()
      }
    }
    this.ptcdTab = false

  }
  Savebtn: boolean = true
  totqt: any = 0
  Calculate() {
    let totv: any = 0
    let totpack = 0
    let gvalue = 0
    if (this.PoScheduledatasource.data.length > 0) {
      this.PoScheduledatasource.data.forEach((Posch: any) => {
        gvalue = 0
        if (Posch.rate > 0) {
          if (Posch.disc > 0) {
            gvalue = Number(Posch.rate) - Number(Posch.rate) * Number(Posch.disc)
            gvalue = Number(gvalue) / Number(Posch.StockToPurchaseCF)
            totv = Number(totv) + Number(Posch.Adjust)
            this.totqt = Number(this.totqt) + Number(Posch.Adjust)
            totpack = Number(Posch.packing)
          } else {
            if (this.subform.controls['exRate'].value == 0) {
              totv = Number(totv) + Number(Posch.Adjust) * Number(Posch.rate)
            } else {
              totv = (Number(totv) + Math.round(Number(Posch.Adjust)) * (Number(Posch.rate) * Number(this.subform.controls['exRate'].value))).toFixed(2)
              totpack = Number(Posch.packing)
              this.totqt = this.totqt + Number(Posch.Adjust)
            }
          }
        }
      })
    }
    totv = 0
    gvalue = 0
    this.totqt = 0

    this.Pdetalis.forEach((poDet: any) => {
      if (poDet.selected == true) {
        gvalue = Number(poDet.GRNQty) * Number(poDet.GRate)
        totv = Number(totv) + Number(gvalue)
        this.totqt = this.totqt + Number(poDet.GRNQty)
      }
    })
    totv = (totv).toFixed(2)
    let taxv = 0
    let taxv1 = 0
    totv = Number(totv)
    this.PtcdForm.controls['poValue'].setValue(totv)
    this.PtcdForm.controls['subValue'].setValue(Math.round(Number(this.totqt) * (this.form.controls['supplierRate'].value) / Number(this.SelectedCf)))
    taxv = totv
    this.PtcdForm.controls['subValue'].setValue(this.PtcdForm.controls['poValue'].value)
    let taxfv = 0
    let cid = 0
    let packvalue = 0
    let incluSIVEVal: any = 0
    this.PtcdDataSource.data.forEach((ptcd: any, index) => {
      if (ptcd.taxid === 89) {
        if (totpack > 0) {
          ptcd.quantity = Math.round(totpack)
          ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
          ptcd.rate = Math.round(totpack)
          ptcd.rate = Math.floor(ptcd.rate * 100) / 100
          packvalue = ptcd.quantity
        }
      }
      if (index == 0 && ptcd.defaultvalue == 0 && ptcd.additional == 'N') {
        incluSIVEVal = this.Pdetalis.filter((item: any, index) => item.selected)
          .map((item: any) => item.RateInclusiveOfAllTaxes)
        if (incluSIVEVal == 'N') {
          if (ptcd.incluSIVE == 'N') {
            if (ptcd.taxid != 89) {
              taxv = Number(ptcd.quantity) / Number(this.SelectedCf)
              taxv1 = Number(ptcd.rate) / Number(this.SelectedCf)
            }
          }
          // GoTo exF
          this.Calculatefun()
          return
        }
      } else {
        if (index == 0 && ptcd.additional == 'N' && ptcd.defaultvalue != 0) {
          taxv = this.PtcdForm.controls['poValue'].value
          taxv1 = this.PtcdForm.controls['subValue'].value


          ptcd.quantity = ((taxv + packvalue) * (ptcd.defaultvalue) / 100)
          ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
          ptcd.rate = ((taxv1 + packvalue) * (ptcd.defaultvalue) / 100)
          ptcd.rate = Math.floor(ptcd.rate * 100) / 100
          ptcd.value = (Number(taxv))
          this.Calculatefun()
          return
        }
      }
      cid = ptcd.taxcatid
      if (ptcd.defaultvalue != 0) {
        if (cid == ptcd.taxcatid - 1) {
          if (ptcd.additional == 'N') {
            ptcd.quantity = ((Number(taxv) + Number(packvalue)) * Number(ptcd.defaultvalue) / 100)
            ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
            taxfv = ptcd.quantity
            taxv = ptcd.quantity
            taxv1 = ptcd.rate
          } else {
            taxv = 0
            taxv1 = 0
            for (let j = 0; j < ptcd; j++) {
              if (ptcd.taxid != 89) {
                if (ptcd.additional == 'N') {
                  taxv = ptcd.quantity
                  taxv1 = ptcd.rate
                }
              }
            }
            ptcd.quantity = ((Number(taxv)) * Number(ptcd.defaultvalue) / 100)
            ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
            ptcd.rate = ((Number(taxv1)) * Number(ptcd.defaultvalue) / 100)
            ptcd.rate = Math.floor(ptcd.rate * 100) / 100
            ptcd.value = (Number(taxv))
            this.Calculatefun()
            return
          }
        } else {
          taxv = 0
          taxv1 = 0
          taxv = this.PtcdForm.controls['poValue'].value
          taxv1 = this.PtcdForm.controls['subValue'].value
          for (let j = 0; j < ptcd; j++) {
            if (incluSIVEVal == 'N') {
              taxv = ptcd.quantity
              taxv1 = ptcd.rate
            }
          }
          ptcd.quantity = (taxv * ptcd.defaultvalue / 100)
          ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
          ptcd.rate = ((Number(taxv1)) * Number(ptcd.defaultvalue) / 100)
          ptcd.rate = Math.floor(ptcd.rate * 100) / 100
          ptcd.value = (Number(taxv))
        }
      } else {
        if (ptcd.additional == 'N') {
          taxv = ptcd.quantity
          taxv1 = ptcd.rate
        }
      }
    })
    this.okBtn = false
  }
  okBtn = true
  Calculatefun() {
    let totbasic: any = 0
    let totbasic1: any = 0
    let ttbas: any = 0
    let ttbas1: any = 0
    let Frieght: any = this.PoDetailsDdatasource.data
      .filter((podetails: any) => podetails.selected.length > 0)
      .map((podetails: any) => podetails.selected[0]?.Freight)[0]

    let selectedData = this.materialDataSource.data.filter((gridMain: any) => gridMain.Select.length > 0);

    let stocktopurchasecf: any = selectedData.map((gridMain: any) => gridMain.stocktopurchasecf);
    let uom: any = selectedData.map((gridMain: any) => gridMain.uom);

    this.PtcdDataSource.data.forEach((ptcd: any) => {
      if (ptcd.istax === 'N' && ptcd.amount_338 > 0 && ptcd.taxid !== 89) {
        if (ptcd.taxid !== 90) {
          ptcd.quantity = Frieght * this.totqt
          ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
          ptcd.rate = Frieght * this.totqt
          ptcd.rate = Math.floor(ptcd.rate * 100) / 100
        }
      }
      if (ptcd.FVALUE > 0 && ptcd.ISTAX == 'N') {
        ptcd.quantity = Math.round((ptcd.FVALUE * this.totqt) / stocktopurchasecf)
        ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
        ptcd.rate = Math.round((ptcd.FVALUE * this.totqt) / stocktopurchasecf)
        ptcd.rate = Math.floor(ptcd.rate * 100) / 100
      }
      if (ptcd.taxid == 90 && (uom !== 'Ton' || uom == 'Ton')) {
        let frval = 0
        this.materialDataSource.data.forEach((GridMain: any) => {
          if (GridMain.Select == 'True') {
            if (frval = 0) {
              frval = Frieght
            }
          }
        })
        ptcd.quantity = Math.round(frval * this.SelectedRecivedQty)
        ptcd.quantity = Math.floor(ptcd.quantity * 100) / 100
        ptcd.rate = Math.round(frval * this.SelectedRecivedQty)
        ptcd.rate = Math.floor(ptcd.rate * 100) / 100
      }
      ptcd.CHTRAN = 'N'
    })


    this.PtcdDataSource.data.forEach((ptcd: any) => {
      if (ptcd.taxcatid !== 24) {
        if (ptcd.taxid == 90 && (this.form.controls['frieghtIncl'].value == 'Y' || this.form.controls['frieghtIncl'].value == "")) {
          totbasic = totbasic + ptcd.quantity
          totbasic1 = totbasic1 + ptcd.rate
        } else if (ptcd.taxid !== 90) {
          totbasic = totbasic + ptcd.quantity
          totbasic1 = totbasic1 + ptcd.rate
        }
      }
    })
    this.PtcdDataSource.data.forEach((ptcd: any) => {
      if (ptcd.taxcatid == 24) {
        let rawQuantity: any = ((this.PtcdForm.controls['poValue'].value + totbasic) * ptcd.defaultvalue) / 100;
        ptcd.quantity = Math.floor(rawQuantity * 100) / 100

        ptcd.rate = ((this.PtcdForm.controls['poValue'].value + totbasic1) * ptcd.defaultvalue / 100)
        ptcd.rate = Math.floor(ptcd.rate * 100) / 100

        ttbas = Number(ttbas) + Number(ptcd.quantity)
        ttbas1 = ttbas + ptcd.rate
      }
    })

    totbasic = (Number(totbasic) + Number(ttbas))
    totbasic1 = totbasic1 + ttbas1
    this.grandTotal.setValue(totbasic)
    this.PtcdDataSource.data = [...this.PtcdDataSource.data]

  }
  PoUpdDetail: any[] = new Array()
  dtot: any = 0
  ind: number = 0
  Ok() {
    let dtot: any = 0
    let totqty: any = 0
    let dtot1: any = 0
    let dtot2: any = 0
    let inclv_d: any = 0
    let g_v: any = 0
    let lrate: any = 0
    let lrate1: any = 0
    // let i=0
    // this.PoUpdDetail = []
    this.PoDetailsDdatasource.data.forEach((podetail: any) => {
      let gbasicpriceVal: any = 0
      if (podetail.selected === true && podetail.GRNQty > 0) {
        ++this.ind
        this.PoUpdDetail.push({
          Sno: this.ind,
          poproductid: podetail.poproductid,
          mfgdate: podetail.mfgdate ? podetail.mfgdate : null,
          exrate: (this.Currid == 1 ? 1 : this.subform.controls['exRate'].value).toFixed(3),
          poqty: Math.round(podetail.Received ? podetail.Received : 0).toFixed(3),
          tolerance: (podetail.Tolerance ? podetail.Tolerance : 0).toFixed(3),
          poid: podetail.poid,
          poconv: (podetail.StockToPurchaseCF ? podetail.StockToPurchaseCF : 1).toFixed(2),
          qcreq: this.subform.controls['qcReq'].value == true ? 'Y' : 'N',
          excessqty: (podetail.Excess ? podetail.Excess : 0).toFixed(3),
          sortageqty: (podetail.Debit ? podetail.Debit : 0).toFixed(3),
          billedqty: (podetail.GRNQty ? podetail.GRNQty : 0).toFixed(3),
          suprate: (podetail.suprate ? podetail.suprate : 0).toFixed(3),
          batchno: podetail.batchno ? podetail.batchno : '',
          basicprice: '',
          supbasicprice: '',
          postingaccountid: podetail.postingaccountid,
          rawmatid: this.selectedRawmatid,
          uomid: this.SelectedUomId,
          rate: '',
          supgrate: '',
          grossv: '',
          delsched: '',
          schedqty: '',
          debitqty: '',
          taxid: '',
          taxvalue: '',
          taxamount: '',
          suptaxamount: '',
          priority: '',
          invamount: '',
          Ptcdpostingaccountid: ''
        })
        this.PoUpdDetail.forEach((Update: any) => {
          if (podetail.disc > 0) {
            Update.basicprice = Math.round((Number(podetail.rate) - ((Number(podetail.rate) * (Number(podetail.Received)) / 100)))).toFixed(3)
            dtot = Math.floor(Update.basicprice * 100) / 100
            gbasicpriceVal = Math.round((Number(podetail.rate) - ((Number(podetail.rate) * (Number(podetail.Received)) / 100)))).toFixed(3)
            dtot = Math.floor(gbasicpriceVal * 100) / 100
            Update.supbasicprice = this.form.controls['supplierRate'].value
          } else {
            Update.basicprice = podetail.rate
            gbasicpriceVal = podetail.rate
            Update.supbasicprice = this.form.controls['supplierRate'].value
          }
          totqty = totqty + podetail.GRNQty
          if (podetail.disc > 0) {
            dtot = dtot + Math.round((Number(podetail.GRNQty) * (Number(podetail.rate) - Number(podetail.rate)) * (Number(podetail.disc) / 100))).toFixed(3)
          } else {
            if (this.subform.controls['exRate'].value == 0) {
              dtot = dtot + (Math.round((Number(podetail.rate) * Number(podetail.GRNQty))))
              dtot = Math.floor(dtot * 100) / 100
            } else {
              dtot = dtot + ((Number(podetail.rate) * Number(podetail.GRNQty) * this.subform.controls['exRate'].value))
            }
          }
          if (podetail.RateInclusiveOfAllTaxes === 'N') {
            this.PtcdDataSource.data.forEach((ptcd: any) => {
              if (ptcd.CHTRAN != 'Y') {
                if (ptcd.incluSIVE == 'N') {
                  dtot1 = dtot1 + Number(ptcd.quantity)
                  dtot2 = dtot2 + Number(ptcd.rate)
                  inclv_d = 0
                }
                ptcd.CHTRAN = 'Y'
              }
            });
          } else {
            let dtott1: any = 0
            let dtott2: any = 0
            this.PtcdDataSource.data.forEach((ptcd: any) => {
              if (Number(ptcd.taxcatid == 3) && ptcd.CHTRAN != 'Y') {
                if (ptcd.incluSIVE == 'Y') {
                  dtott1 = dtott1 + Number(ptcd.quantity)
                  dtott2 = dtott2 + Number(ptcd.rate)
                  inclv_d = 1
                }
                ptcd.CHTRAN = 'Y'
              }
            });
            if (dtott1 > 0) {
              Update.basicprice = gbasicpriceVal - (dtott1 / totqty)
              Update.supbasicprice = gbasicpriceVal
            }

            this.PtcdDataSource.data.forEach((ptcd: any) => {
              if (Number(ptcd.taxcatid === 9) && ptcd.CHTRAN != 'Y') {
                if (ptcd.incluSIVE == 'N') {
                  dtot1 = dtot1 + Number(ptcd.quantity)
                  dtot2 = dtot2 + Number(ptcd.rate)
                }
                ptcd.CHTRAN = 'Y'
              }
            });
            dtot = dtot + dtot1
          }
          if (this.subform.controls['exRate'].value > 0) {
            if (Update.poproductid) {
              Update.exrate = ((this.subform.controls['exRate'].value)).toFixed(2)
            }
          }
        })
      }
    });


    if (inclv_d == 0) {
      dtot = dtot + dtot1
    } else { dtot = dtot }

    let lratett: any = 0
    g_v = dtot1
    dtot1 = dtot1 / totqty
    dtot2 = dtot2 / totqty
    lrate = Math.floor((dtot / totqty) * 100) / 100;
    lratett = Math.floor(dtot / totqty * 100) / 100;
    lrate1 = dtot2 + this.form.controls['supplierRate'].value
    this.PoUpdDetail.forEach((update: any) => {
      if (update.rawmatid) {
        update.rate = lrate
        update.supgrate = lrate1
        update.grossv = lrate
      }
    })
    let updatedValue = this.PoUpdDetail.map((item: any) => ({
      poproductid: item.poproductid,
      rate: item.rate
    }));
    for (let L = 0; L < updatedValue.length; L++) {
      this.PoDetailsDdatasource.data.forEach((podetail: any) => {
        if (podetail.poproductid == updatedValue[L].poproductid) {
          podetail.GRate = updatedValue[L].rate
        }
      })
    }
    console.log(this.PoUpdDetail, 'podetail');

    let netval: any = 0
    let pvalue = Math.floor(totqty * this.form.controls['supplierRate'].value * 100) / 100

    this.materialDataSource.data.forEach((item: any, index: number) => {
      if (item.Select === false) {
        this.disabledRows[index] = false;
      }
    });
    this.materialDataSource.data.forEach((gridMain: any) => {

      if (typeof gridMain.MaterialQty == "string" || gridMain.MaterialQty === null) {
        gridMain.MaterialQty = {}; // Convert empty string to an object
      }
      if (gridMain.Select == true) {
        gridMain.MaterialQty = totqty;
      } else {
        gridMain.MaterialQty = ''
      }

    });

    this.PtcdDataSource.data.forEach((ptcd: any) => {
      this.PoDetailsDdatasource.data.forEach((podetail: any) => {
        if (podetail.selected == true) {

          this.PoUpdDetail.forEach((update: any) => {
            update.taxid = ptcd.taxid
            update.taxvalue = ((ptcd.defaultvalue)).toFixed(2)
            update.taxamount = ((ptcd.rate / this.SelectedRecivedQty) * (podetail.GRNQty * podetail.StockToPurchaseCF))
            update.taxamount = (Math.floor(update.taxamount * 100) / 100).toFixed(2)
            update.suptaxamount = Math.round((ptcd.rate / this.SelectedRecivedQty) * (podetail.GRNQty * podetail.StockToPurchaseCF))
            update.suptaxamount = (Math.floor(update.suptaxamount * 100) / 100).toFixed(2)
            update.priority = ptcd.priority
            update.invamount = Math.floor((ptcd.value / this.SelectedRecivedQty) * (podetail.GRNQty * podetail.StockToPurchaseCF))
            update.invamount = (Math.floor(update.invamount * 100) / 100).toFixed(2)
            update.Ptcdpostingaccountid = ptcd.postingaccountid
          })
          netval = netval + ptcd.value
          if (podetail.RateInclusiveOfAllTaxes == 'Y') {
            if (ptcd.taxcatid == 9 && ptcd.CHTRAN == 'Y') {
              if (ptcd.incluSIVE == 'N') {


                pvalue = pvalue + ptcd.rate
              }
              ptcd.CHTRAN = 'N'
            }
          } else {
            if (ptcd.CHTRAN = 'Y') {
              if (ptcd.incluSIVE == 'N') {
                console.log(pvalue, ptcd.rate);
                pvalue = pvalue + ptcd.rate
              }
              ptcd.CHTRAN = 'N'
            }
          }
        }
      })
    })
    console.log(this.PoUpdDetail, 'ptcd');
    this.grandTotal.setValue(pvalue)
    this.SelectedNet = netval + this.PtcdForm.controls['poValue'].value
    this.PoScheduledatasource.data.forEach((posch: any) => {
      this.PoUpdDetail.forEach((update: any) => {
        update.delsched = posch.podespatchid
        update.schedqty = ((posch.Adjust)).toFixed(2)
        update.debitqty = ((posch.DebitQty - posch.balqty)).toFixed(2)
      })
    })

    let grossv: any = 0; // Initialize total
    let tottax: any = 0
    this.PoUpdDetail.forEach((item: any) => {
      let basicPrice = item.basicprice ?? 0; // Handle nulls
      let billedQty = item.billedqty ?? 0; // Handle nulls
      grossv += basicPrice * billedQty; // Accumulate total
      grossv = (Math.floor(grossv * 100) / 100).toFixed(2)
      let taxamount = item.taxamount ?? 0
      tottax += taxamount
      tottax = (Math.floor(tottax * 100) / 100).toFixed(2)
    });
    this.grandTotal.setValue(Number(grossv) + Number(tottax))

    console.log(this.PoUpdDetail, 'final');
    if (this.selectedIndex !== null) {
      this.disabledRows[this.selectedIndex] = true; // Disable only the selected row
      this.selectedIndex = null; // Reset selected index
    }

    this.materialDataSource.data.forEach((item: any, index: number) => {
      if (item.Select === false) {
        this.disabledRows[index] = false;
      }
    });
    this.okBtn = true
    this.tabGroup.selectedIndex = 0
  }
  DeleteselectedIndex: number | null = null;
  disabledDeleteRows: { [key: number]: boolean } = {};
  DeletePODetail(row: any, index: number) {
    this.Error = 'Do You Want To Delete'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.PoUpdDetail = this.PoUpdDetail.filter((element: any) => element.Sno !== row.SNo);
        this.disabledRows[index] = false;
        this.disabledReceived[index] = false
        this.disabledCheckbox[index] = false
        console.log(this.PoUpdDetail);
        this.PoDetailsDdatasource.data = []
        this.PoScheduledatasource.data = []
        this.PtcdDataSource.data = []
        this.grandTotal.setValue('')
        this.SupName.setValue('')
        this.okBtn = true
        this.Splibtn = true
        this.ptcdTab = true
        this.tabGroup.selectedIndex = 0
        this.PtcdForm.controls['poValue'].setValue('')
        this.PtcdForm.controls['subValue'].setValue('')
      } else {
        this.Error = 'Delete Cancelled'
        this.userHeader = 'Information'
        return this.opendialog()
      }
    })
  }

  getMailLIst() {
    let GrnRefNo = this.form.controls['grnRefNo'].value
    let QcReqstatus = this.subform.controls['qcReq'].value == true ? 'Y' : 'N'
    GrnRefNo = 'GRN/GPO/U1/24-25/20'
    this.service.GRNMail(GrnRefNo, this.LocationId, QcReqstatus).subscribe({
      next: (res: any) => {
        if (res) {
          // if (res[0].status == 'N') {
          //   this.Error = res[0].Msg
          //   this.userHeader = 'Error'
          //   return this.opendialog()
          // }
          const transformedArray = Object.entries(res).flatMap(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map((item) => ({ key, value: item }));
            } else if (typeof value === "string") {
              return { key, value: value.replace(/\n\s+/g, " ") }; // Formatting new lines for 'desc'
            } else {
              return { key, value }; // Handle any unexpected types safely
            }
          });

          console.log(transformedArray, 'asr');
          const { MailList, Supplier, desc } = transformedArray.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});

          console.log(MailList);
          console.log(Supplier);
          console.log(desc);
        }
      }
    })
  }


  saveValid() {
    if (this.Currid > 1 && this.subform.controls['exrate'].value == 1) {
      this.Error = 'Exchange Rate cannot be 1 Rupee.'
      this.userHeader = 'Warning'
      return this.opendialog()
    }

    if (!this.subform.controls['gateEntryNo'].value) {
      this.Error = 'Please select Gate Entry No.'
      this.userHeader = 'Warning'
      return this.opendialog()
    }

    this.Error = 'Do You Want To Save ?.'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.SaveBtn()
      } else {
        this.Error = 'Save Cancelled?.'
        this.userHeader = 'Information'
        return this.opendialog()
      }
    })
  }
  GrnMaterialArr: any[] = new Array()
  grnScheduleArr: any[] = new Array()
  grnTax: any[] = new Array()
  grnSupplierInvoice: any[] = new Array()
  SaveBtn() {
    this.getMailLIst()
    let Invent_Grn = {}
    this.PoUpdDetail.forEach((Matl: any) => {
      this.GrnMaterialArr.push({
        Rawmatid: Matl.rawmatid,
        Grndate: this.form.controls['grnDate'].value,
        Gqty: Matl.poqty,
        MfgDate: Matl.mfgdate,
        Tolerance: Matl.tolerance,
        Qcreq: Matl.qcreq,
        Inspected: 1,
        Exrate: Matl.exrate,
        Supplierqty: Matl.poqty,
        GRate: Matl.rate,
        Supgrate: Matl.supgrate,
        SupBasicPrice: Matl.supbasicprice,
        Uom:"KG",
        puom:"KG",
        BilledQty:Matl.billedqty,
        ExcesssQty:Matl.excessqty,
        StorageQty:Matl.sortageqty,
        GRejQty:Matl.billedqty,
        PUomQty:Matl.poqty,
        SupplierUomQty:Matl.poqty,
        PUomRate:Matl.basicprice,
        Poproudict:Matl.poproductid,
        ProId:Matl.rawmatid,
        BatchNo:Matl.batchno,
        AltCurrExRate:Matl.exrate,
        Empid:this.EmpId,
        PostingAccountId:Matl.postingaccountid,
        // Qtyverified:Matl.,
        NetWeight:this.form.controls['netWeight'].value,
        // Rejinv:Matl.,
        LocationId:this.LocationId,
        SupId:this.form.controls['supplier'].value,
        RecivdeQty:this.SelectedRecivedQty,
        GrnRefNo:this.form.controls['grnRefNo'].value,
      })
    })
    Invent_Grn = {
      supid: this.form.controls['supplier'].value,
      Grndate: this.form.controls['grnDate'].value,
      Grn_dcno: this.form.controls['DcNo'].value,
      Grn_Ref_No: this.form.controls['grnRefNo'].value,
      grntype: this.form.controls['grnType'].value,
      Gateentryno: this.form.controls['gateEntryNo'].value,
      InvoiceDate: this.form.controls['invoiceDate'].value,
      InvoiceNo: this.form.controls['invoiceNo'].value,
      LocationId: this.LocationId,
      EmpId: this.EmpId,
      ticketno: this.form.controls['ticketNo'].value,
      weighmentno: this.DisplayTickedNo,
      materials: this.GrnMaterialArr,
      grnSchedule: this.grnScheduleArr,
      grnTax: this.grnTax,
      grnSupplierInvoice: this.grnSupplierInvoice
    }
  }

  Clear() {
    window.location.reload()
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
