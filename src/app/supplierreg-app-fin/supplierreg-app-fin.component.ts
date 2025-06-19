import { Component } from '@angular/core';
import { SupplierregAppFinService } from '../service/supplierreg-app-fin.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { data } from 'jquery';
@Component({
  selector: 'app-supplierreg-app-fin',
  templateUrl: './supplierreg-app-fin.component.html',
  styleUrl: './supplierreg-app-fin.component.scss'
})
export class SupplierregAppFinComponent {
  constructor(private service: SupplierregAppFinService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
    this.service.pType().subscribe((result: any) => {
      this.partyTypeArray = result
    })
    this.service.ledgergrp().subscribe((result: any) => {
      this.ledgergrpArray = result
    })
  }
  empid: number = 0
  empname: string = ''
  vendor: boolean = false
  partyType: string = ''
  ledgergrp: string = ''
  capital: number | null = null
  banker: string | null = ''
  ssi: string | null = ''
  gst: string | null = ''
  ecc_no: String | null = ''
  currency: string | null = ''
  partyid: string | null = ''
  Ledgername: string | null = ''
  smeno = ''
  empArray: any[] = []
  tableArray: any[] = []
  selectArray: any[] = []
  lastrowArray: any[] = []
  inputArray: any[] = []
  partyTypeArray: any[] = []
  ledgergrpArray: any[] = []
  approveArray: any[] = []
  selectInputArray: any[] = []
  load() {
    this.service.load().subscribe((result: any) => {
      this.tableArray = result
      this.service.empid(this.empid).subscribe((result: any) => {
        this.empArray = result
        this.empname = this.empArray[0].empname
      })
    })
  }
  select(event: any, row: any) {
    this.lastrowArray = [];

    if (event.target.checked) {
      // Push to selectArray only if not already present
      if (!this.selectArray.some(item => item.partyid === row.partyid)) {
        this.selectArray.push(row);

        // Call input() for selected row
        this.service.input(row.code).subscribe((result: any) => {
          const input = result[0];

          // Push to selectInputArray only if not already present
          if (!this.selectInputArray.some(item => item.partyid === input.partyid)) {
            this.selectInputArray.push(input);
          }

          // Update form values
          this.capital = input.capital;
          this.banker = input.bankersname;
          this.ssi = input.ssiregno;
          this.gst = input.gstno;
          this.ecc_no = input.sup_eccno;
          this.partyid = input.partyid;
          this.Ledgername = input.name;
          this.smeno = input.smeno;

          this.service.currency(input.currid).subscribe((res: any) => {
            this.currency = res[0].CurrDesc;
          });
          this.service.partytype(input.ctypeid).subscribe((res: any) => {
            this.partyType = res[0].xxx;
          });
          this.service.ledger(input.partygroup).subscribe((res: any) => {
            this.ledgergrp = res[0].xxx;
          });
        });
      }
    } else {
      // Remove from both arrays
      this.selectArray = this.selectArray.filter(item => item.partyid !== row.partyid);
      this.selectInputArray = this.selectInputArray.filter(item => item.partyid !== row.partyid);

      // Clear values if no selection
      if (this.selectArray.length === 0) {
        this.capital = null;
        this.banker = '';
        this.ssi = '';
        this.gst = '';
        this.ecc_no = '';
        this.currency = '';
        this.partyid = '';
        this.Ledgername = '';
        this.ledgergrp = '';
        this.partyType = '';
        this.smeno = '';
        this.vendor = false;
      }
    }

    // Update last selected row and vendor flag
    if (this.selectArray.length > 0) {
      const lastRow = this.selectArray[this.selectArray.length - 1];
      this.lastrowArray.push(lastRow);
      this.vendor = lastRow.gstno !== '';
    } else {
      this.vendor = false;
    }
  }
  approve() {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    if (this.selectArray.length > 0) {
      for (let i = 0; i < this.selectArray.length; i++) {
        console.log(this.selectArray)
        this.approveArray.push({
          empid: this.empid,
          today: formattedDate,
          partyid: this.selectArray[i].partyid
        })
      }
      this.Error = 'Are Sure to Approve?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        console.log(this.approveArray);
        if (result) {
          this.service.approve(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.tableArray = []
            this.selectArray = []
            this.lastrowArray = []
            this.inputArray = []
            this.approveArray = []
            this.selectInputArray = []
            this.vendor = false
            this.smeno = ''
            this.capital = null
            this.banker = ''
            this.ssi = ''
            this.partyType = ''
            this.ledgergrp = ''
            this.gst = ''
            this.ecc_no = ''
            this.currency = ''
            this.partyid = ''
            this.Ledgername = ''
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
  unapprove() {

    console.log(this.selectArray, 'select');
    console.log(this.selectInputArray, 'input');

    if (this.selectArray.length !== this.selectInputArray.length) {
      this.Error = 'Selection mismatch. Please reselect rows properly.';
      this.userHeader = 'Error';
      this.opendialog();
      return;
    }

    // Create formatted date (if needed elsewhere)
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    if (this.selectArray.length > 0) {
      this.approveArray = [];
      for (let i = 0; i < this.selectArray.length; i++) {
        const select = this.selectArray[i];
        console.log(select);
        const input = this.selectInputArray[i]
        console.log(input);
        this.approveArray.push({
          Partyid: select.partyid,
          code: select.code,
          name: input.name,
          address: input.address,
          issupplier: select.IsSupplier,
          IsSubcontractor: select.IsSubcontractor,
          IsCustomer: select.IsCustomer, // Corrected
          partygroup: select.PartyGroup,
          partytype: select.partytype,
          contact: input.contact,
          phone: input.phone,
          email: input.email,
          web_site: input.web_site,
          pannumber: input.pannumber,
          pincode: input.pincode,
          currid: select.currid,
          stateid: input.stateid,
          countryid: select.countryid,
          cityid: select.cityid,
          creditperiod: select.Creditperiod,
          gstno: select.gstno,
          sup_eccno: input.sup_eccno,
          ctypeid: input.ctypeid,
          establishment: input.establishment,
          executive: input.executive,
          majcustomer: input.majcustomer,
          capital: input.capital,
          ssiregno: input.ssiregno,
          bankersname: input.bankersname,
          org_type: input.org_type,
          sup_type: select.sup_type,
          machdet: input.machdet,
          measinst: input.measinst,
          qltysystem: input.qltysystem,
          manpowerprod: input.manpowerprod,
          manpowerqlty: input.manpowerqlty,
          manpowerothers: input.manpowerothers,
          manpowertotal: input.manpowertotal,
          weeklyholiday: input.weeklyholiday,
          workhours: input.workhours,
          shiftdet: input.shiftdet,
          shifttime: input.shifttime,
          expansionplan: input.expansionplan,
          sanctionedpower: input.sanctionedpower,
          standbypower: input.standbypower,
          AddressProofType: select.AddressProofType,
          SMEno: input.smeno,
          PanCardName: select.PanCardName,
          GstCertificateName: select.GstCertificateName,
          AddressProofName: select.AddressProofName,
          BankDetailsName: select.BankDetailsName,
          SmeCertificateName: select.SmeCertificateName
        });
      }
      console.log(this.approveArray, 'approve');
      this.Error = 'Are you sure to Unapprove?';
      this.userHeader = 'Warning!!!';
      this.opendialog();

      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.unapprove(this.approveArray).subscribe({
            next: (res: any) => {
              this.Error = res.message;
              this.userHeader = 'Information';
              this.opendialog();

              // Reset all data arrays and form fields
              this.tableArray = [];
              this.selectArray = [];
              this.lastrowArray = [];
              this.inputArray = [];
              this.approveArray = [];
              this.selectInputArray = []
              this.vendor = false;
              this.smeno = '';
              this.capital = null;
              this.banker = '';
              this.ssi = '';
              this.partyType = '';
              this.ledgergrp = '';
              this.gst = '';
              this.ecc_no = '';
              this.currency = '';
              this.partyid = '';
              this.Ledgername = '';

              this.load(); // Reload the table data
            },
            error: (err) => {
              this.Error = 'Unapprove failed. Try again later.';
              this.userHeader = 'Error';
              this.opendialog();
            }
          });
        }
      });

    } else {
      this.Error = 'Select the Rows to Unapprove';
      this.userHeader = 'Information';
      this.opendialog();
    }
  }
  clear() {
    this.Error = 'Are your sure to Clear?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(this.approveArray);
      if (result) {
        this.tableArray = []
        this.selectArray = []
        this.lastrowArray = []
        this.inputArray = []
        this.approveArray = []
        this.vendor = false
        this.smeno = ''
        this.capital = null
        this.banker = ''
        this.ssi = ''
        this.partyType = ''
        this.ledgergrp = ''
        this.gst = ''
        this.ecc_no = ''
        this.currency = ''
        this.partyid = ''
        this.Ledgername = ''
        this.load()
      }
    })
  }
  Error: String = ''
  userHeader: String = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
  viewBankDetails(): void {
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/bankdetails/${this.partyid}`;
      window.open(url, '_blank');
    }
  }
  viewgst(): void {
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/gstcertificate/${this.partyid}`;
      window.open(url, '_blank');
    }
  }
  viewsme(): void {
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/smecertificate/${this.partyid}`;
      window.open(url, '_blank');
    }
  }
}