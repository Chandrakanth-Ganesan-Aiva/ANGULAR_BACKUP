import { Component, OnInit } from '@angular/core';
import { SuppliergstService } from '../service/suppliergst.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
@Component({
  selector: 'app-suppliergst',
  templateUrl: './suppliergst.component.html',
  styleUrls: ['./suppliergst.component.scss']
})
export class SuppliergstComponent implements OnInit {

  constructor(private service: SuppliergstService, private dialog: MatDialog) { }
  supplierArray: any[] = []
  supplierArray1: any[] = []
  TableArray: any[] = []
  approveArray: any[] = []
  supplierId: number | null = null
  gstNo: string | null = null
  PanNo: string | null = null
  ContactNo: number | null = null
  EmailId: string | null = null
  MobileNo: string | null = null
  supplierType: string | null = null
  empid: number | null = null
  Error: string = ''
  userHeader: string = ''
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid;
    console.log('Logged-in Employee ID:', this.empid);
  }
  bindSupplierDetails(data: any) {
    if (data && data.length > 0) {
      const item = data[0];
      this.gstNo = item.gstno;
      this.PanNo = item.pannumber;
      this.ContactNo = item.gst_contact;
      this.EmailId = item.gst_emailid;
      this.MobileNo = item.gst_mobileno;
    }
  }
  supplier(event: any) {
    this.approveArray = [];
    if (!event || !this.supplierType) {
      this.resetForm();
      this.Error = 'Select supplier and type!'
      this.userHeader = 'Information'
      this.opendialog()
      return;
    }
    this.supplierId = event.supid;
    switch (this.supplierType) {
      case 'Supplier':
        this.service.supplier1(this.supplierId).subscribe((result: any) => {
          this.supplierArray1 = result;
          this.bindSupplierDetails(result);
        });
        break;

      case 'Subcontractor':
        this.service.subcontract1(this.supplierId).subscribe((result: any) => {
          this.supplierArray1 = result;
          this.bindSupplierDetails(result);
        });
        break;

      case 'Customer':
        this.service.customer1(this.supplierId).subscribe((result: any) => {
          this.supplierArray1 = result;
          this.bindSupplierDetails(result);
        });
        break;

      default:
        alert('Invalid supplier type!');
    }
  }
  resetForm() {
    this.supplierId = null;
    this.gstNo = null;
    this.PanNo = null;
    this.ContactNo = null;
    this.EmailId = null;
    this.MobileNo = null;
    this.approveArray = [];
  }
  type() {
    this.resetForm();
    this.supplierArray = [];
    this.TableArray = [];
    console.log('Selected Type:', this.supplierType);
    if (this.supplierType === 'Supplier') {
      this.service.supplier().subscribe((result: any) => {
        this.supplierArray = result;
      });
      this.service.suppliertable().subscribe((result: any) => {
        this.TableArray = result;
      });
    }
    if (this.supplierType === 'Subcontractor') {
      this.service.subcontract().subscribe((result: any) => {
        this.supplierArray = result;
      });
      this.service.subcontracttable().subscribe((result: any) => {
        this.TableArray = result;
      });
    }
    if (this.supplierType === 'Customer') {
      this.service.customer().subscribe((result: any) => {
        this.supplierArray = result.map((item: any) => ({
          supid: item.custid,
          supname: item.custname,
          gst: item.gstno
        }));
      });
      this.service.customertable().subscribe((result: any) => {
        this.TableArray = result.map((item: any) => ({
          supid: item.custid,
          supname: item.custname,
          gstno: item.gstno,
          pannumber: item.pannumber,
          gst_contact: item.gst_contact,
          gst_emailid: item.gst_emailid,
          gst_mobileno: item.gst_mobileno
        }));
      });
    }
  }

  save() {
    if (!this.supplierType || !this.supplierId) {
      this.Error = 'Please select a valid type and fill the details.'
      this.userHeader = 'Information'
      this.opendialog()
      return;
    }
    this.Error = 'Are you sure to Approve?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.approveArray = [{
          gstno: this.gstNo,
          panno: this.PanNo,
          contact: this.ContactNo,
          emailid: this.EmailId,
          mobileno: this.MobileNo,
          supid: this.supplierId,
          gstupdated: String(this.empid)
        }];
        console.log(this.approveArray)
        switch (this.supplierType) {
          case 'Supplier':
            this.service.savesupp(this.approveArray).subscribe((result: any) => {
              this.Error = result.message
              this.userHeader = 'Information'
              this.opendialog()
              this.type();
            });
            break;

          case 'Subcontractor':
            this.service.savesubcon(this.approveArray).subscribe((result: any) => {
              this.Error = result.message
              this.userHeader = 'Information'
              this.opendialog()
              this.type();
            });
            break;

          case 'Customer':
            this.service.savecust(this.approveArray).subscribe((result: any) => {
              this.Error = result.message
              this.userHeader = 'Information'
              this.opendialog()
              this.type();
            });
            break;

          default:
            this.Error = 'Select a valid type.'
            this.userHeader = 'Information'
            this.opendialog()
        }
      }
    })
  } dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
  clear() {
    this.supplierArray = []
    this.supplierArray1 = []
    this.TableArray = []
    this.approveArray = []
    this.supplierId = null
    this.gstNo = null
    this.PanNo = null
    this.ContactNo = null
    this.EmailId = null
    this.MobileNo = null
    this.supplierType = null
    this.empid = null
    this.Error = ''
    this.userHeader = ''
  }
}
