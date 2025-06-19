import { Component } from '@angular/core';
import { SupplierregApprovalTecService } from '../service/supplierreg-approval-tec.service';
import { DatePipe } from '@angular/common';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { error } from 'jquery';

@Component({
  selector: 'app-supplierreg-approval-tec',
  templateUrl: './supplierreg-approval-tec.component.html',
  styleUrl: './supplierreg-approval-tec.component.scss'
})
export class SupplierregApprovalTecComponent {
  constructor(private service: SupplierregApprovalTecService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
  }
  empid: number | null = null
  partyid: number | null = null
  MachineryDetails: string | null = null
  Measuring: string | null = null
  Qs: string | null = null
  production: string | null = null
  quality: string | null = null
  others: string | null = null
  total: string | null = null
  weeklyHoliday: string | null = null
  workingHours: string | null = null
  shiftDetails: string | null = null
  shiftTimings: string | null = null
  exp_plan: string | null = null
  sanctioned_pow_Avl: string | null = null
  standBy_Power: string | null = null
  //
  loadArray: any[] = []
  tableArray: any[] = []
  selectedArray: any = []
  lastselectedArray: any[] = []
  inputArray: any[] = []
  approveArray: any[] = []
  selectInputArray: any[] = []
  load() {
    this.service.empid(this.empid).subscribe((result: any) => {
      this.loadArray = result
    })
    this.service.table().subscribe((result: any) => {
      this.tableArray = result
    })
  }
  select(event: any, row: any) {
    if (event.target.checked) {
      // Add to selectedArray
      this.selectedArray.push(row);
      console.log(this.selectedArray);

      // Fetch and add to selectInputArray
      this.service.input(row.code).subscribe((result: any) => {
        if (result && result.length > 0) {
          const input = result[0];
          this.selectInputArray.push(input);
          this.partyid = input.partyid;
          this.MachineryDetails = input.machdet;
          this.Measuring = input.measinst;
          this.Qs = input.manpowerqlty;
          this.production = input.manpowerprod;
          this.quality = input.manpowerqlty;
          this.others = input.manpowerothers;
          this.total = input.manpowertotal;
          this.weeklyHoliday = input.weeklyholiday;
          this.workingHours = input.workhours;
          this.shiftDetails = input.shiftdet;
          this.shiftTimings = input.shifttime;
          this.exp_plan = input.expansionplan;
          this.sanctioned_pow_Avl = input.sanctionedpower;
          this.standBy_Power = input.standbypower;
        }
      });

    } else {
      // Remove from selectedArray
      this.selectedArray = this.selectedArray.filter((item: any) => item !== row);
      console.log(this.selectedArray);

      // Remove from selectInputArray using partyid
      this.selectInputArray = this.selectInputArray.filter((item: any) => item.partyid !== row.partyid);
      console.log(this.selectInputArray)

      // Clear form fields if nothing is selected
      if (this.selectedArray.length === 0) {
        this.partyid = null;
        this.MachineryDetails = null;
        this.Measuring = null;
        this.Qs = null;
        this.production = null;
        this.quality = null;
        this.others = null;
        this.total = null;
        this.weeklyHoliday = null;
        this.workingHours = null;
        this.shiftDetails = null;
        this.shiftTimings = null;
        this.exp_plan = null;
        this.sanctioned_pow_Avl = null;
        this.standBy_Power = null;
      }
    }

    // Optional: Always update last selected if anything is selected
    if (this.selectedArray.length > 0) {
      this.lastselectedArray = [this.selectedArray[this.selectedArray.length - 1]];
    } else {
      this.lastselectedArray = [];
    }
  }
  approve() {
    if (this.selectedArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      for (let i = 0; i < this.selectedArray.length; i++) {
        this.approveArray.push({
          empid: this.empid,
          today: formattedDate,
          partyid: this.selectedArray[i].partyid
        })
      }
      this.Error = 'Are you sure to Approve?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          console.log(this.approveArray);
          this.service.approve(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.loadArray = []
            this.tableArray = []
            this.selectedArray = []
            this.lastselectedArray = []
            this.inputArray = []
            this.partyid = null
            this.MachineryDetails = null
            this.Measuring = null
            this.Qs = null
            this.production = null
            this.quality = null
            this.others = null
            this.total = null
            this.weeklyHoliday = null
            this.workingHours = null
            this.shiftDetails = null
            this.shiftTimings = null
            this.exp_plan = null
            this.sanctioned_pow_Avl = null
            this.standBy_Power = null
            this.approveArray = []
            this.Error = ''
            this.userHeader = ''
            this.load()
          })
        }
      })
    }
    else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
  clear() {
    this.Error = 'Are your sure to Clear?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(this.approveArray);
      if (result) {
        this.loadArray = []
        this.tableArray = []
        this.selectedArray = []
        this.lastselectedArray = []
        this.inputArray = []
        this.partyid = null
        this.MachineryDetails = null
        this.Measuring = null
        this.Qs = null
        this.production = null
        this.quality = null
        this.others = null
        this.total = null
        this.weeklyHoliday = null
        this.workingHours = null
        this.shiftDetails = null
        this.shiftTimings = null
        this.exp_plan = null
        this.sanctioned_pow_Avl = null
        this.standBy_Power = null
        this.approveArray = []
        this.Error = ''
        this.userHeader = ''
        this.load()
      }
    })
  }
  unapprove() {
    console.log(this.selectInputArray);
    console.log(this.selectedArray);
    if (this.selectedArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      for (let i = 0; i < this.selectedArray.length; i++) {
        this.approveArray.push({
          Partyid: this.selectedArray[i].partyid,
          code: this.selectedArray[i].code,
          name: this.selectedArray[i].name,
          address: this.selectedArray[i].address,
          issupplier: this.selectedArray[i].IsSupplier,
          IsSubcontractor: this.selectedArray[i].IsSubcontractor,
          IsCustomer: this.selectedArray[i].IsCustomer, // Corrected
          partygroup: this.selectedArray[i].PartyGroup,
          partytype: this.selectedArray[i].partytype,
          contact: this.selectInputArray[i].contact,
          phone: this.selectInputArray[i].phone,
          email: this.selectInputArray[i].email,
          web_site: this.selectInputArray[i].web_site,
          pannumber: this.selectInputArray[i].pannumber,
          pincode: this.selectInputArray[i].pincode,
          currid: this.selectInputArray[i].currid,
          stateid: this.selectInputArray[i].stateid,
          countryid: this.selectInputArray[i].countryid,
          cityid: this.selectInputArray[i].cityid,
          creditperiod: this.selectedArray[i].Creditperiod,
          gstno: this.selectedArray[i].gstno,
          sup_eccno: this.selectInputArray[i].sup_eccno,
          ctypeid: this.selectInputArray[i].ctypeid,
          establishment: this.selectInputArray[i].establishment,
          executive: this.selectInputArray[i].executive,
          majcustomer: this.selectInputArray[i].majcustomer,
          capital: this.selectInputArray[i].capital,
          ssiregno: this.selectInputArray[i].ssiregno,
          bankersname: this.selectInputArray[i].bankersname,
          org_type: this.selectInputArray[i].org_type,
          sup_type: this.selectedArray[i].sup_type,
          machdet: this.selectInputArray[i].machdet,
          measinst: this.selectInputArray[i].measinst,
          qltysystem: this.selectInputArray[i].qltysystem,
          manpowerprod: this.selectInputArray[i].manpowerprod,
          manpowerqlty: this.selectInputArray[i].manpowerqlty,
          manpowerothers: this.selectInputArray[i].manpowerothers,
          manpowertotal: this.selectInputArray[i].manpowertotal,
          weeklyholiday: this.selectInputArray[i].weeklyholiday,
          workhours: this.selectInputArray[i].workhours,
          shiftdet: this.selectInputArray[i].shiftdet,
          shifttime: this.selectInputArray[i].shifttime,
          expansionplan: this.selectInputArray[i].expansionplan,
          sanctionedpower: this.selectInputArray[i].sanctionedpower,
          standbypower: this.selectInputArray[i].standbypower,
          AddressProofType: this.selectedArray[i].AddressProofType,
          SMEno: this.selectedArray[i].SMEno,
          PanCardName: this.selectedArray[i].PanCardName,
          GstCertificateName: this.selectedArray[i].GstCertificateName,
          AddressProofName: this.selectedArray[i].AddressProofName,
          BankDetailsName: this.selectedArray[i].BankDetailsName,
          SmeCertificateName: this.selectedArray[i].SmeCertificateName
        })
      }
      console.log(this.approveArray);

      this.Error = 'Are you sure to Unapprove?'
      this.userHeader = 'Warning!!!'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          console.log(this.approveArray);
          this.service.unapprove(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.loadArray = []
            this.tableArray = []
            this.selectedArray = []
            this.lastselectedArray = []
            this.inputArray = []
            this.partyid = null
            this.MachineryDetails = null
            this.Measuring = null
            this.Qs = null
            this.production = null
            this.quality = null
            this.others = null
            this.total = null
            this.weeklyHoliday = null
            this.workingHours = null
            this.shiftDetails = null
            this.shiftTimings = null
            this.exp_plan = null
            this.sanctioned_pow_Avl = null
            this.standBy_Power = null
            this.approveArray = []
            this.Error = ''
            this.userHeader = ''
            this.load()
          })
        }
      })
    }
    else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
}