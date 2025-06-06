import { Component } from '@angular/core';
import { SupplierregService } from '../service/supplierreg.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { event } from 'jquery';
@Component({
  selector: 'app-supplierreg',
  templateUrl: './supplierreg.component.html',
  styleUrl: './supplierreg.component.scss'
})
export class SupplierregComponent {
  type: string = '';
  supplier: string = 'General'
  show: boolean = false;
  tabhide: boolean = false;
  firstcard: boolean = true
  orghide: boolean = false
  suppliercode: string | null = null
  selectedCountryID: number | null = null
  selectedStateID: number | null = null
  table: boolean = false
  area: number | null = null
  newOrganisation: string = ''
  selectorgname: string = ''
  suppname: string = ''
  contactperson: string = ''
  contactno: string = ''
  email: string = ''
  faxno: string = ''
  website: string = ''
  panno: string = ''
  Establishyear: string = ''
  executive: string = ''
  majorCust: string = ''
  companyaddr: string = ''
  Addressprooftype: string = ''
  pincode: string = ''
  creditperiod: string = ''
  totalcapInv: string = ''
  Bankersname: string = ''
  ssi: string = ''
  gstno: string = ''
  registeredVendor: boolean = true
  ecc: string = ''
  currencytype: string = ''
  currencyid: any
  sme: string = ''
  smeno: string = ''
  tngstno: string = ''
  cgstno: string = ''
  servicetaxNo: string = ''
  partytype: string = ''
  ledger: string = ''
  selectedLedger: any = null
  selectedCurrency: any = null;
  machdetails: string = ''
  measuring: string = ''
  qualitySystem: string = ''
  production: string = ''
  quality: string = ''
  others: string = ''
  total: string = ''
  weeklyholiday: string = ''
  workinghours: string = ''
  shiftDetails: string = ''
  shiftTimings: string = ''
  expansionPlan: string = ''
  sanctionedPowAvl: string = ''
  StandByPower: string = ''
  userHeader: string = ''
  Error: string = ''
  uploadedFiles: { [key: string]: File } = {};
  gstshow: boolean = true
  //Arrays
  OrganArray: any[] = []
  countryArray: any[] = []
  currencyArray: any[] = []
  ledgerArray: any[] = []
  ledgerArrayList: any[] = []
  partyType: any[] = []
  stateArray: any[] = []
  areaArray: any[] = []
  newOrgArray: any[] = []
  SaveArray: any[] = []
  partyArray: any[] = []
  partytypeListArray: any[] = []
  LedgerGroupListArray: any[] = []
  constructor(private service: SupplierregService, private dialog: MatDialog, private http: HttpClient) { }
  ngOnInit() {
    //Organisation
    this.service.organisation().subscribe((result: any) => {
      this.OrganArray = result
    })
    //Country
    this.service.country().subscribe((result: any) => {
      this.countryArray = result;
    })
    //Currency
    this.service.currency().subscribe((result: any) => {
      this.currencyArray = result
    })
    //LedgerGroup
    this.service.ledger().subscribe((result: any) => {
      this.ledgerArray = result
      console.log(this.ledgerArray);
    })
    //Party Type
    this.service.party().subscribe((result: any) => {
      this.partyType = result
    })
  }
  Selectedtype(event: Event, selected: string) {
    this.partytypeListArray = []
    this.partytype = ''
    this.LedgerGroupListArray = []
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.type = selected;
      this.show = true;
      if (this.type === 'supplier') {
        this.service.supplier().subscribe((result: any) => {
          const suppliercode = '000000'
          const no = result[0][""]
          const len = String(no).length
          const number = suppliercode.slice(0, -(len))
          this.suppliercode = 'CRE' + number + no
        })
        this.partytypeListArray.push(this.partyType[2])
        this.LedgerGroupListArray.push(this.ledgerArray[1], this.ledgerArray[5], this.ledgerArray[7])
      }
      if (this.type === 'subcontractor') {
        this.service.subcontractor().subscribe((result: any) => {
          const suppliercode = '000000'
          const no = result[0][""]
          const len = String(no).length
          const number = suppliercode.slice(0, -(len))
          this.suppliercode = 'SCO' + number + no
        })
        this.partytypeListArray.push(this.partyType[3])
        this.LedgerGroupListArray.push(this.ledgerArray[6])
      }
      if (this.type === 'customer') {
        this.service.customer().subscribe((result: any) => {
          const suppliercode = '000000'
          const no = result[0][""]
          const len = String(no).length
          const number = suppliercode.slice(0, -(len))
          this.suppliercode = 'DRS' + number + no
        })
      }
    } else {
      this.type = '';
      this.show = false;
      this.suppliercode = null
      this.partytypeListArray = []
      this.partytype = ''
      this.clear()
    }
  }
  SelectedSupplier(event: any, selectedType: string) {
    this.supplier = selectedType;
    this.tabhide = selectedType === 'Production';
  }
  suppnamefun() {
    if (this.suppname) {
      this.table = true
      this.service.partyname(this.suppname).subscribe((result: any) => {
        this.partyArray = result
      })
    }
    else {
      this.table = false
      this.partyArray = []
    }
  }
  add() {
    this.orghide = true
  }
  close() {
    this.orghide = false
  }
  Country() {
    this.stateArray = []
    this.areaArray = []
    this.service.fetchstateid(Number(this.selectedCountryID)).subscribe((result: any) => {
      if (result) {
        this.stateArray = result
      }
    })
  }
  state() {
    this.areaArray = []
    this.service.fetchareaid(Number(this.selectedStateID)).subscribe((result: any) => {
      this.areaArray = result
    })
  }
  selectedArea() {
  }
  orgSave() {
    if (this.newOrganisation) {
      this.OrganArray.push({ orgname: this.newOrganisation })
      const org = [{ orgname: this.newOrganisation }]
      this.service.newOrg(org).subscribe((result: any) => {
        this.newOrganisation = ''
        this.Error = result.message
        this.userHeader = 'Information'
        this.opendialog()
        this.service.organisation().subscribe((result: any) => {
          this.OrganArray = result
        })
      })
    }
    else {
      this.Error = 'Enter Something'
      this.userHeader = 'Information'
      this.opendialog()
      this.selectorgname = ''
    }
  }
  selectorgnamefunc() {
  }
  ledgerfun() {
    this.ledger = this.selectedLedger?.AccountId
  }
  currid() {
    this.currencyid = this.selectedCurrency?.currid;

    // Only update the available options; don't reset selected values
    this.partytypeListArray = [];
    this.LedgerGroupListArray = [];
    this.ledger = ''
    this.partytype = ''
    if (this.type === 'supplier') {
      this.partytypeListArray.push(this.partyType[2]);
      this.LedgerGroupListArray.push(this.ledgerArray[1], this.ledgerArray[5], this.ledgerArray[7])
    }

    if (this.type === 'subcontractor') {
      this.partytypeListArray.push(this.partyType[3]);
      this.LedgerGroupListArray.push(this.ledgerArray[6])
    }

    if (this.type === 'customer') {
      if (this.currencyid == 1) {
        this.partytypeListArray.push(this.partyType[0]); // Domestic
        this.LedgerGroupListArray.push(this.ledgerArray[8], this.ledgerArray[9]);
      } else {
        this.partytypeListArray.push(this.partyType[1]); // Foreign
        this.LedgerGroupListArray.push(this.ledgerArray[10]);
      }
    }

    // Optionally clear selected values only if they are invalid
    if (!this.partytypeListArray.find(pt => pt.CTypeId === this.partytype)) {
      this.partytype = '';
    }

    if (!this.LedgerGroupListArray.includes(this.selectedLedger)) {
      this.selectedLedger = '';
    }
  }

  blockInvalidKeys(event: KeyboardEvent): void {
    // Block e, E, +, -, and Ctrl+V
    if (['e', 'E', '+', '-'].includes(event.key) || (event.ctrlKey && event.key.toLowerCase() === 'v')) {
      event.preventDefault();
    }
  }

  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
  readonly MESSAGES = {
    basicInfo: 'Please fill Supplier Name / Contact Person / Contact No / Company Address / Country / State / Area / Pin code / Credit Period',
    additionalInfo: 'Please fill Total Capital Investment / Bankers Name/Address / Currency Type / Party Type / Ledger group',
    gstInvalid: 'Please fill Gst No. with 15 digit',
    confirmMsg: 'Are you sure to Approve?'
  };

  onSubmit(): void {
    console.log(this.selectedLedger);
    console.log(this.partytype);
    if (!this.selectedLedger || !this.partytype ||
      this.selectedLedger === 'null' || this.partytype === 'null' ||
      this.selectedLedger === 'undefined' || this.partytype === 'undefined') {
      this.Error = 'Please check Party Type / Ledger Group';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }

    const isBasicValid =
      this.suppname && this.contactperson &&
      this.contactno && this.email && this.selectorgname && this.companyaddr && this.Addressprooftype && this.selectedCountryID &&
      this.selectedStateID && this.area && this.pincode && this.creditperiod || this.creditperiod == '0';

    if (this.panno && !this.uploadedFiles['panCard']) {
      this.Error = 'Please upload PAN Card if PAN Number is provided';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }
    if (!this.panno && this.uploadedFiles['panCard']) {
      this.Error = 'Please fill Pan Number';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }
    if (this.companyaddr && this.Addressprooftype && !this.uploadedFiles['addressProof']) {
      this.Error = 'Please upload Address Proof ';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }
    const isAdditionalValid =
      this.totalcapInv && this.Bankersname && this.currencyid &&
      this.partytype && this.selectedLedger;

    if (!isBasicValid) {
      this.Error = 'Please fill Supplier Name / Contact Person / Contact No / E-Mail / Organisation Type / Company Address / Address proof type /Country / State / Area / Pin code / Credit Period ';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }
    if (!isAdditionalValid) {
      this.Error = 'Please fill Total Capital Investment / Bankers Name/Address / Currency Type / Party Type / Ledger group';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }
    if (this.smeno && !this.uploadedFiles['smeCertificate']) {
      this.Error = 'Please upload SME Certificate';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }
    if (!this.smeno && this.uploadedFiles['smeCertificate']) {
      this.Error = 'Please fill SME No.';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }
    if (this.Bankersname && !this.uploadedFiles['bankDetails']) {
      this.Error = 'Please upload Bank details';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }

    const regVendor = this.registeredVendor;
    if (regVendor) {
      if (this.gstno.length !== 15) {
        this.Error = 'Please fill Gst No. with 15 digit';
        this.userHeader = 'Information';
        this.opendialog();
        return;
      }
      if (this.gstno.length == 15) {
        if (!this.uploadedFiles['gstCertificate']?.name) {
          this.Error = 'Please fill upload Gst Certificate';
          this.userHeader = 'Information';
          this.opendialog();
          return;
        }
      }
      if (!this.gstno && this.uploadedFiles['gstCertificate']?.name) {
        this.Error = 'Please fill Gst No. with 15 digit';
        this.userHeader = 'Information';
        this.opendialog();
        return;
      }
    }
    this.Error = 'Are you sure to Approve?';
    this.userHeader = 'Save';
    this.opendialog();

    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const supplierData = {
          code: this.suppliercode,
          name: this.suppname,
          address: this.companyaddr,
          issupplier: this.type === 'supplier' ? 'Y' : 'N',
          IsSubcontractor: this.type === 'subcontractor' ? 'Y' : 'N',
          IsCustomer: this.type === 'customer' ? 'Y' : 'N',
          partygroup: this.selectedLedger,
          partytype: this.selectedLedger,
          contact: this.contactno,
          phone: this.contactno,
          email: this.email,
          web_site: this.website,
          pannumber: this.panno,
          pincode: this.pincode,
          currid: this.currencyid,
          stateid: Number(this.selectedStateID),
          countryid: Number(this.selectedCountryID),
          cityid: Number(this.area),
          creditperiod: Number(this.creditperiod),
          gstno: this.gstno,
          sup_eccno: this.ecc,
          ctypeid: Number(this.partytype),
          establishment: Number(this.Establishyear),
          executive: this.executive,
          majcustomer: this.majorCust,
          capital: Number(this.totalcapInv),
          ssiregno: this.ssi,
          bankersname: this.Bankersname,
          org_type: Number(this.selectorgname),
          sup_type: this.supplier === 'Production' ? 'P' : 'N',
          machdet: this.machdetails,
          measinst: this.measuring,
          qltysystem: this.qualitySystem,
          manpowerprod: this.production,
          manpowerqlty: this.quality,
          manpowerothers: this.others,
          manpowertotal: this.total,
          weeklyholiday: this.weeklyholiday,
          workhours: this.workinghours,
          shiftdet: this.shiftDetails,
          shifttime: this.shiftTimings,
          expansionplan: this.expansionPlan,
          sanctionedpower: this.sanctionedPowAvl,
          standbypower: this.StandByPower,
          AddressProofType: this.Addressprooftype,
          SMEno: this.smeno,
          PanCardName: this.uploadedFiles['panCard']?.name || '',
          GstCertificateName: this.uploadedFiles['gstCertificate']?.name || '',
          AddressProofName: this.uploadedFiles['addressProof']?.name || '',
          BankDetailsName: this.uploadedFiles['bankDetails']?.name || '',
          SmeCertificateName: this.uploadedFiles['smeCertificate']?.name || ''
        };
        console.log(supplierData, 'supplierData');
        const formData = new FormData();
        Object.entries(supplierData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        const fileFields = {
          PanCard: 'panCard',
          GstCertificate: 'gstCertificate',
          AddressProof: 'addressProof',
          BankDetails: 'bankDetails',
          SmeCertificate: 'smeCertificate'
        };
        for (const [formKey, fieldKey] of Object.entries(fileFields)) {
          const file = this.uploadedFiles[fieldKey];
          console.log(file);
          if (file) {
            formData.append(formKey, file, file.name);
            console.log(formData);
          }
        }
        this.http.post('http://localhost:5000/Purchase/Master/supregsaveDocuments', formData).subscribe({
          next: (res: any) => {
            console.log('Upload successful', res);
            this.Error = res.message
            this.userHeader = 'Information';
            this.opendialog();
            this.clear()
          },
          error: (err) => {
            console.error('Upload failed', err);
          }
        });
      }
    });
  }
  fileUrls: { [key: string]: string } = {};

  onFileSelected(event: any, fieldName: string) {
    const fileInput = event.target as HTMLInputElement;
    const file: File | undefined = fileInput.files?.[0];

    if (file) {
      this.uploadedFiles[fieldName] = file;

      // Create a blob URL for viewing
      const fileURL = URL.createObjectURL(file);
      this.fileUrls[fieldName] = fileURL;
    } else {
      delete this.uploadedFiles[fieldName];
      delete this.fileUrls[fieldName];
    }
  }
  viewFile(fieldName: string) {
    const fileUrl = this.fileUrls[fieldName];
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      this.Error = 'No file uploaded yet'
      this.userHeader = 'Information';
      this.opendialog();
    }
  }
  clear() {
    this.Error = 'Are your sure to Clear?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.type = '';
        this.supplier = 'General'
        this.show = false;
        this.tabhide = false;
        this.firstcard = true
        this.orghide = false
        this.suppliercode = null
        this.selectedCountryID = null
        this.selectedStateID = null
        this.table = false
        this.area = null
        this.newOrganisation = ''
        this.selectorgname = ''
        this.suppname = ''
        this.contactperson = ''
        this.contactno = ''
        this.email = ''
        this.faxno = ''
        this.website = ''
        this.panno = ''
        this.Establishyear = ''
        this.executive = ''
        this.majorCust = ''
        this.companyaddr = ''
        this.pincode = ''
        this.creditperiod = ''
        this.totalcapInv = ''
        this.Bankersname = ''
        this.ssi = ''
        this.gstno = ''
        this.registeredVendor = true
        this.ecc = ''
        this.currencytype = ''
        this.currencyid
        this.sme = ''
        this.tngstno = ''
        this.cgstno = ''
        this.servicetaxNo = ''
        this.partytype = ''
        this.ledger = ''
        this.selectedLedger = null
        this.selectedCurrency = null;
        this.machdetails = ''
        this.measuring = ''
        this.qualitySystem = ''
        this.production = ''
        this.quality = ''
        this.others = ''
        this.total = ''
        this.weeklyholiday = ''
        this.workinghours = ''
        this.shiftDetails = ''
        this.shiftTimings = ''
        this.expansionPlan = ''
        this.sanctionedPowAvl = ''
        this.StandByPower = ''
        this.userHeader = ''
        this.Error = ''
        this.Addressprooftype = ''
        this.gstshow = true
        this.stateArray = []
        this.areaArray = []
        this.newOrgArray = []
        this.SaveArray = []
        this.partyArray = []
        this.ledgerArrayList = []
        this.partytypeListArray = []
        this.uploadedFiles = {};
      }
    })
  }
  partyTypefun() {
    if (this.currencyid) {

    }
    else {
      this.Error = 'Select Currency Type';
      this.userHeader = 'Information';
      this.opendialog();
    }
  }
  regVendor(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(isChecked);
    if (!isChecked) {
      this.gstno = '';
      delete this.uploadedFiles['gstCertificate'];
      this.gstshow = false
    }
    else {
      this.gstshow = true
    }
  }
}