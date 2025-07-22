import { Component } from '@angular/core';
import { SupplierregAppPurService } from '../service/supplierreg-app-pur.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
declare var bootstrap: any
@Component({
  selector: 'app-supplierreg-app-pur',
  templateUrl: './supplierreg-app-pur.component.html',
  styleUrl: './supplierreg-app-pur.component.scss'
})
export class SupplierregAppPurComponent {
  @ViewChild('exampleModal') modalElement!: ElementRef;

  constructor(private service: SupplierregAppPurService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
    this.organisation()
    this.table()
  }
  ngAfterViewInit() {

  }

  empid: number = 0
  supcheck: boolean = false
  subcheck: boolean = false
  cuscheck: boolean = false
  today: any
  insertCalled: boolean = false
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
  checkapprove: number = 0
  orgId: number | null = 0
  countryid: number | null = 0
  stateid: number | null = 0
  areaid: number | null = 0
  isEditMode: boolean = false;

  //Array
  tableArray: any[] = []
  loadArray: any[] = []
  orgArray: any[] = []
  selectedrowArray: any[] = []
  lastselectedRow: any[] = []
  inputArray: any[] = []
  approveArray: any[] = []
  selectinputArray: any[] = []
  InsertArray: any[] = []
  ApproveCheckArray: any[] = []
  select1: any[] = []
  input1: any[] = []
  resultArray: any[] = []
  partyArray: any[] = []
  emailArray: any[] = []
  AreaArray: any[] = []
  Editsave: any[] = []
  CountryArray: any[] = []
  stateArray: any[] = []
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
    })
  }
  viewPanCard(): void {
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/pancard/${this.partyid}`;
      window.open(url, '_blank'); // Opens in new tab
    }
  }
  select(event: any, row: any) {
    this.approveArray = [];
    if (event.target.checked) {
      this.selectedrowArray.push(row);
      console.log(this.selectedrowArray, 'selectrow');
      this.service.input(row.code).subscribe((result: any) => {
        if (result?.length > 0) {
          this.inputArray = result;
          const inputItem = result[0];
          const alreadyExists = this.selectinputArray.some(item => item.partyid === inputItem.partyid);
          if (!alreadyExists) {
            this.selectinputArray.push(inputItem);
          }
          this.service.org(inputItem.org_type).subscribe((orgResult: any) => {
            if (orgResult?.length > 0) {
              this.org_type = orgResult[0].orgname;
            }
            this.lastselectedRow = [row];
            this.inputfield();
          });
        }
      });
    } else {

      this.selectedrowArray = this.selectedrowArray.filter(item => item !== row);
      this.selectinputArray = this.selectinputArray.filter(item => item.partyid !== row.partyid);
      if (this.selectedrowArray.length === 0 || this.lastselectedRow?.[0]?.partyid === row.partyid) {
        this.lastselectedRow = [];
        this.inputArray = [];
        this.suppliercode = null;
        this.suppliername = null;
        this.phonenumber = null;
        this.email = null;
        this.fax = null;
        this.website = null;
        this.pannumber = null;
        this.address = null;
        this.CountryName = null;
        this.StateName = null;
        this.AreaName = null;
        this.pincode = null;
        this.Creditperiod = null;
        this.executivename = null;
        this.id = null;
        this.establishment = null;
        this.majorname = null;
        this.contactperson = null;
        this.partyid = null;
        this.supcheck = false;
        this.subcheck = false;
        this.cuscheck = false;
        this.org_type = null;
        this.AddressProofType = '';
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
  backupArray: any[] = []
  toggleEdit() {
    if (this.selectedrowArray.length > 0) {

      this.service.country().subscribe((result: any) => {
        this.CountryArray = result
      })
      if (this.orgId == 0) {
      }
      else {
        this.lastselectedRow[0].org_type = this.orgId
      }
      if (this.countryid == 0) {

      }
      else {
        this.lastselectedRow[0].countryid = this.countryid
      }
      if (this.stateid == 0) {

      }
      else {
        this.lastselectedRow[0].stateid = this.stateid
      }
      if (this.areaid == 0) {

      }
      else {
        this.lastselectedRow[0].cityid = this.areaid
      }
      this.Editsave = []
      this.backupArray = []
      this.isEditMode = !this.isEditMode;
      console.log(this.isEditMode, 'edit mode');
      if (!this.isEditMode) {
        this.backupArray.push({
          Partyid: this.selectedrowArray[this.selectedrowArray.length - 1].partyid,
          Suppliercode: this.selectedrowArray[this.selectedrowArray.length - 1].code,
          SupplierName: this.selectedrowArray[this.selectedrowArray.length - 1].name,
          contactperson: this.selectinputArray[this.selectinputArray.length - 1].contact,
          contactno: this.selectedrowArray[this.selectedrowArray.length - 1].phone,
          email: this.selectedrowArray[this.selectedrowArray.length - 1].email,
          website: this.selectedrowArray[this.selectedrowArray.length - 1].web_site,
          organisationType: String(this.selectedrowArray[this.selectedrowArray.length - 1].org_type),
          panno: this.selectedrowArray[this.selectedrowArray.length - 1].pannumber,
          establishmentyear: String(this.selectinputArray[this.selectinputArray.length - 1].establishment),
          executive: this.selectinputArray[this.selectinputArray.length - 1].executive,
          majorcustomer: this.selectinputArray[this.selectinputArray.length - 1].majcustomer,
          address: this.selectedrowArray[this.selectedrowArray.length - 1].address,
          addressType: this.selectedrowArray[this.selectedrowArray.length - 1].AddressProofType ? "" : "",
          country: String(this.selectedrowArray[this.selectedrowArray.length - 1].countryid),
          state: String(this.selectedrowArray[this.selectedrowArray.length - 1].stateid),
          area: String(this.selectedrowArray[this.selectedrowArray.length - 1].cityid),
          pincode: this.selectedrowArray[this.selectedrowArray.length - 1].pincode,
          creditperiod: String(this.selectedrowArray[this.selectedrowArray.length - 1].Creditperiod),
          isSupplier: this.selectedrowArray[this.selectedrowArray.length - 1].IsSupplier,
          isSubcontractor: this.selectedrowArray[this.selectedrowArray.length - 1].IsSubcontractor,
          isCustomer: this.selectedrowArray[this.selectedrowArray.length - 1].IsCustomer,
          AlteredEmpId: String(this.empid)
        })
        console.log(this.backupArray);
        this.Editsave.push({
          partyid: this.partyid,
          Name: this.suppliername,
          contact: this.contactperson,
          Phone: this.phonenumber,
          email: this.email,
          web_site: this.website,
          org_type: this.lastselectedRow[0].org_type,
          PANNumber: this.pannumber,
          establishment: this.establishment,
          executive: this.executivename,
          majCustomer: this.majorname,
          Address: this.address,
          AddressProofType: this.AddressProofType,
          CountryId: this.lastselectedRow[0].countryid,
          Stateid: this.lastselectedRow[0].stateid,
          Cityid: this.lastselectedRow[0].cityid,
          Pincode: this.pincode,
          Creditperiod: this.Creditperiod,
          IsSupplier: this.supcheck ? 'Y' : 'N',
          IsSubcontractor: this.subcheck ? 'Y' : 'N',
          IsCustomer: this.cuscheck ? 'Y' : 'N'
        })
        console.log(this.Editsave);
        this.Error = 'Are you Sure to Edit?';
        this.userHeader = 'Save';
        this.opendialog();
        this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.service.edit(this.Editsave).subscribe((result: any) => {
              this.service.backup(this.backupArray).subscribe((result: any) => {
                console.log(result);
              })
              this.Error = result.message;
              this.userHeader = 'Information';
              this.opendialog();
              this.tableArray = []
              this.selectedrowArray = []
              this.lastselectedRow = []
              this.inputArray = []
              this.selectinputArray = []
              this.approveArray = []
              this.selectinputArray = []
              this.InsertArray = []
              this.ApproveCheckArray = []
              this.select1 = []
              this.input1 = []
              this.resultArray = []
              this.partyArray = []
              this.emailArray = []
              this.AreaArray = []
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
              this.insertCalled = false
              this.AddressProofType = ''
              this.checkapprove = 0
              this.orgId = 0
              this.countryid = 0
              this.stateid = 0
              this.areaid = 0
              this.isEditMode = false;
              this.Editsave = []
              this.CountryArray = []
              this.stateArray = []
              this.Error = ''
              this.userHeader = ''
              this.table()
            })
          }
        });
      }
    } else {
      this.Error = 'Select the Rows to Approve';
      this.userHeader = 'Information';
      this.opendialog();
    }
  }
  state() {
    this.service.stateid(this.countryid).subscribe((result: any) => {
      console.log(result, 'res');
      this.stateArray = result
    })
  }
  area() {
    console.log(this.stateid);
    this.service.area(this.stateid).subscribe((result: any) => {
      console.log(result);
      this.AreaArray = result
    })
  }
  test() {
    console.log(this.areaid, 'areaid');
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
        this.selectinputArray = []
        this.approveArray = []
        this.selectinputArray = []
        this.InsertArray = []
        this.ApproveCheckArray = []
        this.select1 = []
        this.input1 = []
        this.resultArray = []
        this.partyArray = []
        this.emailArray = []
        this.AreaArray = []
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
        this.insertCalled = false
        this.AddressProofType = ''
        this.checkapprove = 0
        this.orgId = 0
        this.countryid = 0
        this.stateid = 0
        this.areaid = 0
        this.isEditMode = false;
        this.Editsave = []
        this.CountryArray = []
        this.stateArray = []
        this.Error = ''
        this.userHeader = ''
        this.table()
      }
    })
  }
  viewAddress(): void {
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/addressproof/${this.partyid}`;
      window.open(url, '_blank'); // Opens in new tab
    } else {
      console.warn('Party ID is missing!');
    }
  }
  approve() {
    console.log(this.selectedrowArray);
    console.log(this.selectinputArray);
        this.partyArray = []
    if (this.selectedrowArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      this.approveArray = [];
      this.InsertArray = [];
      this.Error = 'Are Sure to Approve?';
      this.userHeader = 'Save';
      this.opendialog();
      for (let i = 0; i < this.selectedrowArray.length; i++) {
        this.partyArray.push({
          partyid: this.selectedrowArray[i].partyid,
          approveddate: formattedDate,
          empid: this.empid
        })
      }
      console.log(this.partyArray, 'partyArray');

      this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.service.approve(this.partyArray).subscribe((result: any) => {
            this.check()
          })
        }
      });
    } else {
      this.Error = 'Select the Rows to Approve';
      this.userHeader = 'Information';
      this.opendialog();
    }
  }
  check() {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');

    for (let i = 0; i < this.selectedrowArray.length; i++) {
      const merged = {
        ...this.selectinputArray[i],
        ...this.selectedrowArray[i]
      };
      this.InsertArray.push(merged);
    }
    for (let i = 0; i < this.selectedrowArray.length; i++) {
      this.approveArray.push({
        empid: this.empid,
        approveddate: formattedDate,
        partyid: this.InsertArray[i].partyid,
        sup_type: this.InsertArray[i].sup_type,
        Name: this.InsertArray[i].name,
        Code: this.InsertArray[i].code,
        pannumber: this.InsertArray[i].pannumber,
        entryempid: this.empid,
        iscustomer: this.InsertArray[i].IsCustomer,
        IsSupplier: this.InsertArray[i].IsSupplier,
        IsSubcontractor: this.InsertArray[i].IsSubcontractor,
        address: this.InsertArray[i].address,
        pincode: this.InsertArray[i].pincode,
        stateid: this.InsertArray[i].stateid,
        countryid: this.InsertArray[i].countryid,
        cityid: this.InsertArray[i].cityid,
        currid: this.InsertArray[i].currid,
        eccno: this.InsertArray[i].sup_eccno ? this.InsertArray[i].sup_eccno : 'na',
        statetax: this.InsertArray[i].gstno,
        email: this.InsertArray[i].email,
        phone: this.InsertArray[i].phone,
        website: this.InsertArray[i].web_site ? this.InsertArray[i].web_site : 'na',
        gstno: this.InsertArray[i].gstno,
        createddate: formattedDate,
        creditperiod: this.InsertArray[i].Creditperiod,
        supcode: this.InsertArray[i].code,
        supshort: this.InsertArray[i].name,
        supname: this.InsertArray[i].name,
        sup_eccno: this.InsertArray[i].sup_eccno ? this.InsertArray[i].sup_eccno : 'na',
        mobileno: this.InsertArray[i].phone,
        contact_person: this.InsertArray[i].contact,
        contact_executive: this.InsertArray[i].executive,
        Establishment_year: String(this.InsertArray[i].establishment),
        org_type: this.InsertArray[i].org_type,
        web_site: this.InsertArray[i].web_site ? this.InsertArray[i].web_site : 'na',
        capital: this.InsertArray[i].capital,
        ss_id: this.InsertArray[i].ssiregno,
        bank_details: this.InsertArray[i].bankersname,
        city: this.InsertArray[i].AreaName,
        ctypeid: this.InsertArray[i].ctypeid,
        state: this.InsertArray[i].StateName,
        country: this.InsertArray[i].CountryName,
        subconcode: this.InsertArray[i].code,
        subconshort: this.InsertArray[i].name,
        subconname: this.InsertArray[i].name,
        subconaddress: this.InsertArray[i].address,
        subconphone: this.InsertArray[i].contact ? this.InsertArray[i].contact : 'na',
        SubConMail: this.InsertArray[i].email,
        contactperson: this.InsertArray[i].contact ? this.InsertArray[i].contact : 'na',
        panno: this.InsertArray[i].pannumber,
        custcode: this.InsertArray[i].code,
        custshort: this.InsertArray[i].name,
        custname: this.InsertArray[i].name,
        contact: this.InsertArray[i].contact,
        accountid: Number(this.InsertArray[i].partytype)       
      });
      console.log(this.approveArray, 'approveArray');
    }
    for (let i = 0; i < this.selectedrowArray.length; i++) {
      this.service.ApproveCheck(this.selectedrowArray[i].partyid).subscribe((approveCheck: any) => {
        if (this.selectedrowArray[i].sup_type === 'P') {
          this.checkapprove = this.checkapprove + 1;
          if (approveCheck[0]?.fin_approved === 'Y' && approveCheck[0]?.pur_approved === 'Y' && approveCheck[0]?.qc_approved === 'Y') {
            if (this.approveArray.length === this.selectedrowArray.length && !this.insertCalled) {
              this.insertCalled = true;
              console.log(this.approveArray);
              this.service.insertType(this.approveArray).subscribe((result: any) => {
                this.resultArray = result;
                this.Error = result.message;
                this.userHeader = 'Information';
                this.opendialog();
              });
            }
          }
        } else if (this.selectedrowArray[i].sup_type === 'N') {
          this.checkapprove = this.checkapprove + 1;
          if (approveCheck[0]?.fin_approved === 'Y' && approveCheck[0]?.pur_approved === 'Y') {
            if (!this.insertCalled) {
              this.insertCalled = true;
              console.log(this.approveArray);
              this.service.insertType(this.approveArray).subscribe((result: any) => {
                this.Error = result.message;
                this.userHeader = 'Information';
                this.opendialog();
              });
            }
          }
        }
        if (this.selectedrowArray.length == this.checkapprove) {
          this.tableArray = []
          this.selectedrowArray = []
          this.lastselectedRow = []
          this.inputArray = []
          this.selectinputArray = []
          this.approveArray = []
          this.selectinputArray = []
          this.InsertArray = []
          this.ApproveCheckArray = []
          this.select1 = []
          this.input1 = []
          this.resultArray = []
          this.partyArray = []
          this.emailArray = []
          this.AreaArray = []
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
          this.insertCalled = false
          this.AddressProofType = ''
          this.checkapprove = 0
          this.orgId = 0
          this.countryid = 0
          this.stateid = 0
          this.areaid = 0
          this.isEditMode = false;
          this.Editsave = []
          this.CountryArray = []
          this.stateArray = []
          this.Error = ''
          this.userHeader = ''
          this.table()
        }
      });
    }
  }
  unapprove() {
    this.approveArray = [];
    this.InsertArray = [];
    for (let i = 0; i < this.selectedrowArray.length; i++) {
      const merged = {
        ...this.selectinputArray[i],
        ...this.selectedrowArray[i]
      };
      this.InsertArray.push(merged);
    }
    if (this.selectedrowArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      for (let i = 0; i < this.selectedrowArray.length; i++) {
        this.approveArray.push({
          Partyid: this.selectedrowArray[i].partyid,
          code: this.suppliercode,
          name: this.InsertArray[i].name,
          address: this.InsertArray[i].address,
          issupplier: this.InsertArray[i].IsSupplier,
          IsSubcontractor: this.InsertArray[i].IsSubcontractor,
          IsCustomer: this.InsertArray[i].IsCustomer,
          partygroup: this.selectedrowArray[i].PartyGroup,
          partytype: this.InsertArray[i].partytype,
          contact: this.InsertArray[i].contact,
          phone: this.InsertArray[i].phone,
          email: this.InsertArray[i].email,
          web_site: this.InsertArray[i].web_site,
          pannumber: this.InsertArray[i].pannumber,
          pincode: this.InsertArray[i].pincode,
          currid: this.InsertArray[i].currid,
          stateid: this.InsertArray[i].stateid,
          countryid: this.InsertArray[i].countryid,
          cityid: this.InsertArray[i].cityid,
          creditperiod: this.InsertArray[i].Creditperiod,
          gstno: this.InsertArray[i].gstno,
          sup_eccno: this.InsertArray[i].sup_eccno,
          ctypeid: this.InsertArray[i].ctypeid,
          establishment: this.InsertArray[i].establishment,
          executive: this.InsertArray[i].executive,
          majcustomer: this.InsertArray[i].majcustomer,
          capital: this.InsertArray[i].capital,
          ssiregno: this.InsertArray[i].ssiregno,
          bankersname: this.InsertArray[i].bankersname,
          org_type: this.InsertArray[i].org_type,
          sup_type: this.InsertArray[i].sup_type,
          machdet: this.InsertArray[i].machdet,
          measinst: this.InsertArray[i].measinst,
          qltysystem: this.InsertArray[i].qltysystem,
          manpowerprod: this.InsertArray[i].manpowerprod,
          manpowerqlty: this.InsertArray[i].manpowerqlty,
          manpowerothers: this.InsertArray[i].manpowerothers,
          manpowertotal: this.InsertArray[i].manpowertotal,
          weeklyholiday: this.InsertArray[i].weeklyholiday,
          workhours: this.InsertArray[i].workhours,
          shiftdet: this.InsertArray[i].shiftdet,
          shifttime: this.InsertArray[i].shifttime,
          expansionplan: this.InsertArray[i].expansionplan,
          sanctionedpower: this.InsertArray[i].sanctionedpower,
          standbypower: this.InsertArray[i].standbypower,
          AddressProofType: this.InsertArray[i].AddressProofType,
          SMEno: this.InsertArray[i].SMEno,
          PanCardName: this.InsertArray[i].PanCardName,
          GstCertificateName: this.InsertArray[i].GstCertificateName,
          AddressProofName: this.InsertArray[i].AddressProofName,
          BankDetailsName: this.InsertArray[i].BankDetailsName,
          SmeCertificateName: this.InsertArray[i].SmeCertificateName,
          EntryEmpid: String(this.empid),
          UnapproveDate: formattedDate
        });
      }
      this.Error = 'Are Sure to unapprove?';
      this.userHeader = 'Warning!!!';
      this.opendialog();
      this.dialogRef.afterClosed().subscribe(async (confirm: boolean) => {
        if (!confirm) return;
        const dialogPromises = this.selectedrowArray.map((row, index) => {
          return new Promise<void>((resolve, reject) => {
            this.service.unapproveCheck(row.partyid).subscribe((result: any) => {
              const { sup_type, pur_approved, fin_approved } = result[0];
              const shouldShowDialog =
                (sup_type === 'P' || sup_type === 'N') &&
                ((pur_approved === 'N' && fin_approved === 'Y') || (pur_approved === 'Y' && fin_approved === 'N') || (pur_approved === 'Y' && fin_approved === 'Y'));
              if (shouldShowDialog) {
                const finApproved = fin_approved === 'Y';
                const purApproved = pur_approved === 'Y';
                const msg =
                  finApproved && purApproved
                    ? `In Finance & Purchase, ${row.name} is approved. Provide a reason for Unapproval.`
                    : finApproved
                      ? `In Finance, ${row.name} is approved. Provide a reason for Unapproval.`
                      : `In Purchase, ${row.name} is approved. Provide a reason for Unapproval.`;
                const dialogRef = this.dialog.open(DialogCompComponent, {
                  width: '450px',
                  disableClose: true,
                  hasBackdrop: true,
                  data: {
                    Type: 'Reason',
                    Msg: msg
                  }
                });
                dialogRef.afterClosed().subscribe((dialogResult) => {
                  if (dialogResult?.approved && dialogResult.reason) {
                    this.emailArray.push({
                      empid: this.empid,
                      reason: dialogResult.reason,
                      code: this.suppliercode,
                      name: this.InsertArray[index].name,
                      address: this.InsertArray[index].address,
                      EntryEmpId: this.InsertArray[index].EntryEmpId,
                      ApprovedEmp: finApproved
                        ? this.InsertArray[index].fin_approvalby
                        : this.InsertArray[index].pur_approvalby
                    });

                    this.service.email(this.emailArray).subscribe(() => {
                      this.emailArray = [];
                      resolve();
                    });
                  } else {
                    this.Error = 'Unapproval cancelled due to no reason provided.';
                    this.userHeader = 'Information';
                    this.opendialog();
                    reject();
                  }
                });
              } else {
                resolve();
              }
            });
          });
        });
        try {
          await Promise.all(dialogPromises);
          this.service.unapprove(this.approveArray).subscribe((result: any) => {
            this.Error = result.message;
            this.userHeader = 'Information';
            this.opendialog();
            this.tableArray = []
            this.selectedrowArray = []
            this.lastselectedRow = []
            this.inputArray = []
            this.selectinputArray = []
            this.approveArray = []
            this.selectinputArray = []
            this.InsertArray = []
            this.ApproveCheckArray = []
            this.select1 = []
            this.input1 = []
            this.resultArray = []
            this.partyArray = []
            this.emailArray = []
            this.AreaArray = []
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
            this.insertCalled = false
            this.AddressProofType = ''
            this.checkapprove = 0
            this.orgId = 0
            this.countryid = 0
            this.stateid = 0
            this.areaid = 0
            this.isEditMode = false;
            this.Editsave = []
            this.CountryArray = []
            this.stateArray = []
            this.Error = ''
            this.userHeader = ''
            this.table()
          });
        } catch (err) {
          this.Error = 'Unapproval cancelled.';
          this.userHeader = 'Information';
          this.opendialog();
        }
      });
    } else {
      this.Error = 'Select the Rows to Approve';
      this.userHeader = 'Information';
      this.opendialog();
    }
  }

  //   unapprove() {
  //   this.approveArray = [];

  //   for (let i = 0; i < this.selectedrowArray.length; i++) {
  //     const merged = {
  //       ...this.selectinputArray[i],
  //       ...this.selectedrowArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }

  //   if (this.selectedrowArray.length > 0) {
  //     const datePipe = new DatePipe('en-US');
  //     const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');

  //     for (let i = 0; i < this.selectedrowArray.length; i++) {
  //       this.approveArray.push({
  //         Partyid: this.selectedrowArray[i].partyid,
  //         code: this.suppliercode,
  //         name: this.InsertArray[i].name,
  //         address: this.InsertArray[i].address,
  //         issupplier: this.InsertArray[i].IsSupplier,
  //         IsSubcontractor: this.InsertArray[i].IsSubcontractor,
  //         IsCustomer: this.InsertArray[i].IsCustomer,
  //         partygroup: this.selectedrowArray[i].PartyGroup,
  //         partytype: this.InsertArray[i].partytype,
  //         contact: this.InsertArray[i].contact,
  //         phone: this.InsertArray[i].phone,
  //         email: this.InsertArray[i].email,
  //         web_site: this.InsertArray[i].web_site,
  //         pannumber: this.InsertArray[i].pannumber,
  //         pincode: this.InsertArray[i].pincode,
  //         currid: this.InsertArray[i].currid,
  //         stateid: this.InsertArray[i].stateid,
  //         countryid: this.InsertArray[i].countryid,
  //         cityid: this.InsertArray[i].cityid,
  //         creditperiod: this.InsertArray[i].Creditperiod,
  //         gstno: this.InsertArray[i].gstno,
  //         sup_eccno: this.InsertArray[i].sup_eccno,
  //         ctypeid: this.InsertArray[i].ctypeid,
  //         establishment: this.InsertArray[i].establishment,
  //         executive: this.InsertArray[i].executive,
  //         majcustomer: this.InsertArray[i].majcustomer,
  //         capital: this.InsertArray[i].capital,
  //         ssiregno: this.InsertArray[i].ssiregno,
  //         bankersname: this.InsertArray[i].bankersname,
  //         org_type: this.InsertArray[i].org_type,
  //         sup_type: this.InsertArray[i].sup_type,
  //         machdet: this.InsertArray[i].machdet,
  //         measinst: this.InsertArray[i].measinst,
  //         qltysystem: this.InsertArray[i].qltysystem,
  //         manpowerprod: this.InsertArray[i].manpowerprod,
  //         manpowerqlty: this.InsertArray[i].manpowerqlty,
  //         manpowerothers: this.InsertArray[i].manpowerothers,
  //         manpowertotal: this.InsertArray[i].manpowertotal,
  //         weeklyholiday: this.InsertArray[i].weeklyholiday,
  //         workhours: this.InsertArray[i].workhours,
  //         shiftdet: this.InsertArray[i].shiftdet,
  //         shifttime: this.InsertArray[i].shifttime,
  //         expansionplan: this.InsertArray[i].expansionplan,
  //         sanctionedpower: this.InsertArray[i].sanctionedpower,
  //         standbypower: this.InsertArray[i].standbypower,
  //         AddressProofType: this.InsertArray[i].AddressProofType,
  //         SMEno: this.InsertArray[i].SMEno,
  //         PanCardName: this.InsertArray[i].PanCardName,
  //         GstCertificateName: this.InsertArray[i].GstCertificateName,
  //         AddressProofName: this.InsertArray[i].AddressProofName,
  //         BankDetailsName: this.InsertArray[i].BankDetailsName,
  //         SmeCertificateName: this.InsertArray[i].SmeCertificateName,
  //         EntryEmpid: String(this.empid),
  //         UnapproveDate: formattedDate
  //       });
  //     }

  //     this.Error = 'Are Sure to unapprove?';
  //     this.userHeader = 'Warning!!!';
  //     this.opendialog();

  //     this.dialogRef.afterClosed().subscribe(async (confirm: boolean) => {
  //       if (!confirm) return;

  //       const dialogPromises = this.selectedrowArray.map((row, index) => {
  //         return new Promise<void>((resolve) => {
  //           this.service.unapproveCheck(row.partyid).subscribe((result: any) => {
  //             const { sup_type, pur_approved, fin_approved } = result[0];

  //             const shouldShowDialog =
  //               (sup_type === 'P' && ((pur_approved === 'N' && fin_approved === 'Y') || (pur_approved === 'Y' && fin_approved === 'N'))) ||
  //               (sup_type === 'N' && ((pur_approved === 'N' && fin_approved === 'Y') || (pur_approved === 'Y' && fin_approved === 'N')));

  //             if (shouldShowDialog) {
  //               const finApproved = fin_approved === 'Y';
  //               const purApproved = pur_approved === 'Y';
  //               const msg =
  //                 finApproved && purApproved
  //                   ? `In Finance & Purchase, ${row.name} is approved. Provide a reason for Unapproval.`
  //                   : finApproved
  //                   ? `In Finance, ${row.name} is approved. Provide a reason for Unapproval.`
  //                   : `In Purchase, ${row.name} is approved. Provide a reason for Unapproval.`;

  //               const dialogRef = this.dialog.open(DialogCompComponent, {
  //                 width: '450px',
  //                 disableClose: true,
  //                 hasBackdrop: true,
  //                 data: {
  //                   Type: 'Reason',
  //                   Msg: msg
  //                 }
  //               });

  //               dialogRef.afterClosed().subscribe((dialogResult) => {
  //                 if (dialogResult?.approved && dialogResult.reason) {
  //                   this.emailArray.push({
  //                     empid: this.empid,
  //                     reason: dialogResult.reason,
  //                     code: this.suppliercode,
  //                     name: this.InsertArray[index].name,
  //                     address: this.InsertArray[index].address,
  //                     EntryEmpId: this.InsertArray[index].EntryEmpId,
  //                     ApprovedEmp: finApproved
  //                       ? this.InsertArray[index].fin_approvalby
  //                       : this.InsertArray[index].pur_approvalby
  //                   });

  //                   this.service.email(this.emailArray).subscribe(() => {
  //                     this.emailArray = [];
  //                     resolve();
  //                   });
  //                 } else {
  //                   console.log('Dialog cancelled');
  //                   resolve();
  //                 }
  //               });
  //             } else {
  //               resolve(); // No dialog needed
  //             }
  //           });
  //         });
  //       });

  //       await Promise.all(dialogPromises);
  //       // Proceed with unapproval service after all dialogs resolve
  //       this.service.unapprove(this.approveArray).subscribe((result: any) => {
  //         this.Error = result.message;
  //         this.userHeader = 'Information';
  //         this.opendialog();

  //         // Reset everything
  //         this.tableArray = [];
  //         this.selectedrowArray = [];
  //         this.lastselectedRow = [];
  //         this.inputArray = [];
  //         this.selectinputArray = [];
  //         this.approveArray = [];
  //         this.InsertArray = [];
  //         this.ApproveCheckArray = [];
  //         this.select1 = [];
  //         this.input1 = [];
  //         this.resultArray = [];
  //         this.partyArray = [];
  //         this.emailArray = [];
  //         this.suppliercode = null;
  //         this.suppliername = null;
  //         this.phonenumber = null;
  //         this.email = null;
  //         this.fax = null;
  //         this.website = null;
  //         this.pannumber = null;
  //         this.address = null;
  //         this.CountryName = null;
  //         this.StateName = null;
  //         this.AreaName = null;
  //         this.pincode = null;
  //         this.Creditperiod = null;
  //         this.executivename = null;
  //         this.id = null;
  //         this.establishment = null;
  //         this.majorname = null;
  //         this.contactperson = null;
  //         this.partyid = null;
  //         this.supcheck = false;
  //         this.subcheck = false;
  //         this.cuscheck = false;
  //         this.org_type = null;
  //         this.insertCalled = false;
  //         this.AddressProofType = '';
  //         this.checkapprove = 0;
  //         this.Error = '';
  //         this.userHeader = '';
  //         this.table();
  //       });
  //     });
  //   } else {
  //     this.Error = 'Select the Rows to Approve';
  //     this.userHeader = 'Information';
  //     this.opendialog();
  //   }
  // }

  // unapprove() {
  //   this.approveArray = []

  //   for (let i = 0; i < this.selectedrowArray.length; i++) {
  //     const merged = {
  //       ...this.selectinputArray[i],
  //       ...this.selectedrowArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }

  //   if (this.selectedrowArray.length > 0) {
  //     const datePipe = new DatePipe('en-US');
  //     const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
  //     for (let i = 0; i < this.selectedrowArray.length; i++) {
  //       const panCardBuffer = this.selectedrowArray[i].PanCard?.data || '';
  //       const addressProofBuffer = this.selectedrowArray[i].AddressProof?.data || '';
  //       const GstCertificateBuffer = this.selectedrowArray[i].GstCertificate?.data || '';
  //       const BankersBuffer = this.selectedrowArray[i].BankDetails?.data || '';
  //       const SMEBuffer = this.selectedrowArray[i].SmeCertificate?.data || '';

  //       this.approveArray.push({
  //         Partyid: this.selectedrowArray[i].partyid,
  //         code: this.suppliercode,
  //         name: this.InsertArray[i].name,
  //         address: this.InsertArray[i].address,
  //         issupplier: this.InsertArray[i].IsSupplier,
  //         IsSubcontractor: this.InsertArray[i].IsSubcontractor,
  //         IsCustomer: this.InsertArray[i].IsCustomer,
  //         partygroup: this.selectedrowArray[i].PartyGroup,
  //         partytype: this.InsertArray[i].partytype,
  //         contact: this.InsertArray[i].contact,
  //         phone: this.InsertArray[i].phone,
  //         email: this.InsertArray[i].email,
  //         web_site: this.InsertArray[i].web_site,
  //         pannumber: this.InsertArray[i].pannumber,
  //         pincode: this.InsertArray[i].pincode,
  //         currid: this.InsertArray[i].currid,
  //         stateid: this.InsertArray[i].stateid,
  //         countryid: this.InsertArray[i].countryid,
  //         cityid: this.InsertArray[i].cityid,
  //         creditperiod: this.InsertArray[i].Creditperiod,
  //         gstno: this.InsertArray[i].gstno,
  //         sup_eccno: this.InsertArray[i].sup_eccno,
  //         ctypeid: this.InsertArray[i].ctypeid,
  //         establishment: this.InsertArray[i].establishment,
  //         executive: this.InsertArray[i].executive,
  //         majcustomer: this.InsertArray[i].majcustomer,
  //         capital: this.InsertArray[i].capital,
  //         ssiregno: this.InsertArray[i].ssiregno,
  //         bankersname: this.InsertArray[i].bankersname,
  //         org_type: this.InsertArray[i].org_type,
  //         sup_type: this.InsertArray[i].sup_type,
  //         machdet: this.InsertArray[i].machdet,
  //         measinst: this.InsertArray[i].measinst,
  //         qltysystem: this.InsertArray[i].qltysystem,
  //         manpowerprod: this.InsertArray[i].manpowerprod,
  //         manpowerqlty: this.InsertArray[i].manpowerqlty,
  //         manpowerothers: this.InsertArray[i].manpowerothers,
  //         manpowertotal: this.InsertArray[i].manpowertotal,
  //         weeklyholiday: this.InsertArray[i].weeklyholiday,
  //         workhours: this.InsertArray[i].workhours,
  //         shiftdet: this.InsertArray[i].shiftdet,
  //         shifttime: this.InsertArray[i].shifttime,
  //         expansionplan: this.InsertArray[i].expansionplan,
  //         sanctionedpower: this.InsertArray[i].sanctionedpower,
  //         standbypower: this.InsertArray[i].standbypower,
  //         AddressProofType: this.InsertArray[i].AddressProofType,
  //         SMEno: this.InsertArray[i].SMEno,
  //         PanCardName: this.InsertArray[i].PanCardName,
  //         GstCertificateName: this.InsertArray[i].GstCertificateName,
  //         AddressProofName: this.InsertArray[i].AddressProofName,
  //         BankDetailsName: this.InsertArray[i].BankDetailsName,
  //         SmeCertificateName: this.InsertArray[i].SmeCertificateName,
  //         EntryEmpid: String(this.empid),
  //         UnapproveDate: formattedDate
  //       });
  //     }
  //     console.log(this.approveArray, 'this.approvaArray');

  //     this.Error = 'Are Sure to unapprove?'
  //     this.userHeader = 'Warning!!!'
  //     this.opendialog()
  //     this.dialogRef.afterClosed().subscribe((result: boolean) => {
  //       if (result) {
  //         for (let i = 0; i < this.selectedrowArray.length; i++) {
  //           this.service.unapproveCheck(this.selectedrowArray[i].partyid).subscribe((result: any) => {
  //             if (result[0].sup_type === 'P') {
  //               if (result[0].pur_approved === 'N' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   disableClose: true, // <--- Allow click outside to close
  //                   hasBackdrop: true,   // <--- Show backdrop (default true)
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Finance, ${this.selectedrowArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.suppliercode,
  //                         name: this.InsertArray[i].name,
  //                         address: this.InsertArray[i].address,
  //                         EntryEmpId: this.InsertArray[i].EntryEmpId,
  //                         ApprovedEmp: this.InsertArray[i].fin_approvalby
  //                       });
  //                     }
  //                     this.service.email(this.emailArray).subscribe((response: any) => {
  //                       this.emailArray = []
  //                     });
  //                   } else {
  //                     console.log('User cancelled or did not Unapproval.');
  //                   }
  //                 });
  //               }
  //             }
  //             if (result[0].sup_type === 'N') {
  //               if (result[0].pur_approved === 'N' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   disableClose: true, // <--- Allow click outside to close
  //                   hasBackdrop: true,   // <--- Show backdrop (default true)
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Finance, ${this.selectedrowArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.suppliercode,
  //                         name: this.InsertArray[i].name,
  //                         address: this.InsertArray[i].address,
  //                         EntryEmpId: this.InsertArray[i].EntryEmpId,
  //                         ApprovedEmp: this.InsertArray[i].fin_approvalby
  //                       });
  //                     }
  //                     this.service.email(this.emailArray).subscribe((response: any) => {
  //                       this.emailArray = []
  //                     });
  //                   } else {
  //                     console.log('User cancelled or did not Unapproval.');
  //                   }
  //                 });
  //               }
  //             }
  //             if (result[0].sup_type === 'P') {
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'N') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   disableClose: true, // <--- Allow click outside to close
  //                   hasBackdrop: true,   // <--- Show backdrop (default true)
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase, ${this.selectedrowArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });

  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.suppliercode,
  //                         name: this.InsertArray[i].name,
  //                         address: this.InsertArray[i].address,
  //                         EntryEmpId: this.InsertArray[i].EntryEmpId,
  //                         ApprovedEmp: this.InsertArray[i].pur_approvalby
  //                       });
  //                     }
  //                     this.service.email(this.emailArray).subscribe((response: any) => {
  //                       this.emailArray = []
  //                     });
  //                   } else {
  //                     console.log('User cancelled or did not Unapproval.');
  //                   }
  //                 });
  //               }
  //             }
  //             if (result[0].sup_type === 'N') {
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'N') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   disableClose: true, // <--- Allow click outside to close
  //                   hasBackdrop: true,   // <--- Show backdrop (default true)
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase, ${this.selectedrowArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.suppliercode,
  //                         name: this.InsertArray[i].name,
  //                         address: this.InsertArray[i].address,
  //                         EntryEmpId: this.InsertArray[i].EntryEmpId,
  //                         ApprovedEmp: this.InsertArray[i].pur_approvalby
  //                       });
  //                     }
  //                     this.service.email(this.emailArray).subscribe((response: any) => {
  //                       console.log('Email service response:', response);
  //                       this.emailArray = []
  //                     });
  //                   } else {
  //                     console.log('User cancelled or did not Unapproval.');
  //                   }
  //                 });
  //               }
  //             }
  //           });
  //         }          
  //         this.service.unapprove(this.approveArray).subscribe((result: any) => {
  //           this.Error = result.message
  //           this.userHeader = 'Information'
  //           this.opendialog()
  //           this.tableArray = []
  //           this.selectedrowArray = []
  //           this.lastselectedRow = []
  //           this.inputArray = []
  //           this.selectinputArray = []
  //           this.approveArray = []
  //           this.selectinputArray = []
  //           this.InsertArray = []
  //           this.ApproveCheckArray = []
  //           this.select1 = []
  //           this.input1 = []
  //           this.resultArray = []
  //           this.partyArray = []
  //           this.emailArray = []
  //           this.suppliercode = null
  //           this.suppliername = null
  //           this.phonenumber = null
  //           this.email = null
  //           this.fax = null
  //           this.website = null
  //           this.pannumber = null
  //           this.address = null
  //           this.CountryName = null
  //           this.StateName = null
  //           this.AreaName = null
  //           this.pincode = null
  //           this.Creditperiod = null
  //           this.executivename = null
  //           this.id = null
  //           this.establishment = null
  //           this.majorname = null
  //           this.contactperson = null
  //           this.partyid = null
  //           this.supcheck = false
  //           this.subcheck = false
  //           this.cuscheck = false
  //           this.org_type = null
  //           this.partyid = null
  //           this.insertCalled = false
  //           this.AddressProofType = ''
  //           this.checkapprove = 0
  //           this.Error = ''
  //           this.userHeader = ''
  //           this.table()
  //         })
  //       }
  //     })
  //   } else {
  //     this.Error = 'Select the Rows to Approve'
  //     this.userHeader = 'Information'
  //     this.opendialog()
  //   }
  // }
}

