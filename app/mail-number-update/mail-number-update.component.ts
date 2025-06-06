import { Component } from '@angular/core';
import { MailNumberUpdateService } from '../service/mail-number-update.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mail-number-update',
  templateUrl: './mail-number-update.component.html',
  styleUrl: './mail-number-update.component.scss'
})
export class MailNumberUpdateComponent {
  constructor(private service: MailNumberUpdateService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    // this.empid = user.empid
    this.empid = 154234
    this.show = false
    this.selectedType = 'supplier'
    this.view()
  }

  empid: number | null = 0
  searchtext: string | null = ''
  selectedType: string | null = null;
  inactivecon: boolean | null = null
  show: boolean = false
  searchText: string = '';
  useHeader: string = '';
  Error: string = ''
  selectedrowArray: any[] = []
  tableArray: any[] = []
  approvedArray: any[] = []

  toggleRadio(type: string, event: Event) {
    this.show = false
    this.approvedArray = []
    this.tableArray = []
    this.selectedrowArray = []
    if (this.selectedType === type) {
      this.selectedType = null;
      (event.target as HTMLInputElement).checked = false;
      this.tableArray = []
      this.show = false
    } else {
      this.selectedType = type;
    }
    if (this.selectedType == 'subcontract') {
      this.inactivecon = false
      const checkbox = document.getElementById('inactive') as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false;
      }
    }
  }
  inactive(event: any) {
    this.tableArray = []
    this.approvedArray = []
    this.selectedrowArray = []
    this.show = false
    this.show = false
    if (event.target.checked) {
      this.inactivecon = true
      if (this.selectedType == 'subcontract') {
        this.selectedType = null
      }
    } else {
      this.tableArray = []
      this.show = false
      this.inactivecon = false
    }
  }
  view() {
    this.tableArray = []
    this.approvedArray = []
    this.selectedrowArray = []
    this.show = false
    this.searchText = ''
    if (this.selectedType) {
      if (this.selectedType == 'supplier') {
        if (this.inactivecon) {
          this.service.suppinactY().subscribe((result: any) => {
            this.tableArray = result
            if (this.tableArray.length > 0) {
              this.show = true
            } else {
              this.show = false
            }
          })
        } else {
          this.service.suppinactN().subscribe((result: any) => {
            this.tableArray = result
            if (this.tableArray.length > 0) {
              this.show = true
            } else {
              this.show = false
            }
          })
        }
      } else {
        this.inactivecon = false
        this.service.suppinactSub().subscribe((result: any) => {
          this.tableArray = result
          if (this.tableArray.length > 0) {
            this.show = true
          } else {
            this.show = false
          }
        })
      }
    } else {
      this.Error = 'Select the Type'
      this.useHeader = 'Information'
      this.opendialog()
    }
  }
  search() {
  }
  searchButtonClick() {
    this.approvedArray = []
    this.tableArray = []
    this.show = false
    this.selectedrowArray = []
    if (this.selectedType) {
      if (this.searchText) {
        if (this.selectedType == 'supplier') {
          if (this.inactivecon) {
            this.service.searchinactY(this.searchText).subscribe((result: any) => {
              this.tableArray = result
              if (this.tableArray.length > 0) {
                this.show = true
              } else {
                this.show = false
              }
            })
          } else {
            this.service.searchinactN(this.searchText).subscribe((result: any) => {
              this.tableArray = result
              if (this.tableArray.length > 0) {
                this.show = true
              } else {
                this.show = false
              }
            })
          }
        } else {
          this.service.searchsub(this.searchText).subscribe((result: any) => {
            this.tableArray = result
            if (this.tableArray.length > 0) {
              this.show = true
            } else {
              this.show = false
            }
          })
        }
      }
      else {
        this.Error = 'Enter the Supplier name'
        this.useHeader = 'Information'
        this.opendialog()
      }
    }
    else {
      this.Error = 'Select the Type'
      this.useHeader = 'Information'
      this.opendialog()
    }
  }
  clear() {
    this.searchtext = ''
    this.selectedType = null;
    this.inactivecon = null
    this.show = false
    this.selectedrowArray = []
    this.tableArray = []
    this.approvedArray = []
    this.inactivecon = false;
    this.tableArray = [];
    this.show = false;
    this.searchText = '';
    const checkbox = document.getElementById('inactive') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
  selectedrows(event: any, row: any) {
    if (event.target.checked) {
      console.log(row);

      this.selectedrowArray.push(row);  // Store only the supid
    } else {
      this.selectedrowArray = this.selectedrowArray.filter((supid) => supid !== row);  // Remove by supid
    }
    console.log(this.selectedrowArray);
  }
  update() {
    if (this.selectedrowArray.length > 0) {
      console.log(this.selectedrowArray, 'selected');
      this.approvedArray = []
      for (let i = 0; i < this.selectedrowArray.length; i++) {
        this.approvedArray.push({
          login: this.empid,
          email: this.selectedrowArray[i].email ? this.selectedrowArray[i].email : '',
          mobile: this.selectedrowArray[i].mobileno ? this.selectedrowArray[i].mobileno : '',
          pannumber: this.selectedrowArray[i].panno ? this.selectedrowArray[i].panno : '',
          address: this.selectedrowArray[i].address ? this.selectedrowArray[i].address : '',
          active: this.selectedrowArray[i].active ? this.selectedrowArray[i].active : '',
          supid: this.selectedrowArray[i].supid,
          type: this.selectedType
        })
      }
      this.Error = 'Are you sure to Update ?'
      this.useHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          console.log(this.approvedArray);
          this.service.update(this.approvedArray).subscribe((result: any) => {
            this.Error = result.message
            this.useHeader = 'Information'
            this.opendialog()
            this.clear()
          })
        }
      })
    }
    else {
      this.Error = 'Select the rows to Update'
      this.useHeader = 'Information'
      this.opendialog()
    }
  }
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.useHeader }
    })
  }
  currentPage: number = 1;
  pageSize: number = 5;
  totalRecords: number = 0;
  totalPages: number = 0;
  getPaginatedData() {
    this.totalRecords = this.tableArray.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    return this.tableArray.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }
  changePage(step: number) {
    const newPage = this.currentPage + step;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }
  handleInputChange(row: any) {
    if (!this.selectedrowArray.includes(row)) {
      this.selectedrowArray.push(row);
    }
  }
}                                                     