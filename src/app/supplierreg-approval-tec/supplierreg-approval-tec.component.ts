import { Component } from '@angular/core';
import { SupplierregApprovalTecService } from '../service/supplierreg-approval-tec.service';
import { DatePipe } from '@angular/common';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

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
  insertCalled: boolean = false
  checkapprove: number = 0
  isEditMode: boolean = false
  //
  loadArray: any[] = []
  tableArray: any[] = []
  selectedArray: any = []
  lastselectedArray: any[] = []
  inputArray: any[] = []
  approveArray: any[] = []
  selectInputArray: any[] = []
  resultArray: any[] = []
  InsertArray: any[] = []
  partyArray: any[] = []
  emailArray: any[] = []
  backUpArray: any[] = []
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
      this.selectedArray.push(row);
      console.log(this.selectedArray);

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
      this.selectedArray = this.selectedArray.filter((item: any) => item !== row);
      this.selectInputArray = this.selectInputArray.filter((item: any) => item.partyid !== row.partyid);
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
    if (this.selectedArray.length > 0) {
      this.lastselectedArray = [this.selectedArray[this.selectedArray.length - 1]];
    } else {
      this.lastselectedArray = [];
    }
  }
  EditArray: any = []
  toggleEdit() {
    this.EditArray = []
    this.backUpArray = []


    if (this.selectedArray.length > 0) {
      console.log(this.selectedArray.length - 1);

      console.log(this.selectedArray, 'selectArraty');
      console.log(this.selectInputArray, 'selectInput');
      console.log(this.selectInputArray[0].machdet);


      this.isEditMode = !this.isEditMode;
      if (!this.isEditMode) {
        this.backUpArray.push({
          partyid: this.selectedArray[this.selectedArray.length - 1].partyid,
          machinerydetails: this.selectInputArray[this.selectInputArray.length - 1].machdet,
          measuringInst: this.selectInputArray[this.selectInputArray.length - 1].measinst,
          qualitySystem: this.selectInputArray[this.selectInputArray.length - 1].qltysystem,
          Production: this.selectInputArray[this.selectInputArray.length - 1].manpowerprod,
          quality: this.selectInputArray[this.selectInputArray.length - 1].manpowerqlty,
          other: this.selectInputArray[this.selectInputArray.length - 1].manpowerothers,
          total: this.selectInputArray[this.selectInputArray.length - 1].manpowertotal,
          weeklyholiday: this.selectInputArray[this.selectInputArray.length - 1].weeklyholiday,
          workinghours: this.selectInputArray[this.selectInputArray.length - 1].workhours,
          shiftdetails: this.selectInputArray[this.selectInputArray.length - 1].shiftdet,
          shiftTimings: this.selectInputArray[this.selectInputArray.length - 1].shifttime,
          expansionPlan: this.selectInputArray[this.selectInputArray.length - 1].expansionplan,
          sanctionedPower: this.selectInputArray[this.selectInputArray.length - 1].sanctionedpower,
          StandByPower: this.selectInputArray[this.selectInputArray.length - 1].standbypower,
          AlteredEmpId: String(this.empid)
        })
        console.log(this.backUpArray);

        this.EditArray.push({
          machdet: this.MachineryDetails,
          measinst: this.Measuring,
          qltysystem: this.Qs,
          manpowerprod: this.production,
          manpowerqlty: this.quality,
          manpowerothers: this.others,
          manpowertotal: this.total,
          weeklyholiday: this.weeklyHoliday,
          workhours: this.workingHours,
          shiftdet: this.shiftDetails,
          shifttime: this.shiftTimings,
          expansionplan: this.exp_plan,
          sanctionedpower: this.sanctioned_pow_Avl,
          standbypower: this.standBy_Power,
          partyid: this.partyid
        })
        console.log(this.EditArray);
        this.Error = 'Are Sure to Approve?';
        this.userHeader = 'Save';
        this.opendialog();
        this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.service.editsave(this.EditArray).subscribe((result: any) => {
              this.service.backup(this.backUpArray).subscribe((result: any) => {
                console.log(result);
              })
              this.Error = result.message
              this.userHeader = 'Information';
              this.opendialog();
              this.loadArray = []
              this.tableArray = []
              this.selectedArray = []
              this.lastselectedArray = []
              this.inputArray = []
              this.emailArray = []
              this.approveArray = []
              this.selectInputArray = []
              this.InsertArray = []
              this.resultArray = []
              this.partyArray = []
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
              this.insertCalled = false
              this.checkapprove = 0
              this.Error = ''
              this.userHeader = ''
              this.load()
            })
          }
        })
      }
    }
    else {
      this.Error = 'Select the Rows to Approve';
      this.userHeader = 'Information';
      this.opendialog();
    }
  }
  approve() {
    this.partyArray = []
    if (this.selectedArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      this.approveArray = [];
      this.InsertArray = [];
      this.Error = 'Are Sure to Approve?';
      this.userHeader = 'Save';
      this.opendialog();
      for (let i = 0; i < this.selectedArray.length; i++) {
        this.partyArray.push({
          partyid: this.selectedArray[i].partyid,
          today: formattedDate,
          empid: this.empid
        })
      }
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
    for (let i = 0; i < this.selectedArray.length; i++) {
      const merged = {
        ...this.selectInputArray[i],
        ...this.selectedArray[i]
      };
      this.InsertArray.push(merged);
    }
    for (let i = 0; i < this.selectedArray.length; i++) {
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
        partytype: this.InsertArray[i].partytype,
        accountid: Number(this.InsertArray[i].partytype)
      });
      console.log(this.approveArray, 'aaaaapppppppppppp')
    }

    for (let i = 0; i < this.selectedArray.length; i++) {
      this.service.ApproveCheck(this.selectedArray[i].partyid).subscribe((approveCheck: any) => {
        if (this.selectedArray[i].sup_type === 'P') {
          this.checkapprove = this.checkapprove + 1;
          if (approveCheck[0]?.fin_approved === 'Y' && approveCheck[0]?.pur_approved === 'Y' && approveCheck[0]?.qc_approved === 'Y') {
            if (
              this.approveArray.length === this.selectedArray.length &&
              !this.insertCalled
            ) {
              this.insertCalled = true;
              this.service.insertType(this.approveArray).subscribe((result: any) => {
                this.resultArray = result;
                this.Error = result.message;
                this.userHeader = 'Information';
                this.opendialog();
              });
            }
          }
        } else if (this.selectedArray[i].sup_type === 'N') {
          this.checkapprove = this.checkapprove + 1;
          if (
            approveCheck[0]?.fin_approved === 'Y' &&
            approveCheck[0]?.pur_approved === 'Y'
          ) {
            if (!this.insertCalled) {
              this.insertCalled = true;
              this.service.insertType(this.approveArray).subscribe((result: any) => {
                this.Error = result.message;
                this.userHeader = 'Information';
                this.opendialog();
              });
            }
          }
        }
        if (this.selectedArray.length == this.checkapprove) {
          this.loadArray = []
          this.tableArray = []
          this.selectedArray = []
          this.lastselectedArray = []
          this.inputArray = []
          this.emailArray = []
          this.approveArray = []
          this.selectInputArray = []
          this.InsertArray = []
          this.resultArray = []
          this.partyArray = []
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
          this.insertCalled = false
          this.checkapprove = 0
          this.Error = ''
          this.userHeader = ''
          this.load()
        }
      });
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
      if (result) {
        this.loadArray = []
        this.tableArray = []
        this.selectedArray = []
        this.lastselectedArray = []
        this.inputArray = []
        this.emailArray = []
        this.approveArray = []
        this.selectInputArray = []
        this.InsertArray = []
        this.resultArray = []
        this.partyArray = []
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
        this.insertCalled = false
        this.checkapprove = 0
        this.Error = ''
        this.userHeader = ''
        this.load()
      }
    })
  }

  //   unapprove() {
  //   this.approveArray = [];
  //   this.InsertArray = [];

  //   for (let i = 0; i < this.selectedArray.length; i++) {
  //     const merged = {
  //       ...this.selectInputArray[i],
  //       ...this.selectedArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }

  //   if (this.selectedArray.length === 0) {
  //     this.Error = 'Select the Rows to Unapprove';
  //     this.userHeader = 'Information';
  //     this.opendialog();
  //     return;
  //   }

  //   const datePipe = new DatePipe('en-US');
  //   const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');

  //   for (let i = 0; i < this.selectedArray.length; i++) {
  //     const insert = this.InsertArray[i];
  //     this.approveArray.push({
  //       Partyid: insert.partyid,
  //       code: insert.code,
  //       name: insert.name,
  //       address: insert.address,
  //       issupplier: insert.IsSupplier,
  //       IsSubcontractor: insert.IsSubcontractor,
  //       IsCustomer: insert.IsCustomer,
  //       partygroup: insert.PartyGroup,
  //       partytype: insert.partytype,
  //       contact: insert.contact,
  //       phone: insert.phone,
  //       email: insert.email,
  //       web_site: insert.web_site,
  //       pannumber: insert.pannumber,
  //       pincode: insert.pincode,
  //       currid: insert.currid,
  //       stateid: insert.stateid,
  //       countryid: insert.countryid,
  //       cityid: insert.cityid,
  //       creditperiod: insert.Creditperiod,
  //       gstno: insert.gstno,
  //       sup_eccno: insert.sup_eccno,
  //       ctypeid: insert.ctypeid,
  //       establishment: insert.establishment,
  //       executive: insert.executive,
  //       majcustomer: insert.majcustomer,
  //       capital: insert.capital,
  //       ssiregno: insert.ssiregno,
  //       bankersname: insert.bankersname,
  //       org_type: insert.org_type,
  //       sup_type: insert.sup_type,
  //       machdet: insert.machdet,
  //       measinst: insert.measinst,
  //       qltysystem: insert.qltysystem,
  //       manpowerprod: insert.manpowerprod,
  //       manpowerqlty: insert.manpowerqlty,
  //       manpowerothers: insert.manpowerothers,
  //       manpowertotal: insert.manpowertotal,
  //       weeklyholiday: insert.weeklyholiday,
  //       workhours: insert.workhours,
  //       shiftdet: insert.shiftdet,
  //       shifttime: insert.shifttime,
  //       expansionplan: insert.expansionplan,
  //       sanctionedpower: insert.sanctionedpower,
  //       standbypower: insert.standbypower,
  //       AddressProofType: insert.AddressProofType,
  //       SMEno: insert.SMEno,
  //       PanCardName: insert.PanCardName,
  //       GstCertificateName: insert.GstCertificateName,
  //       AddressProofName: insert.AddressProofName,
  //       BankDetailsName: insert.BankDetailsName,
  //       SmeCertificateName: insert.SmeCertificateName,
  //       EntryEmpid: this.empid,
  //       UnapproveDate: formattedDate
  //     });
  //   }

  //   this.Error = 'Are you sure to Unapprove?';
  //   this.userHeader = 'Warning!!!';
  //   this.opendialog();

  //   this.dialogRef.afterClosed().subscribe(async (confirm: boolean) => {
  //     if (!confirm) return;

  //     try {
  //       await Promise.all(this.selectedArray.map((row, i) => {
  //         return new Promise<void>((resolve, reject) => {
  //           this.service.unapproveCheck(row.partyid).subscribe((res: any) => {
  //             const check = res[0];
  //             const purApproved = check.pur_approved === 'Y';
  //             const finApproved = check.fin_approved === 'Y';
  //             const dualApproved = purApproved && finApproved;

  //             if (!purApproved && !finApproved) {
  //               resolve(); // no reason needed
  //               return;
  //             }

  //             let msg = '';
  //             let approvedBy = '';
  //             let useEmail2 = false;

  //             if (dualApproved) {
  //               msg = `In Purchase and Finance, ${row.name} is approved. Please provide a reason for Unapproval.`;
  //               approvedBy = `${this.InsertArray[i].pur_approvalby}, ${this.InsertArray[i].fin_approvalby}`;
  //               useEmail2 = true;
  //             } else if (purApproved) {
  //               msg = `In Purchase, ${row.name} is approved. Please provide a reason for Unapproval.`;
  //               approvedBy = this.InsertArray[i].pur_approvalby;
  //             } else if (finApproved) {
  //               msg = `In Finance, ${row.name} is approved. Please provide a reason for Unapproval.`;
  //               approvedBy = this.InsertArray[i].fin_approvalby;
  //             }

  //             const dialogRef = this.dialog.open(DialogCompComponent, {
  //               width: '450px',
  //               disableClose: true,
  //               hasBackdrop: true,
  //               data: {
  //                 Type: 'Reason',
  //                 Msg: msg
  //               }
  //             });

  //             dialogRef.afterClosed().subscribe((dialogResult) => {
  //               if (dialogResult?.approved && dialogResult.reason) {
  //                 this.emailArray = [{
  //                   empid: this.empid,
  //                   reason: dialogResult.reason,
  //                   code: this.InsertArray[i].code,
  //                   name: this.InsertArray[i].name,
  //                   address: this.InsertArray[i].address,
  //                   EntryEmpId: this.InsertArray[i].EntryEmpId,
  //                   ApprovedEmp: approvedBy
  //                 }];

  //                 const emailObs = useEmail2 ? this.service.email2(this.emailArray) : this.service.email(this.emailArray);

  //                 emailObs.subscribe(() => {
  //                   this.emailArray = [];
  //                   resolve();
  //                 });
  //               } else {
  //                 this.Error = 'Unapproval cancelled because reason was not provided.';
  //                 this.userHeader = 'Information';
  //                 this.opendialog();
  //                 reject(); // Abort the process
  //               }
  //             });
  //           });
  //         });
  //       }));

  //       // Proceed with unapproval after all dialogs and emails
  //       this.service.unapprove(this.approveArray).subscribe((result: any) => {
  //         this.Error = result.message;
  //         this.userHeader = 'Information';
  //         this.opendialog();

  //         // Reset all relevant variables
  //         this.loadArray = [];
  //         this.tableArray = [];
  //         this.selectedArray = [];
  //         this.lastselectedArray = [];
  //         this.inputArray = [];
  //         this.emailArray = [];
  //         this.approveArray = [];
  //         this.selectInputArray = [];
  //         this.InsertArray = [];
  //         this.resultArray = [];
  //         this.partyArray = [];
  //         this.partyid = null;
  //         this.MachineryDetails = null;
  //         this.Measuring = null;
  //         this.Qs = null;
  //         this.production = null;
  //         this.quality = null;
  //         this.others = null;
  //         this.total = null;
  //         this.weeklyHoliday = null;
  //         this.workingHours = null;
  //         this.shiftDetails = null;
  //         this.shiftTimings = null;
  //         this.exp_plan = null;
  //         this.sanctioned_pow_Avl = null;
  //         this.standBy_Power = null;
  //         this.insertCalled = false;
  //         this.checkapprove = 0;
  //         this.Error = '';
  //         this.userHeader = '';
  //         this.load();
  //       });
  //     } catch {
  //       // If any dialog failed
  //       this.Error = 'Unapproval process aborted due to missing or cancelled reason.';
  //       this.userHeader = 'Information';
  //       this.opendialog();
  //     }
  //   });
  // }
  unapprove() {
    this.approveArray = [];
    this.InsertArray = [];

    if (this.selectedArray.length !== this.selectInputArray.length) {
      this.Error = 'Selection mismatch. Please reselect rows properly.';
      this.userHeader = 'Error';
      this.opendialog();
      return;
    }

    if (this.selectedArray.length === 0) {
      this.Error = 'Select the Rows to Unapprove';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }

    for (let i = 0; i < this.selectedArray.length; i++) {
      const merged = {
        ...this.selectInputArray[i],
        ...this.selectedArray[i]
      };
      this.InsertArray.push(merged);
    }

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');

    for (let i = 0; i < this.selectedArray.length; i++) {
      const row = this.InsertArray[i];
      this.approveArray.push({
        Partyid: row.partyid,
        code: row.code,
        name: row.name,
        address: row.address,
        issupplier: row.IsSupplier,
        IsSubcontractor: row.IsSubcontractor,
        IsCustomer: row.IsCustomer,
        partygroup: row.PartyGroup,
        partytype: row.partytype,
        contact: row.contact,
        phone: row.phone,
        email: row.email,
        web_site: row.web_site,
        pannumber: row.pannumber,
        pincode: row.pincode,
        currid: row.currid,
        stateid: row.stateid,
        countryid: row.countryid,
        cityid: row.cityid,
        creditperiod: row.Creditperiod,
        gstno: row.gstno,
        sup_eccno: row.sup_eccno,
        ctypeid: row.ctypeid,
        establishment: row.establishment,
        executive: row.executive,
        majcustomer: row.majcustomer,
        capital: row.capital,
        ssiregno: row.ssiregno,
        bankersname: row.bankersname,
        org_type: row.org_type,
        sup_type: row.sup_type,
        machdet: row.machdet,
        measinst: row.measinst,
        qltysystem: row.qltysystem,
        manpowerprod: row.manpowerprod,
        manpowerqlty: row.manpowerqlty,
        manpowerothers: row.manpowerothers,
        manpowertotal: row.manpowertotal,
        weeklyholiday: row.weeklyholiday,
        workhours: row.workhours,
        shiftdet: row.shiftdet,
        shifttime: row.shifttime,
        expansionplan: row.expansionplan,
        sanctionedpower: row.sanctionedpower,
        standbypower: row.standbypower,
        AddressProofType: row.AddressProofType,
        SMEno: row.SMEno,
        PanCardName: row.PanCardName,
        GstCertificateName: row.GstCertificateName,
        AddressProofName: row.AddressProofName,
        BankDetailsName: row.BankDetailsName,
        SmeCertificateName: row.SmeCertificateName,
        EntryEmpid: this.empid,
        UnapproveDate: formattedDate
      });
    }

    this.Error = 'Are you sure to Unapprove?';
    this.userHeader = 'Warning!!!';
    this.opendialog();

    this.dialogRef.afterClosed().subscribe(async (confirm: boolean) => {
      if (!confirm) return;
      try {
        for (let i = 0; i < this.selectedArray.length; i++) {
          const partyId = this.selectedArray[i].partyid;
          const insert = this.InsertArray[i];
          const check: any = await new Promise((resolve) => {
            this.service.unapproveCheck(partyId).subscribe((res: any) => resolve(res[0]));
          });
          const purApproved = check.pur_approved === 'Y';
          const finApproved = check.fin_approved === 'Y';
          if (purApproved || finApproved) {
            const approvedBy = purApproved && finApproved
              ? `${insert.pur_approvalby}, ${insert.fin_approvalby}`
              : purApproved
                ? insert.pur_approvalby
                : insert.fin_approvalby;
            const msg =
              purApproved && finApproved
                ? `In Purchase and Finance, ${insert.name} is approved. Please provide a reason for Unapproval.`
                : purApproved
                  ? `In Purchase, ${insert.name} is approved. Please provide a reason for Unapproval.`
                  : `In Finance, ${insert.name} is approved. Please provide a reason for Unapproval.`;

            const dialogResult: any = await new Promise((resolve) => {
              const ref = this.dialog.open(DialogCompComponent, {
                width: '450px',
                disableClose: true,
                hasBackdrop: true,
                data: { Type: 'Reason', Msg: msg }
              });
              ref.afterClosed().subscribe(resolve);
            });
            if (!dialogResult?.approved || !dialogResult.reason) {
              throw new Error('Unapproval aborted: Reason required.');
            }
            this.emailArray = [{
              empid: this.empid,
              reason: dialogResult.reason,
              code: insert.code,
              name: insert.name,
              address: insert.address,
              EntryEmpId: insert.EntryEmpId,
              ApprovedEmp: approvedBy
            }];
            const emailObs = purApproved && finApproved
              ? this.service.email2(this.emailArray)
              : this.service.email(this.emailArray);

            await new Promise((resolve) => emailObs.subscribe(() => {
              this.emailArray = [];
              resolve(true);
            }));
          }
        }
        this.service.unapprove(this.approveArray).subscribe((res: any) => {
          this.Error = res.message;
          this.userHeader = 'Information';
          this.opendialog();
          this.loadArray = [];
          this.tableArray = [];
          this.selectedArray = [];
          this.lastselectedArray = [];
          this.inputArray = [];
          this.emailArray = [];
          this.approveArray = [];
          this.selectInputArray = [];
          this.InsertArray = [];
          this.resultArray = [];
          this.partyArray = [];
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
          this.insertCalled = false;
          this.checkapprove = 0;
          this.Error = '';
          this.userHeader = '';
          this.load();
        });
      } catch (err) {
        this.Error = 'Unapproval cancelled or reason not provided.';
        this.userHeader = 'Information';
        this.opendialog();
      }
    });
  }

  //   unapprove() {
  //   this.approveArray = [];
  //   for (let i = 0; i < this.selectedArray.length; i++) {
  //     const merged = {
  //       ...this.selectInputArray[i],
  //       ...this.selectedArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }
  //   if (this.selectedArray.length > 0) {
  //     const datePipe = new DatePipe('en-US');
  //     const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
  //     for (let i = 0; i < this.selectedArray.length; i++) {
  //       this.approveArray.push({
  //         Partyid: this.InsertArray[i].partyid,
  //         code: this.InsertArray[i].code,
  //         name: this.InsertArray[i].name,
  //         address: this.InsertArray[i].address,
  //         issupplier: this.InsertArray[i].IsSupplier,
  //         IsSubcontractor: this.InsertArray[i].IsSubcontractor,
  //         IsCustomer: this.InsertArray[i].IsCustomer,
  //         partygroup: this.InsertArray[i].PartyGroup,
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
  //         EntryEmpid: this.empid,
  //         UnapproveDate: formattedDate
  //       });
  //     }
  //     this.Error = 'Are you sure to Unapprove?';
  //     this.userHeader = 'Warning!!!';
  //     this.opendialog();
  //     this.dialogRef.afterClosed().subscribe(async (result: boolean) => {
  //       if (!result) return;
  //       const allTasks: Promise<void>[] = [];
  //       for (let i = 0; i < this.selectedArray.length; i++) {
  //         const task = new Promise<void>((resolve) => {
  //           this.service.unapproveCheck(this.selectedArray[i].partyid).subscribe((res: any) => {
  //             const r = res[0];
  //             const s = this.selectedArray[i];
  //             const insert = this.InsertArray[i];
  //             const type = r.sup_type;
  //             const purApproved = r.pur_approved === 'Y';
  //             const finApproved = r.fin_approved === 'Y';
  //             const getReasonAndSendEmail = (msg: string, dual = false) => {
  //               const dialogRef = this.dialog.open(DialogCompComponent, {
  //                 width: '450px',
  //                 data: {
  //                   Type: 'Reason',
  //                   Msg: msg
  //                 }
  //               });
  //               dialogRef.afterClosed().subscribe((result) => {
  //                 if (result?.approved && result.reason) {
  //                   this.emailArray = [{
  //                     empid: this.empid,
  //                     reason: result.reason,
  //                     code: insert.code,
  //                     name: insert.name,
  //                     address: insert.address,
  //                     EntryEmpId: insert.EntryEmpId,
  //                     ApprovedEmp: insert.pur_approvalby,
  //                     ApprovedEmp2: dual ? insert.fin_approvalby : undefined
  //                   }];
  //                   console.log(this.emailArray);                  
  //                   const emailObs = dual ? this.service.email2(this.emailArray) : this.service.email(this.emailArray);
  //                   emailObs.subscribe(() => {
  //                     this.emailArray = [];
  //                     resolve();
  //                   });
  //                 } else {
  //                   resolve();
  //                 }
  //               });
  //             };
  //             if (purApproved && !finApproved) {
  //               getReasonAndSendEmail(`In Purchase, ${s.name} is approved, Kindly check. Please provide a reason for Unapproval.`);
  //             } else if (!purApproved && finApproved) {
  //               getReasonAndSendEmail(`In Finance, ${s.name} is approved, Kindly check. Please provide a reason for Unapproval.`);
  //             } else if (purApproved && finApproved) {
  //               getReasonAndSendEmail(`In Purchase and Finance, ${s.name} is approved, Kindly check. Please provide a reason for Unapproval.`, true);
  //             } else {
  //               resolve();
  //             }
  //           });
  //         });
  //         allTasks.push(task);
  //       }
  //       await Promise.all(allTasks);
  //       // Call unapprove only after all dialogs and emails are handled
  //       this.service.unapprove(this.approveArray).subscribe((result: any) => {
  //         this.Error = result.message;
  //         this.userHeader = 'Information';
  //         this.opendialog();
  //         this.loadArray = [];
  //         this.tableArray = [];
  //         this.selectedArray = [];
  //         this.lastselectedArray = [];
  //         this.inputArray = [];
  //         this.emailArray = [];
  //         this.approveArray = [];
  //         this.selectInputArray = [];
  //         this.InsertArray = [];
  //         this.resultArray = [];
  //         this.partyArray = [];
  //         this.partyid = null;
  //         this.MachineryDetails = null;
  //         this.Measuring = null;
  //         this.Qs = null;
  //         this.production = null;
  //         this.quality = null;
  //         this.others = null;
  //         this.total = null;
  //         this.weeklyHoliday = null;
  //         this.workingHours = null;
  //         this.shiftDetails = null;
  //         this.shiftTimings = null;
  //         this.exp_plan = null;
  //         this.sanctioned_pow_Avl = null;
  //         this.standBy_Power = null;
  //         this.insertCalled = false;
  //         this.checkapprove = 0;
  //         this.Error = '';
  //         this.userHeader = '';
  //         this.load();
  //       });
  //     });
  //   } else {
  //     this.Error = 'Select the Rows to Unapprove';
  //     this.userHeader = 'Information';
  //     this.opendialog();
  //   }
  // }
  // unapprove() {
  //   this.approveArray = []
  //   for (let i = 0; i < this.selectedArray.length; i++) {
  //     const merged = {
  //       ...this.selectInputArray[i],
  //       ...this.selectedArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }
  //   if (this.selectedArray.length > 0) {
  //     const datePipe = new DatePipe('en-US');
  //     const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
  //     for (let i = 0; i < this.selectedArray.length; i++) {
  //       this.approveArray.push({
  //         Partyid: this.InsertArray[i].partyid,
  //         code: this.InsertArray[i].code,
  //         name: this.InsertArray[i].name,
  //         address: this.InsertArray[i].address,
  //         issupplier: this.InsertArray[i].IsSupplier,
  //         IsSubcontractor: this.InsertArray[i].IsSubcontractor,
  //         IsCustomer: this.InsertArray[i].IsCustomer,
  //         partygroup: this.InsertArray[i].PartyGroup,
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
  //         EntryEmpid: this.empid,
  //         UnapproveDate: formattedDate
  //       })
  //     }
  //     console.log(this.approveArray, 'approve');

  //     this.Error = 'Are you sure to Unapprove?'
  //     this.userHeader = 'Warning!!!'
  //     this.opendialog()
  //     this.dialogRef.afterClosed().subscribe((result: boolean) => {
  //       if (result) {

  //         for (let i = 0; i < this.selectedArray.length; i++) {
  //           this.service.unapproveCheck(this.selectedArray[i].partyid).subscribe((result: any) => {
  //             if (result[0].sup_type === 'P') {
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'N') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase, ${this.selectedArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.InsertArray[i].code,
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
  //             if (result[0].sup_type === 'P') {
  //               if (result[0].pur_approved === 'N' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Finance, ${this.selectedArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.InsertArray[i].code,
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
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'N') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase, ${this.selectedArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.InsertArray[i].code,
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
  //               if (result[0].pur_approved === 'N' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Finance, ${this.selectedArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.InsertArray[i].code,
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
  //             if (result[0].sup_type == 'P') {
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase and Finance, ${this.selectedArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.InsertArray[i].code,
  //                         name: this.InsertArray[i].name,
  //                         address: this.InsertArray[i].address,
  //                         EntryEmpId: this.InsertArray[i].EntryEmpId,
  //                         ApprovedEmp2: this.InsertArray[i].fin_approvalby,
  //                         ApprovedEmp: this.InsertArray[i].pur_approvalby
  //                       });
  //                     }
  //                     console.log(this.emailArray);

  //                     this.service.email2(this.emailArray).subscribe((response: any) => {
  //                       this.emailArray = []
  //                     });
  //                   } else {
  //                     console.log('User cancelled or did not Unapproval.');
  //                   }
  //                 });
  //               }
  //             }
  //             if (result[0].sup_type == 'N') {
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase and Finance, ${this.selectedArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                         empid: this.empid,
  //                         reason: result.reason,
  //                         code: this.InsertArray[i].code,
  //                         name: this.InsertArray[i].name,
  //                         address: this.InsertArray[i].address,
  //                         EntryEmpId: this.InsertArray[i].EntryEmpId,
  //                         ApprovedEmp: this.InsertArray[i].pur_approvalby,
  //                         ApprovedEmp2: this.InsertArray[i].fin_approvalby

  //                       });
  //                     }
  //                     console.log(this.emailArray);

  //                     this.service.email2(this.emailArray).subscribe((response: any) => {
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
  //           this.loadArray = []
  //           this.tableArray = []
  //           this.selectedArray = []
  //           this.lastselectedArray = []
  //           this.inputArray = []
  //           this.emailArray = []
  //           this.approveArray = []
  //           this.selectInputArray = []
  //           this.InsertArray = []
  //           this.resultArray = []
  //           this.partyArray = []
  //           this.partyid = null
  //           this.MachineryDetails = null
  //           this.Measuring = null
  //           this.Qs = null
  //           this.production = null
  //           this.quality = null
  //           this.others = null
  //           this.total = null
  //           this.weeklyHoliday = null
  //           this.workingHours = null
  //           this.shiftDetails = null
  //           this.shiftTimings = null
  //           this.exp_plan = null
  //           this.sanctioned_pow_Avl = null
  //           this.standBy_Power = null
  //           this.insertCalled = false
  //           this.checkapprove = 0
  //           this.Error = ''
  //           this.userHeader = ''
  //           this.load()
  //         })
  //       }
  //     })
  //   }
  //   else {
  //     this.Error = 'Select the Rows to Unapprove'
  //     this.userHeader = 'Information'
  //     this.opendialog()
  //   }
  // }


  // unapprove() {
  //   this.approveArray = [];
  //   this.emailArray=[]
  //   for (let i = 0; i < this.selectedArray.length; i++) {
  //     const merged = {
  //       ...this.selectInputArray[i],
  //       ...this.selectedArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }
  //   if (this.selectedArray.length > 0) {
  //     const datePipe = new DatePipe('en-US');
  //     const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
  //     for (let i = 0; i < this.selectedArray.length; i++) {
  //       const row = this.InsertArray[i];
  //       this.approveArray.push({
  //         Partyid: row.partyid,
  //         code: row.code,
  //         name: row.name,
  //         address: row.address,
  //         issupplier: row.IsSupplier,
  //         IsSubcontractor: row.IsSubcontractor,
  //         IsCustomer: row.IsCustomer,
  //         partygroup: row.PartyGroup,
  //         partytype: row.partytype,
  //         contact: row.contact,
  //         phone: row.phone,
  //         email: row.email,
  //         web_site: row.web_site,
  //         pannumber: row.pannumber,
  //         pincode: row.pincode,
  //         currid: row.currid,
  //         stateid: row.stateid,
  //         countryid: row.countryid,
  //         cityid: row.cityid,
  //         creditperiod: row.Creditperiod,
  //         gstno: row.gstno,
  //         sup_eccno: row.sup_eccno,
  //         ctypeid: row.ctypeid,
  //         establishment: row.establishment,
  //         executive: row.executive,
  //         majcustomer: row.majcustomer,
  //         capital: row.capital,
  //         ssiregno: row.ssiregno,
  //         bankersname: row.bankersname,
  //         org_type: row.org_type,
  //         sup_type: row.sup_type,
  //         machdet: row.machdet,
  //         measinst: row.measinst,
  //         qltysystem: row.qltysystem,
  //         manpowerprod: row.manpowerprod,
  //         manpowerqlty: row.manpowerqlty,
  //         manpowerothers: row.manpowerothers,
  //         manpowertotal: row.manpowertotal,
  //         weeklyholiday: row.weeklyholiday,
  //         workhours: row.workhours,
  //         shiftdet: row.shiftdet,
  //         shifttime: row.shifttime,
  //         expansionplan: row.expansionplan,
  //         sanctionedpower: row.sanctionedpower,
  //         standbypower: row.standbypower,
  //         AddressProofType: row.AddressProofType,
  //         SMEno: row.SMEno,
  //         PanCardName: row.PanCardName,
  //         GstCertificateName: row.GstCertificateName,
  //         AddressProofName: row.AddressProofName,
  //         BankDetailsName: row.BankDetailsName,
  //         SmeCertificateName: row.SmeCertificateName,
  //         EntryEmpid: this.empid,
  //         UnapproveDate: formattedDate
  //       });
  //     }
  //     this.Error = 'Are you sure to Unapprove?';
  //     this.userHeader = 'Warning!!!';
  //     this.opendialog();
  //     this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //       if (confirmed) {
  //         let counter = 0;
  //         for (let i = 0; i < this.selectedArray.length; i++) {
  //           this.emailArray = [];
  //           this.service.unapproveCheck(this.selectedArray[i].partyid).subscribe((res: any) => {
  //             const { sup_type, pur_approved, fin_approved } = res[0];
  //             let conditionMatched = false;
  //             let msg = '';
  //             if (sup_type === 'P' || sup_type === 'N') {
  //               if (pur_approved === 'Y' && fin_approved === 'Y') {
  //                 msg = `In Purchase and Finance, ${this.selectedArray[i].name} is approved. Kindly check. Please provide a reason for Unapproval.`;
  //                 conditionMatched = true;
  //               } else if (pur_approved === 'Y' && fin_approved === 'N') {
  //                 msg = `In Purchase, ${this.selectedArray[i].name} is approved. Kindly check. Please provide a reason for Unapproval.`;
  //                 conditionMatched = true;
  //               } else if (pur_approved === 'N' && fin_approved === 'Y') {
  //                 msg = `In Finance, ${this.selectedArray[i].name} is approved. Kindly check. Please provide a reason for Unapproval.`;
  //                 conditionMatched = true;
  //               }
  //             }
  //             if (conditionMatched) {
  //               const dialogRef = this.dialog.open(DialogCompComponent, {
  //                 width: '450px',
  //                 disableClose: true,
  //                 data: {
  //                   Type: 'Reason',
  //                   Msg: msg
  //                 }
  //               });
  //               dialogRef.afterClosed().subscribe(result => {
  //                 if (result?.approved && result.reason) {
  //                   this.emailArray.push({
  //                     empid: this.empid,
  //                     reason: result.reason,
  //                     code: this.InsertArray[i].code,
  //                     name: this.InsertArray[i].name,
  //                     address: this.InsertArray[i].address
  //                   });
  //                   this.service.email(this.emailArray).subscribe(() => {
  //                     this.emailArray = [];
  //                     counter++;
  //                     if (counter === this.selectedArray.length) {
  //                       this.finalUnapproveCall();
  //                     }
  //                   });
  //                 } else {
  //                   console.log('User cancelled or did not provide reason.');
  //                   counter++;
  //                   if (counter === this.selectedArray.length) {
  //                     this.finalUnapproveCall();
  //                   }
  //                 }
  //               });
  //             } else {
  //               counter++;
  //               if (counter === this.selectedArray.length) {
  //                 this.finalUnapproveCall();
  //               }
  //             }
  //           });
  //         }
  //       }
  //     });
  //   } else {
  //     this.Error = 'Select the Rows to Unapprove';
  //     this.userHeader = 'Information';
  //     this.opendialog();
  //   }
  // }
  // finalUnapproveCall() {
  //   return
  //   this.service.unapprove(this.approveArray).subscribe({
  //     next: (res: any) => {
  //       this.Error = res.message;
  //       this.userHeader = 'Information';
  //       this.opendialog();
  //       this.resetAll();
  //       this.load();
  //     },
  //     error: () => {
  //       this.Error = 'Unapprove failed. Try again later.';
  //       this.userHeader = 'Error';
  //       this.opendialog();
  //     }
  //   });
  // }
  // resetAll() {
  //   this.loadArray = [];
  //   this.tableArray = [];
  //   this.selectedArray = [];
  //   this.lastselectedArray = [];
  //   this.inputArray = [];
  //   this.emailArray = [];
  //   this.approveArray = [];
  //   this.selectInputArray = [];
  //   this.InsertArray = [];
  //   this.resultArray = [];
  //   this.partyArray = [];
  //   this.partyid = null;
  //   this.MachineryDetails = null;
  //   this.Measuring = null;
  //   this.Qs = null;
  //   this.production = null;
  //   this.quality = null;
  //   this.others = null;
  //   this.total = null;
  //   this.weeklyHoliday = null;
  //   this.workingHours = null;
  //   this.shiftDetails = null;
  //   this.shiftTimings = null;
  //   this.exp_plan = null;
  //   this.sanctioned_pow_Avl = null;
  //   this.standBy_Power = null;
  //   this.insertCalled = false;
  //   this.checkapprove = 0;
  //   this.Error = '';
  //   this.userHeader = '';
  // }
}