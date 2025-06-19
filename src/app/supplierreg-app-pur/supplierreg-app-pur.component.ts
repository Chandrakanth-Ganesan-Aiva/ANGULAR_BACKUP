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
  selectinputArray: any[] = []
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
  // select(event: any, row: any) {
  //   this.approveArray = []
  //   this.lastselectedRow = []
  //   this.inputArray = []
  //   if (event.target.checked) {
  //     this.selectedrowArray.push(row)
  //     console.log(this.selectedrowArray, 'selected row');
  //   }
  //   else {
  //     this.selectedrowArray = this.selectedrowArray.filter(item => item !== row)
  //     console.log(this.selectedrowArray, 'selectedRow');
  //     // this.selectinputArray = this.selectinputArray.filter(item => item.partyid !== row.partyid);
  //     // console.log(this.selectinputArray, 'select input');
  //     this.lastselectedRow = []
  //     this.inputArray = []
  //     this.suppliercode = null
  //     this.suppliername = null
  //     this.phonenumber = null
  //     this.email = null
  //     this.fax = null
  //     this.website = null
  //     this.pannumber = null
  //     this.address = null
  //     this.CountryName = null
  //     this.StateName = null
  //     this.AreaName = null
  //     this.pincode = null
  //     this.Creditperiod = null
  //     this.executivename = null
  //     this.id = null
  //     this.establishment = null
  //     this.majorname = null
  //     this.contactperson = null
  //     this.partyid = null
  //     this.supcheck = false
  //     this.subcheck = false
  //     this.cuscheck = false
  //     this.org_type = null
  //     this.partyid = null
  //     this.AddressProofType = ''
  //   }
  //   if (this.selectedrowArray.length > 0) {
  //     this.lastselectedRow.push(this.selectedrowArray.length > 0 ? this.selectedrowArray[this.selectedrowArray.length - 1] : null)
  //     if (this.lastselectedRow.length > 0) {
  //       this.service.input(this.lastselectedRow[0].code).subscribe((result: any) => {
  //         this.inputArray = result
  //         this.selectinputArray.push(result[0])
  //         if (this.inputArray.length > 0) {
  //           this.service.org(this.inputArray[0].org_type).subscribe((result: any) => {
  //             this.org_type = result[0].orgname
  //             if (this.lastselectedRow.length > 0 && this.inputArray.length) {
  //               this.inputfield()
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }
  //   this.selectinputArray = this.selectinputArray.filter(item => item.partyid !== row.partyid);
  //   console.log(this.selectinputArray);
  // }
  select(event: any, row: any) {
    this.approveArray = [];

    if (event.target.checked) {
      // Add to selected row
      this.selectedrowArray.push(row);
      console.log(this.selectedrowArray, 'selected row');

      // Fetch and add input
      this.service.input(row.code).subscribe((result: any) => {
        if (result?.length > 0) {
          this.inputArray = result;
          const inputItem = result[0];

          // Avoid duplicates
          const alreadyExists = this.selectinputArray.some(item => item.partyid === inputItem.partyid);
          if (!alreadyExists) {
            this.selectinputArray.push(inputItem);
            console.log(this.selectinputArray, 'select input Array');
          }

          // Fetch org_type
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
      // Remove from selected rows
      this.selectedrowArray = this.selectedrowArray.filter(item => item !== row);

      // Remove from input array
      this.selectinputArray = this.selectinputArray.filter(item => item.partyid !== row.partyid);
      console.log(this.selectinputArray, 'selectinputArray');

      // Reset form if no more rows are selected or this was the last row selected
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

      for (let i = 0; i < this.approveArray.length; i++) {
        this.service.ApproveCheck(this.approveArray[i].partyid).subscribe((result: any) => {
          console.log(result, 'res')
          if (this.approveArray[i].sup_type == 'P') {
            if (this.approveArray[i].fin_approved == 'Y' && this.approveArray[i].pur_approved == 'Y' && this.approveArray[i].qc_approved == 'Y') {

            }
          }
          if (this.approveArray[i].sup_type == 'N') {

          }

        })
      }

      // this.Error = 'Are Sure to Approve?'
      //   this.userHeader = 'Save'
      //   this.opendialog()
      //   this.dialogRef.afterClosed().subscribe((result: boolean) => {
      //     if (result) {
      //       // console.log(this.approveArray);
      //       this.service.approve(this.approveArray).subscribe((result: any) => {
      //         this.Error = result.message
      //         this.userHeader = 'Information'
      //         this.opendialog()
      //         this.tableArray = []
      //         this.selectedrowArray = []
      //         this.lastselectedRow = []
      //         this.inputArray = []
      //         this.selectinputArray = []
      //         this.suppliercode = null
      //         this.suppliername = null
      //         this.phonenumber = null
      //         this.email = null
      //         this.fax = null
      //         this.website = null
      //         this.pannumber = null
      //         this.address = null
      //         this.CountryName = null
      //         this.StateName = null
      //         this.AreaName = null
      //         this.pincode = null
      //         this.Creditperiod = null
      //         this.executivename = null
      //         this.id = null
      //         this.establishment = null
      //         this.majorname = null
      //         this.contactperson = null
      //         this.partyid = null
      //         this.supcheck = false
      //         this.subcheck = false
      //         this.cuscheck = false
      //         this.org_type = null
      //         this.partyid = null
      //         this.Error = ''
      //         this.userHeader = ''
      //         this.AddressProofType = ''
      //         this.table()
      //       })
      //     }
      //   })
      // } else {
      //   this.Error = 'Select the Rows to Approve'
      //   this.userHeader = 'Information'
      //   this.opendialog()
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
        this.selectinputArray = []
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
  viewAddress(): void {
    if (this.partyid) {
      const url = `http://192.168.99.80:5000/Purchase/Approvals/api/supplier/addressproof/${this.partyid}`;
      window.open(url, '_blank'); // Opens in new tab
    } else {
      console.warn('Party ID is missing!');
    }
  }
  unapprove() {
    console.log(this.selectedrowArray);
    console.log(this.selectinputArray);
    if (this.selectedrowArray.length > 0) {
      console.log(this.selectedrowArray, 'selectedrow');
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      for (let i = 0; i < this.selectedrowArray.length; i++) {
        console.log(this.selectedrowArray[i].AddressProof.data, 'Address');

        const panCardBuffer = this.selectedrowArray[i].PanCard?.data || '';
        const addressProofBuffer = this.selectedrowArray[i].AddressProof?.data || '';
        const GstCertificateBuffer = this.selectedrowArray[i].GstCertificate?.data || '';
        const BankersBuffer = this.selectedrowArray[i].BankDetails?.data || '';
        const SMEBuffer = this.selectedrowArray[i].SmeCertificate?.data || '';

        // let panCardBase64 = null;
        // let addressProofBase64 = null;
        // let gstBase64 = null;
        // let BankersBase64 = null
        // let SMEBase64 = null
        // if (panCardBuffer && panCardBuffer.type === 'Buffer' && Array.isArray(panCardBuffer.data)) {
        //   const uint8Array = new Uint8Array(panCardBuffer.data);
        //   panCardBase64 = btoa(String.fromCharCode(...uint8Array));
        // }
        // if (addressProofBuffer && addressProofBuffer.type === 'Buffer' && Array.isArray(addressProofBuffer.data)) {
        //   const uint8Array = new Uint8Array(addressProofBuffer.data);
        //   addressProofBase64 = btoa(String.fromCharCode(...uint8Array));
        // }
        // if (GstCertificateBuffer && GstCertificateBuffer.type === 'Buffer' && Array.isArray(GstCertificateBuffer.data)) {
        //   const uint8Array = new Uint8Array(GstCertificateBuffer.data);
        //   gstBase64 = btoa(String.fromCharCode(...uint8Array))
        // }
        // if (BankersBuffer && BankersBuffer.type === 'Buffer' && Array.isArray(BankersBuffer.data)) {
        //   const uint8Array = new Uint8Array(BankersBuffer.data)
        //   BankersBase64 = btoa(String.fromCharCode(...uint8Array))
        // }
        // if (SMEBuffer && SMEBuffer.type === 'Buffer' && Array.isArray(SMEBuffer.data)) {
        //   const uint8Array = new Uint8Array(SMEBuffer.data)
        //   SMEBase64 = btoa(String.fromCharCode(...uint8Array))
        // }

        this.approveArray.push({
          Partyid: this.selectedrowArray[i].partyid,
          code: this.suppliercode,
          name: this.selectedrowArray[i].name,
          address: this.selectinputArray[i].address,
          issupplier: this.selectedrowArray[i].IsSupplier,
          IsSubcontractor: this.selectedrowArray[i].IsSubcontractor,
          IsCustomer: this.selectedrowArray[i].IsSubcontractor,
          partygroup: this.selectedrowArray[i].PartyGroup,
          partytype: this.selectedrowArray[i].partytype,
          contact: this.selectinputArray[i].contact,
          phone: this.selectedrowArray[i].phone,
          email: this.selectinputArray[i].email,
          web_site: this.selectinputArray[i].web_site,
          pannumber: this.selectinputArray[i].pannumber,
          pincode: this.selectedrowArray[i].pincode,
          currid: this.selectedrowArray[i].currid,
          stateid: this.selectedrowArray[i].stateid,
          countryid: this.selectedrowArray[i].countryid,
          cityid: this.selectedrowArray[i].cityid,
          creditperiod: this.selectedrowArray[i].Creditperiod,
          gstno: this.selectedrowArray[i].gstno,
          sup_eccno: this.selectinputArray[i].sup_eccno,
          ctypeid: this.selectedrowArray[i].ctypeid,
          establishment: this.selectinputArray[i].establishment,
          executive: this.selectinputArray[i].executive,
          majcustomer: this.selectinputArray[i].majcustomer,
          capital: this.selectinputArray[i].capital,
          ssiregno: this.selectinputArray[i].ssiregno,
          bankersname: this.selectinputArray[i].bankersname,
          org_type: this.selectinputArray[i].org_type,
          sup_type: this.selectedrowArray[i].sup_type,
          machdet: this.selectinputArray[i].machdet,
          measinst: this.selectinputArray[i].measinst,
          qltysystem: this.selectinputArray[i].qltysystem,
          manpowerprod: this.selectinputArray[i].manpowerprod,
          manpowerqlty: this.selectinputArray[i].manpowerqlty,
          manpowerothers: this.selectinputArray[i].manpowerothers,
          manpowertotal: this.selectinputArray[i].manpowertotal,
          weeklyholiday: this.selectinputArray[i].weeklyholiday,
          workhours: this.selectinputArray[i].workhours,
          shiftdet: this.selectinputArray[i].shiftdet,
          shifttime: this.selectinputArray[i].shifttime,
          expansionplan: this.selectinputArray[i].expansionplan,
          sanctionedpower: this.selectinputArray[i].sanctionedpower,
          standbypower: this.selectinputArray[i].standbypower,
          AddressProofType: this.selectedrowArray[i].AddressProofType,
          SMEno: this.selectedrowArray[i].SMEno,
          PanCardName: this.selectedrowArray[i].PanCardName,
          GstCertificateName: this.selectedrowArray[i].GstCertificateName,
          AddressProofName: this.selectedrowArray[i].AddressProofName,
          BankDetailsName: this.selectedrowArray[i].BankDetailsName,
          SmeCertificateName: this.selectedrowArray[i].SmeCertificateName,
        });
        console.log(this.approveArray, 'App');
      }
      this.Error = 'Are Sure to unapprove?'
      this.userHeader = 'Warning!!!'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          console.log(this.approveArray);
          this.service.unapprove(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.tableArray = []
            this.selectedrowArray = []
            this.lastselectedRow = []
            this.inputArray = []
            this.selectinputArray = []
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
          })
        }
      })
    } else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
}