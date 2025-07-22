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
  checkapprove: number = 0
  ledgergrpid: number = 0
  insertCalled: boolean = false
  isEditMode: boolean = false
  currencyTypeShow: boolean = false
  currencyid: number = 0
  partygroupid: number = 0
  empArray: any[] = []
  tableArray: any[] = []
  selectArray: any[] = []
  lastrowArray: any[] = []
  inputArray: any[] = []
  partyTypeArray: any[] = []
  ledgergrpArray: any[] = []
  approveArray: any[] = []
  selectInputArray: any[] = []
  InsertArray: any[] = []
  partyArray: any[] = []
  resultArray: any[] = []
  emailArray: any[] = []
  editArray: any[] = []
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
    if (event.target.checked) {
      this.selectArray.push(row);
      this.service.input(row.code).subscribe((result: any) => {
        const input = result[0];
        this.selectInputArray.push(input);
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
          console.log(this.partyType);

        });
        this.service.ledger(input.partygroup).subscribe((res: any) => {
          this.ledgergrp = res[0].xxx;
          console.log(this.ledgergrp);

        });
      });
    } else {
      this.selectArray = this.selectArray.filter(item => item.partyid !== row.partyid);
      this.selectInputArray = this.selectInputArray.filter(item => item.partyid !== row.partyid);
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
    if (this.selectArray.length > 0) {
      const lastRow = this.selectArray[this.selectArray.length - 1];
      this.lastrowArray.push(lastRow);
      console.log(this.lastrowArray, 'lastrow');

      this.vendor = lastRow.gstno !== '';
    } else {
      this.vendor = false;
    }
  }

  approve() {
    this.partyArray = []
    if (this.selectArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      this.approveArray = [];
      this.InsertArray = [];
      this.Error = 'Are Sure to Approve?';
      this.userHeader = 'Save';
      this.opendialog();
      for (let i = 0; i < this.selectArray.length; i++) {
        this.partyArray.push({
          partyid: this.selectArray[i].partyid,
          today: formattedDate,
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
    for (let i = 0; i < this.selectArray.length; i++) {
      const merged = {
        ...this.selectInputArray[i],
        ...this.selectArray[i]
      };
      this.InsertArray.push(merged);
    }
    for (let i = 0; i < this.selectArray.length; i++) {
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
        website: this.InsertArray[i].web_site,
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
    }
    for (let i = 0; i < this.selectArray.length; i++) {
      this.service.ApproveCheck(this.selectArray[i].partyid).subscribe((approveCheck: any) => {
        if (this.selectArray[i].sup_type === 'P') {
          this.checkapprove = this.checkapprove + 1;
          if (
            approveCheck[0]?.fin_approved === 'Y' &&
            approveCheck[0]?.pur_approved === 'Y' &&
            approveCheck[0]?.qc_approved === 'Y'
          ) {
            if (
              this.approveArray.length === this.selectArray.length &&
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
        } else if (this.selectArray[i].sup_type === 'N') {
          this.checkapprove = this.checkapprove + 1;
          if (
            approveCheck[0]?.fin_approved === 'Y' &&
            approveCheck[0]?.pur_approved === 'Y'
          ) {
            if (!this.insertCalled) {
              this.insertCalled = true;
              console.log(this.approveArray), 'this,approvearray';
              this.service.insertType(this.approveArray).subscribe((result: any) => {
                this.Error = result.message;
                this.userHeader = 'Information';
                this.opendialog();
              });
            }
          }
        }
        if (this.selectArray.length == this.checkapprove) {
          this.empArray = []
          this.tableArray = []
          this.selectArray = []
          this.lastrowArray = []
          this.inputArray = []
          this.partyTypeArray = []
          this.ledgergrpArray = []
          this.approveArray = []
          this.selectInputArray = []
          this.InsertArray = []
          this.partyArray = []
          this.resultArray = []
          this.emailArray = []
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
          this.checkapprove = 0
          this.insertCalled = false
          this.load()
        }
      });
    }
  }
  unapprove() {
    this.approveArray = [];
    this.InsertArray = [];

    if (this.selectArray.length !== this.selectInputArray.length) {
      this.Error = 'Selection mismatch. Please reselect rows properly.';
      this.userHeader = 'Error';
      this.opendialog();
      return;
    }

    for (let i = 0; i < this.selectArray.length; i++) {
      const merged = {
        ...this.selectInputArray[i],
        ...this.selectArray[i]
      };
      this.InsertArray.push(merged);
    }

    if (this.selectArray.length === 0) {
      this.Error = 'Select the Rows to Unapprove';
      this.userHeader = 'Information';
      this.opendialog();
      return;
    }

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');

    for (let i = 0; i < this.selectArray.length; i++) {
      const select = this.selectArray[i];
      const input = this.selectInputArray[i];

      this.approveArray.push({
        Partyid: select.partyid,
        code: select.code,
        name: input.name,
        address: input.address,
        issupplier: select.IsSupplier,
        IsSubcontractor: select.IsSubcontractor,
        IsCustomer: select.IsCustomer,
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
        SmeCertificateName: select.SmeCertificateName,
        EntryEmpid: this.empid,
        UnapproveDate: formattedDate
      });
    }

    this.Error = 'Are you sure to Unapprove?';
    this.userHeader = 'Warning!!!';
    this.opendialog();

    this.dialogRef.afterClosed().subscribe(async (confirm: boolean) => {
      if (!confirm) return;

      const dialogEmailTasks = this.selectArray.map((row, index) => {
        return new Promise<void>((resolve, reject) => {
          this.service.unapproveCheck(row.partyid).subscribe((res: any) => {
            const check = res[0];
            const needsFinanceReason = check.fin_approved === 'Y' && check.pur_approved === 'N';
            const needsPurchaseReason = check.pur_approved === 'Y' && check.fin_approved === 'N';
            const needsBoth = check.pur_approved === 'Y' && check.fin_approved === 'Y';

            if (needsFinanceReason || needsPurchaseReason || needsBoth) {
              let area = 'Finance';
              let approvedBy = this.InsertArray[index].fin_approvalby;
              if (needsPurchaseReason) {
                area = 'Purchase';
                approvedBy = this.InsertArray[index].pur_approvalby;
              } else if (needsBoth) {
                area = 'Finance & Purchase';
                approvedBy = `${this.InsertArray[index].fin_approvalby}, ${this.InsertArray[index].pur_approvalby}`;
              }

              const dialogRef = this.dialog.open(DialogCompComponent, {
                width: '450px',
                disableClose: true,
                hasBackdrop: true,
                data: {
                  Type: 'Reason',
                  Msg: `In ${area}, ${row.name} is approved. Please provide a reason for Unapproval.`
                }
              });

              dialogRef.afterClosed().subscribe((dialogResult) => {
                if (dialogResult?.approved && dialogResult.reason) {
                  this.emailArray.push({
                    empid: this.empid,
                    reason: dialogResult.reason,
                    code: this.InsertArray[index].code,
                    name: this.InsertArray[index].name,
                    address: this.InsertArray[index].address,
                    EntryEmpId: this.InsertArray[index].EntryEmpId,
                    ApprovedEmp: approvedBy
                  });

                  this.service.email(this.emailArray).subscribe(() => {
                    this.emailArray = [];
                    resolve();
                  });
                } else {
                  // Cancel the full unapprove process
                  this.Error = 'Unapproval cancelled due to missing reason.';
                  this.userHeader = 'Information';
                  this.opendialog();
                  reject();
                }
              });
            } else {
              resolve(); // No dialog needed
            }
          });
        });
      });

      try {
        await Promise.all(dialogEmailTasks);

        // Now finally call unapprove API
        this.service.unapprove(this.approveArray).subscribe({
          next: (res: any) => {
            this.Error = res.message;
            this.userHeader = 'Information';
            this.opendialog();

            // Reset all
            this.empArray = [];
            this.tableArray = [];
            this.selectArray = [];
            this.lastrowArray = [];
            this.inputArray = [];
            this.partyTypeArray = [];
            this.ledgergrpArray = [];
            this.approveArray = [];
            this.selectInputArray = [];
            this.InsertArray = [];
            this.partyArray = [];
            this.resultArray = [];
            this.emailArray = [];
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
            this.checkapprove = 0;
            this.insertCalled = false;
            this.load();
          },
          error: () => {
            this.Error = 'Unapprove failed. Try again later.';
            this.userHeader = 'Error';
            this.opendialog();
          }
        });
      } catch {
        // At least one dialog was cancelled or missing reason
        this.Error = 'Unapproval process aborted.';
        this.userHeader = 'Information';
        this.opendialog();
      }
    });
  }

  //   unapprove() {
  //   this.approveArray = [];

  //   for (let i = 0; i < this.selectArray.length; i++) {
  //     const merged = {
  //       ...this.selectInputArray[i],
  //       ...this.selectArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }

  //   if (this.selectArray.length !== this.selectInputArray.length) {
  //     this.Error = 'Selection mismatch. Please reselect rows properly.';
  //     this.userHeader = 'Error';
  //     this.opendialog();
  //     return;
  //   }

  //   const datePipe = new DatePipe('en-US');
  //   const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');

  //   if (this.selectArray.length > 0) {
  //     for (let i = 0; i < this.selectArray.length; i++) {
  //       const select = this.selectArray[i];
  //       const input = this.selectInputArray[i];
  //       this.approveArray.push({
  //         Partyid: select.partyid,
  //         code: select.code,
  //         name: input.name,
  //         address: input.address,
  //         issupplier: select.IsSupplier,
  //         IsSubcontractor: select.IsSubcontractor,
  //         IsCustomer: select.IsCustomer,
  //         partygroup: select.PartyGroup,
  //         partytype: select.partytype,
  //         contact: input.contact,
  //         phone: input.phone,
  //         email: input.email,
  //         web_site: input.web_site,
  //         pannumber: input.pannumber,
  //         pincode: input.pincode,
  //         currid: select.currid,
  //         stateid: input.stateid,
  //         countryid: select.countryid,
  //         cityid: select.cityid,
  //         creditperiod: select.Creditperiod,
  //         gstno: select.gstno,
  //         sup_eccno: input.sup_eccno,
  //         ctypeid: input.ctypeid,
  //         establishment: input.establishment,
  //         executive: input.executive,
  //         majcustomer: input.majcustomer,
  //         capital: input.capital,
  //         ssiregno: input.ssiregno,
  //         bankersname: input.bankersname,
  //         org_type: input.org_type,
  //         sup_type: select.sup_type,
  //         machdet: input.machdet,
  //         measinst: input.measinst,
  //         qltysystem: input.qltysystem,
  //         manpowerprod: input.manpowerprod,
  //         manpowerqlty: input.manpowerqlty,
  //         manpowerothers: input.manpowerothers,
  //         manpowertotal: input.manpowertotal,
  //         weeklyholiday: input.weeklyholiday,
  //         workhours: input.workhours,
  //         shiftdet: input.shiftdet,
  //         shifttime: input.shifttime,
  //         expansionplan: input.expansionplan,
  //         sanctionedpower: input.sanctionedpower,
  //         standbypower: input.standbypower,
  //         AddressProofType: select.AddressProofType,
  //         SMEno: input.smeno,
  //         PanCardName: select.PanCardName,
  //         GstCertificateName: select.GstCertificateName,
  //         AddressProofName: select.AddressProofName,
  //         BankDetailsName: select.BankDetailsName,
  //         SmeCertificateName: select.SmeCertificateName,
  //         EntryEmpid: this.empid,
  //         UnapproveDate: formattedDate
  //       });
  //     }

  //     this.Error = 'Are you sure to Unapprove?';
  //     this.userHeader = 'Warning!!!';
  //     this.opendialog();

  //     this.dialogRef.afterClosed().subscribe(async (result: boolean) => {
  //       if (!result) return;

  //       const dialogEmailTasks = this.selectArray.map((row, index) => {
  //         return new Promise<void>((resolve) => {
  //           this.service.unapproveCheck(row.partyid).subscribe((res: any) => {
  //             const check = res[0];
  //             const needsFinanceReason = check.fin_approved === 'Y' && check.pur_approved === 'N';
  //             const needsPurchaseReason = check.pur_approved === 'Y' && check.fin_approved === 'N';

  //             if (needsFinanceReason || needsPurchaseReason) {
  //               const area = needsFinanceReason ? 'Finance' : 'Purchase';
  //               const approvedBy = needsFinanceReason ? this.InsertArray[index].fin_approvalby : this.InsertArray[index].pur_approvalby;

  //               const dialogRef = this.dialog.open(DialogCompComponent, {
  //                 width: '450px',
  //                 data: {
  //                   Type: 'Reason',
  //                   Msg: `In ${area}, ${row.name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                 }
  //               });

  //               dialogRef.afterClosed().subscribe((dialogResult) => {
  //                 if (dialogResult?.approved && dialogResult.reason) {
  //                   this.emailArray = [{
  //                     empid: this.empid,
  //                     reason: dialogResult.reason,
  //                     code: this.InsertArray[index].code,
  //                     name: this.InsertArray[index].name,
  //                     address: this.InsertArray[index].address,
  //                     EntryEmpId: this.InsertArray[index].EntryEmpId,
  //                     ApprovedEmp: approvedBy
  //                   }];
  //                   console.log(this.emailArray);

  //                   this.service.email(this.emailArray).subscribe(() => {
  //                     this.emailArray = [];
  //                     resolve();
  //                   });
  //                 } else {
  //                   resolve(); // Skipped or cancelled
  //                 }
  //               });
  //             } else {
  //               resolve(); // No dialog needed
  //             }
  //           });
  //         });
  //       });

  //       await Promise.all(dialogEmailTasks);

  //       // Now finally call unapprove API
  //       this.service.unapprove(this.approveArray).subscribe({
  //         next: (res: any) => {
  //           this.Error = res.message;
  //           this.userHeader = 'Information';
  //           this.opendialog();

  //           // Reset all
  //           this.empArray = [];
  //           this.tableArray = [];
  //           this.selectArray = [];
  //           this.lastrowArray = [];
  //           this.inputArray = [];
  //           this.partyTypeArray = [];
  //           this.ledgergrpArray = [];
  //           this.approveArray = [];
  //           this.selectInputArray = [];
  //           this.InsertArray = [];
  //           this.partyArray = [];
  //           this.resultArray = [];
  //           this.emailArray = [];
  //           this.vendor = false;
  //           this.smeno = '';
  //           this.capital = null;
  //           this.banker = '';
  //           this.ssi = '';
  //           this.partyType = '';
  //           this.ledgergrp = '';
  //           this.gst = '';
  //           this.ecc_no = '';
  //           this.currency = '';
  //           this.partyid = '';
  //           this.Ledgername = '';
  //           this.checkapprove = 0;
  //           this.insertCalled = false;
  //           this.load();
  //         },
  //         error: () => {
  //           this.Error = 'Unapprove failed. Try again later.';
  //           this.userHeader = 'Error';
  //           this.opendialog();
  //         }
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
  //   for (let i = 0; i < this.selectArray.length; i++) {
  //     const merged = {
  //       ...this.selectInputArray[i],
  //       ...this.selectArray[i]
  //     };
  //     this.InsertArray.push(merged);
  //   }
  //   if (this.selectArray.length !== this.selectInputArray.length) {
  //     this.Error = 'Selection mismatch. Please reselect rows properly.';
  //     this.userHeader = 'Error';
  //     this.opendialog();
  //     return;
  //   }
  //   const datePipe = new DatePipe('en-US');
  //   const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
  //   if (this.selectArray.length > 0) {
  //     this.approveArray = [];
  //     for (let i = 0; i < this.selectArray.length; i++) {
  //       const select = this.selectArray[i];
  //       const input = this.selectInputArray[i]
  //       this.approveArray.push({
  //         Partyid: select.partyid,
  //         code: select.code,
  //         name: input.name,
  //         address: input.address,
  //         issupplier: select.IsSupplier,
  //         IsSubcontractor: select.IsSubcontractor,
  //         IsCustomer: select.IsCustomer,
  //         partygroup: select.PartyGroup,
  //         partytype: select.partytype,
  //         contact: input.contact,
  //         phone: input.phone,
  //         email: input.email,
  //         web_site: input.web_site,
  //         pannumber: input.pannumber,
  //         pincode: input.pincode,
  //         currid: select.currid,
  //         stateid: input.stateid,
  //         countryid: select.countryid,
  //         cityid: select.cityid,
  //         creditperiod: select.Creditperiod,
  //         gstno: select.gstno,
  //         sup_eccno: input.sup_eccno,
  //         ctypeid: input.ctypeid,
  //         establishment: input.establishment,
  //         executive: input.executive,
  //         majcustomer: input.majcustomer,
  //         capital: input.capital,
  //         ssiregno: input.ssiregno,
  //         bankersname: input.bankersname,
  //         org_type: input.org_type,
  //         sup_type: select.sup_type,
  //         machdet: input.machdet,
  //         measinst: input.measinst,
  //         qltysystem: input.qltysystem,
  //         manpowerprod: input.manpowerprod,
  //         manpowerqlty: input.manpowerqlty,
  //         manpowerothers: input.manpowerothers,
  //         manpowertotal: input.manpowertotal,
  //         weeklyholiday: input.weeklyholiday,
  //         workhours: input.workhours,
  //         shiftdet: input.shiftdet,
  //         shifttime: input.shifttime,
  //         expansionplan: input.expansionplan,
  //         sanctionedpower: input.sanctionedpower,
  //         standbypower: input.standbypower,
  //         AddressProofType: select.AddressProofType,
  //         SMEno: input.smeno,
  //         PanCardName: select.PanCardName,
  //         GstCertificateName: select.GstCertificateName,
  //         AddressProofName: select.AddressProofName,
  //         BankDetailsName: select.BankDetailsName,
  //         SmeCertificateName: select.SmeCertificateName,
  //         EntryEmpid: this.empid,
  //         UnapproveDate: formattedDate
  //       });
  //     }
  //     console.log(this.approveArray, 'this.approveArrat');

  //     this.Error = 'Are you sure to Unapprove?';
  //     this.userHeader = 'Warning!!!';
  //     this.opendialog();
  //     this.dialogRef.afterClosed().subscribe((result: boolean) => {
  //       if (result) {
  //         for (let i = 0; i < this.selectArray.length; i++) {
  //           this.emailArray = []
  //           this.service.unapproveCheck(this.selectArray[i].partyid).subscribe((result: any) => {
  //             if (result[0].sup_type === 'P') {
  //               if (result[0].pur_approved === 'N' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Finance, ${this.selectArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                          empid: this.empid,
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
  //               if (result[0].pur_approved === 'N' && result[0].fin_approved === 'Y') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Finance, ${this.selectArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
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
  //             if (result[0].sup_type === 'P') {
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'N') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase, ${this.selectArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                           empid: this.empid,
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
  //               if (result[0].pur_approved === 'Y' && result[0].fin_approved === 'N') {
  //                 const dialogRef = this.dialog.open(DialogCompComponent, {
  //                   width: '450px',
  //                   data: {
  //                     Type: 'Reason',
  //                     Msg: `In Purchase, ${this.selectArray[i].name} is approved, Kindly check. Please provide a reason for Unapproval.`
  //                   }
  //                 });
  //                 dialogRef.afterClosed().subscribe(result => {
  //                   if (result?.approved && result.reason) {
  //                     for (let i = 0; i < 1; i++) {
  //                       this.emailArray.push({
  //                           empid: this.empid,
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
  //           });
  //         }
  //         this.service.unapprove(this.approveArray).subscribe({
  //           next: (res: any) => {
  //             this.Error = res.message;
  //             this.userHeader = 'Information';
  //             this.opendialog();
  //             this.empArray = []
  //             this.tableArray = []
  //             this.selectArray = []
  //             this.lastrowArray = []
  //             this.inputArray = []
  //             this.partyTypeArray = []
  //             this.ledgergrpArray = []
  //             this.approveArray = []
  //             this.selectInputArray = []
  //             this.InsertArray = []
  //             this.partyArray = []
  //             this.resultArray = []
  //             this.emailArray = []
  //             this.vendor = false
  //             this.smeno = ''
  //             this.capital = null
  //             this.banker = ''
  //             this.ssi = ''
  //             this.partyType = ''
  //             this.ledgergrp = ''
  //             this.gst = ''
  //             this.ecc_no = ''
  //             this.currency = ''
  //             this.partyid = ''
  //             this.Ledgername = ''
  //             this.checkapprove = 0
  //             this.insertCalled = false
  //             this.load()
  //           },
  //           error: (err) => {
  //             this.Error = 'Unapprove failed. Try again later.';
  //             this.userHeader = 'Error';
  //             this.opendialog();
  //           }
  //         });
  //       }
  //     });
  //   } else {
  //     this.Error = 'Select the Rows to Unapprove';
  //     this.userHeader = 'Information';
  //     this.opendialog();
  //   }
  // }

  clear() {
    this.Error = 'Are your sure to Clear?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.empArray = []
        this.tableArray = []
        this.selectArray = []
        this.lastrowArray = []
        this.inputArray = []
        this.partyTypeArray = []
        this.ledgergrpArray = []
        this.approveArray = []
        this.selectInputArray = []
        this.InsertArray = []
        this.partyArray = []
        this.resultArray = []
        this.emailArray = []
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
        this.checkapprove = 0
        this.insertCalled = false
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
  CurrArray: any[] = []
  partygroup: any[] = []
  ledgergroupArray: any[] = []
  backArray: any[] = []
  toggleEdit() {
    console.log(this.ledgergrpid);

    console.log(this.selectArray, 'select Array');
    console.log(this.selectInputArray, 'select Input');

    if (this.selectArray.length > 0) {
      this.isEditMode = !this.isEditMode;
      this.service.currencyEdit().subscribe((result: any) => {
        this.CurrArray = result
        console.log(this.CurrArray);
      })
      this.service.pType().subscribe((result: any) => {
        this.partygroup = result
        console.log(this.partygroup, 'partygroup');
      })
      this.service.ledgergrp().subscribe((result: any) => {
        this.ledgergroupArray = result
        console.log(this.ledgergroupArray);
      })
      console.log(this.isEditMode, 'this.isEditMode');

      if (this.currencyid === 0) {
      }
      else {
        this.lastrowArray[0].currid = this.currencyid
      }
      if (this.partygroupid === 0) {

      }
      else {
        this.lastrowArray[0].ctypeid = this.partygroupid
      }
      if (this.ledgergrpid === 0) {

      }
      else {
        this.lastrowArray[0].partygroup = this.ledgergrpid
        this.lastrowArray[0].partytype = this.ledgergrpid
      }
      if (!this.isEditMode) {
        console.log(this.lastrowArray[0].partytype);
        this.backArray.push({
          partyid: String(this.selectArray[this.selectArray.length - 1].partyid),
          capital: String(this.selectInputArray[this.selectInputArray.length - 1].capital),
          bankersname: this.selectArray[this.selectArray.length - 1].BankDetailsName,
          ssi: this.selectInputArray[this.selectInputArray.length - 1].ssiregno,
          Gstno: this.selectArray[this.selectArray.length - 1].gstno,
          eccno: this.selectInputArray[this.selectInputArray.length - 1].sup_eccno,
          currentType: String(this.selectArray[this.selectArray.length - 1].currid),
          smeno: this.selectInputArray[this.selectInputArray.length - 1].smeno,
          partyType: String(this.selectArray[this.selectArray.length - 1].ctypeid),
          ledgergroup: this.selectArray[this.selectArray.length - 1].partytype,
          AlteredEmpId: String(this.empid)
        })
        console.log(this.backArray, 'backArray');


        this.editArray = []
        this.backArray = []
        this.editArray.push({
          capital: this.capital,
          bankersname: this.banker,
          ssiregno: this.ssi,
          gstno: this.gst,
          sup_eccno: this.ecc_no,
          currid: Number(this.lastrowArray[0].currid),
          SMEno: this.smeno,
          ctypeid: Number(this.lastrowArray[0].ctypeid),
          partygroup: Number(this.lastrowArray[0].partytype),
          partytype: Number(this.lastrowArray[0].partytype),
          partyid: this.partyid
        })
        this.Error = 'Are your sure to Edit?'
        this.userHeader = 'Warning!!!'
        this.opendialog()
        this.dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.service.editsave(this.editArray).subscribe((result: any) => {
              this.service.backup(this.backArray).subscribe((result: any) => {
                console.log(result);
              })
              console.log(result.message);
              this.empArray = []
              this.tableArray = []
              this.selectArray = []
              this.lastrowArray = []
              this.inputArray = []
              this.partyTypeArray = []
              this.ledgergrpArray = []
              this.approveArray = []
              this.selectInputArray = []
              this.InsertArray = []
              this.partyArray = []
              this.resultArray = []
              this.emailArray = []
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
              this.checkapprove = 0
              this.insertCalled = false
              this.load()
              this.Error = result.message
              this.userHeader = 'Information';
              this.opendialog();
            })
          }
        })
      }
      else {
      }
    }
    else {
      this.Error = 'Select the Rows to Edit';
      this.userHeader = 'Information';
      this.opendialog();
    }
  }
  test() {
    console.log('Selected Ledger ID:', this.ledgergrpid);

  }
}