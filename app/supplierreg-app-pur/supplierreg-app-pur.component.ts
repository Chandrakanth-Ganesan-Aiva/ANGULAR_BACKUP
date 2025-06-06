import { Component } from '@angular/core';
import { SupplierregAppPurService } from '../service/supplierreg-app-pur.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-supplierreg-app-pur',
  templateUrl: './supplierreg-app-pur.component.html',
  styleUrl: './supplierreg-app-pur.component.scss'
})
export class SupplierregAppPurComponent {
  constructor(private service: SupplierregAppPurService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
    this.organisation()
    this.table()
  }
  empid: number = 0
  supcheck: boolean = false
  subcheck: boolean = false
  cuscheck: boolean = false
  today: any
  suppliercode: number | null = null
  suppliername: String | null = null
  phonenumber: number | null = null
  email: String | null = null
  fax: String | null = null
  website: String | null = null
  pannumber: String | null = null
  address: String | null = null
  CountryName: string | null = null
  StateName: string | null = null
  AreaName: String | null = null
  pincode: String | null = null
  Creditperiod: String | null = null
  executivename: string | null = null
  id: number | null = null
  establishment: number | null = null
  majorname: string | null = null
  contactperson: string | null = null
  org_type: string | null = null
  partyid: number | null = null
  AddressProofType: string | null = null
  //Array
  tableArray: any[] = []
  loadArray: any[] = []
  orgArray: any[] = []
  selectedrowArray: any[] = []
  lastselectedRow: any[] = []
  inputArray: any[] = []
  approveArray: any[] = []
  load() {
    this.service.load(this.empid).subscribe((result: any) => {
      this.loadArray = result
    })
  }
  organisation() {
    this.service.organisation().subscribe((result: any) => {
      this.orgArray = result
    })
  }
  table() {
    this.service.table().subscribe((result: any) => {
      this.tableArray = result
      console.log(this.tableArray);
    })
  }
  viewPanCard(): void {
    console.log(this.partyid);
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/pancard/${this.partyid}`;
      window.open(url, '_blank');
    }
  }
  select(event: any, row: any) {
    this.approveArray = []
    this.lastselectedRow = []
    this.inputArray = []
    if (event.target.checked) {
      this.selectedrowArray.push(row)
      console.log(this.selectedrowArray);
    }
    else {
      this.selectedrowArray = this.selectedrowArray.filter(item => item !== row)
      console.log(this.selectedrowArray);
      this.lastselectedRow = []
      this.inputArray = []
      this.suppliercode = null
      this.suppliername = null
      this.phonenumber = null
      this.email = null
      this.fax = null
      this.website = null
      this.pannumber = null
      this.address = null
      this.CountryName = null
      this.StateName = null
      this.AreaName = null
      this.pincode = null
      this.Creditperiod = null
      this.executivename = null
      this.id = null
      this.establishment = null
      this.majorname = null
      this.contactperson = null
      this.partyid = null
      this.supcheck = false
      this.subcheck = false
      this.cuscheck = false
      this.org_type = null
      this.partyid = null
    }
    if (this.selectedrowArray.length > 0) {
      this.lastselectedRow.push(this.selectedrowArray.length > 0 ? this.selectedrowArray[this.selectedrowArray.length - 1] : null)
      if (this.lastselectedRow.length > 0) {
        this.service.input(this.lastselectedRow[0].code).subscribe((result: any) => {
          this.inputArray = result
          if (this.inputArray.length > 0) {
            this.service.org(this.inputArray[0].org_type).subscribe((result: any) => {
              this.org_type = result[0].orgname
              if (this.lastselectedRow.length > 0 && this.inputArray.length) {
                this.inputfield()
              }
            })
          }
        })
      }
    }
  }
  inputfield() {
    if (this.lastselectedRow.length > 0) {
      this.suppliercode = this.lastselectedRow[0].code
      this.suppliername = this.lastselectedRow[0].name
      this.phonenumber = this.lastselectedRow[0].phone
      this.email = this.lastselectedRow[0].email
      this.fax = this.lastselectedRow[0].fax
      this.website = this.lastselectedRow[0].web_site
      this.pannumber = this.lastselectedRow[0].pannumber
      this.address = this.lastselectedRow[0].address
      this.CountryName = this.lastselectedRow[0].CountryName
      this.StateName = this.lastselectedRow[0].StateName
      this.AreaName = this.lastselectedRow[0].AreaName
      this.pincode = this.lastselectedRow[0].pincode
      this.Creditperiod = this.lastselectedRow[0].Creditperiod
      this.AddressProofType = this.lastselectedRow[0].AddressProofType
      if (this.lastselectedRow[0].IsSupplier == 'Y') {
        this.supcheck = true
      }
      else {
        this.supcheck = false
      }
      if (this.lastselectedRow[0].IsSubcontractor == 'Y') {
        this.subcheck = true
      }
      else {
        this.subcheck = false
      }
      if (this.lastselectedRow[0].IsCustomer == 'Y') {
        this.cuscheck = true
      }
      else {
        this.cuscheck = false
      }
    }
    if (this.inputArray.length > 0) {
      this.contactperson = this.inputArray[0].contact
      this.id = this.lastselectedRow[0].org_type
      this.establishment = this.inputArray[0].establishment
      this.executivename = this.inputArray[0].executive
      this.majorname = this.inputArray[0].majcustomer
      this.partyid = this.inputArray[0].partyid
    }
  }
  approve() {
    if (this.selectedrowArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      for (let i = 0; i < this.selectedrowArray.length; i++) {
        this.approveArray.push({
          empid: this.empid,
          approveddate: formattedDate,
          partyid: this.selectedrowArray[i].partyid
        })
      }
      this.Error = 'Are Sure to Approve?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          console.log(this.approveArray);
          this.service.approve(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.clear()
          })
        }
      })
    } else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  Error: String = ''
  userHeader: String = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
  clear() {
    this.Error = 'Are you sure to Clear?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.tableArray = []
        this.selectedrowArray = []
        this.lastselectedRow = []
        this.inputArray = []
        this.suppliercode = null
        this.suppliername = null
        this.phonenumber = null
        this.email = null
        this.fax = null
        this.website = null
        this.pannumber = null
        this.address = null
        this.CountryName = null
        this.StateName = null
        this.AreaName = null
        this.pincode = null
        this.Creditperiod = null
        this.executivename = null
        this.id = null
        this.establishment = null
        this.majorname = null
        this.contactperson = null
        this.partyid = null
        this.supcheck = false
        this.subcheck = false
        this.cuscheck = false
        this.org_type = null
        this.partyid = null
        this.Error = ''
        this.userHeader = ''
        this.AddressProofType = ''
        this.table()
      }
    })
  }
  viewAddress() {
    console.log(this.partyid);
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/addressproof/${this.partyid}`;
      // window.open(url, '_blank');
    }
  }
  unapprove() {
    
  }
}