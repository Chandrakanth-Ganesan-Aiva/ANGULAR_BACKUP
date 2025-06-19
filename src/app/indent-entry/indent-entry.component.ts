import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IndentEntryService } from '../service/indent-entry.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { tap, map, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-indent-entry',
  templateUrl: './indent-entry.component.html',
  styleUrls: ['./indent-entry.component.scss'],
})
export class IndentEntryComponent implements OnInit, AfterViewInit {

  form!: FormGroup;
  Empid: number = 0
  loactionId: number = 0
  constructor(private date: DatePipe, private fb: FormBuilder, private service: IndentEntryService, private dialog: MatDialog) {
    this.loactionId = JSON.parse(sessionStorage.getItem('location') || '{}');

    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    console.log(user);

    this.Empid = user.empid;
    this.form = this.fb.group({
      StockReqNo: new FormControl(''),
      IndentDate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }),
      FromDate: new FormControl(this.date.transform(new Date(), 'yyyy-MM-dd')),
      Todate: new FormControl({ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }),
      costcenter: new FormControl('', Validators.required),
      Category: new FormControl(''),
      dept: new FormControl('', Validators.required),
      prnewtype: new FormControl('1'),
      Approvedby: new FormControl(''),
      Emp: new FormControl(user.cusername),
      PurDeptResponse: new FormControl('', Validators.required),
      Rawmaterial: new FormControl('', Validators.required),
      Capex: new FormControl(''),
      desc: new FormControl(''),
      CapexDesc: new FormControl(''),
      IndentRaiseEmp: new FormControl('', Validators.required),
    })
  }
  @ViewChild('dataSourcePaginator', { static: false }) dataSourcePaginator!: MatPaginator;
  @ViewChild('oldPoPaginator', { static: false }) oldPoPaginator!: MatPaginator;
  @ViewChild('oldPoPaginator1', { static: false }) oldPoPaginator1!: MatPaginator;
  @ViewChild('OldIndentpaginator', { static: false }) OldIndentpaginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.dataSourcePaginator
    this.oldPoDataSource.paginator = this.oldPoPaginator
    this.oldPoDataSource2.paginator = this.oldPoPaginator1
    this.OldIndentDataSource.paginator = this.OldIndentpaginator
  }
  filteredOptions: any[] = [];
  filterControl = new FormControl('');
  EmpfilterControl = new FormControl('');
  ngOnInit() {
    this.getStockReqno()
    this.GetDepartment()
    this.getcostCenter()
    this.category()
    this.filterControl.valueChanges.pipe(map((search) =>
      this.MaterialArr.filter((option: any) =>
        option.PartyName.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.MaterialArrfilter = filtered));

    this.EmpfilterControl.valueChanges.pipe(map((search) =>
      this.EmpArr.filter((option: any) =>
        option.PartyName.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.EmpArrfilter = filtered));
  }

  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    this.service.Stockreno(this.form.controls['FromDate'].value, this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.StockReq = res
          this.form.controls['StockReqNo'].setValue(this.StockReq[0].translno)
        }
      }
    })
  }
  frmDatechangeEvent(e: any) {
    if (this.form.controls['FromDate'].value) {
      this.form.controls['FromDate'].setValue(this.date.transform(e.target.value, 'yyyy-MM-dd'))
      this.GetDepartment()
    }
  }
  DepartmentArr: any[] = []
  GetDepartment() {
    this.service.Department(this.loactionId, this.form.controls['FromDate'].value, this.form.controls['Todate'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.DepartmentArr = res
          this.form.controls['dept'].setValue(res[0].deptid)
          this.form.controls['Category'].setValue(res[0].catid)
          this.getApprovedby()
          this.category()
        } else {
          this.Error = 'No Indent Entry Founded From Date <strong style="color:brown;">  ' + this.form.controls['FromDate'].value + '</strong> To Date <strong style="color:brown;">  ' + this.form.controls['Todate'].value + '</strong>'
          this.userHeader = 'Information'
          return this.opendialog()
        }
      }
    })
  }

  categoryArr: any[] = new Array()
  category() {
    this.service.Category(this.loactionId, this.Empid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.categoryArr = res
          this.form.controls['Category'].setValue(res[0].catid)
        }
      }
    })
  }
  costcentreArr: any[] = []
  getcostCenter() {
    this.service.CostCenter().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.costcentreArr = res
          this.form.controls['costcenter'].setValue(res[0].costcentreid)
        }
      }
    })
  }
  deptChangeevent() {
    if (this.form.controls['dept'].value) {
      this.getApprovedby()
      this.getIndentRawmaterial()
      this.getInedntEmp()
      this.getResponsableEmp()
    }
  }
  ApprovedbyArr: any[] = []
  getApprovedby() {
    this.service.Approvedby(this.loactionId, this.form.controls['dept'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.ApprovedbyArr = res
          this.form.controls['Approvedby'].setValue(res[0].empid)
        }
      }
    })
  }
  MaterialArr: any[] = []
  MaterialArrfilter: any[] = []
  getIndentRawmaterial() {
    this.service.StoreMatl(this.loactionId, this.form.controls['dept'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.MaterialArr = res
          this.MaterialArrfilter = res
        }
      }
    })
  }

  EmpArr: any[] = []
  EmpArrfilter: any[] = []
  getInedntEmp() {
    this.service.StoreRelaseEmp(this.loactionId, this.form.controls['dept'].value, this.form.controls['Category'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.EmpArr = res
          this.EmpArrfilter = res
        }
      }
    })
  }
  ResponsableEmpArr: any[] = []
  getResponsableEmp() {
    this.service.ResponsableEmp().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.ResponsableEmpArr = res
        }
      }
    })
  }
  PrTypeChangeEvent() {
    if (this.form.controls['prnewtype'].value == 2) {
      this.getCapex()
    } else {
      this.form.controls['desc'].setValue('')
      this.CapexText = ''
      this.capexattach = ''
    }
  }
  CapexArr: any[] = new Array()
  getCapex() {
    this.service.Capex(this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.CapexArr = res
        }
      }
    })
  }
  ProjName: string = ''
  CapexText: any
  capexattach: any
  CapexChangeEvent() {
    if (this.form.controls['Capex'].value) {
      this.CapexArr.filter((item: any) => {
        if (this.form.controls['Capex'].value == item.capexno) {
          this.form.controls['desc'].setValue(item.description)
          this.CapexText = item.capexattach
          this.capexattach = item.capexattach
        }
      })
    }
  }
  selectedFile: File | null = null;
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  AddAttachment(): void {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
  }
  dataSource: any = new MatTableDataSource()
  ViewType: string = ''
  getStoreRelease() {
    console.log(1);
    console.log(this.form);

    if (this.form.invalid) return this.form.markAllAsTouched()
    this.ViewType = 'PoQty'
    console.log(2);
    let deptid = this.form.controls['dept'].value
    let prtype = this.form.controls['prnewtype'].value
    let IndentEmp = this.form.controls['IndentRaiseEmp'].value
    let Rawmatid = this.form.controls['Rawmaterial'].value
    let Frmdate = this.form.controls['FromDate'].value
    let Todate = this.form.controls['Todate'].value
    this.service.View(this.loactionId, deptid, prtype, IndentEmp, Rawmatid, Frmdate, Todate).pipe(
      tap((res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            return this.opendialog();
          }
        }
      }),
      switchMap((res: any) => {
        this.dataSource.data = res;
        const pocalls = res.map((item: any) =>
          this.service.PoPending(this.loactionId, item.RawMatID, this.ViewType).pipe(map((poPend: any) => {
            if (poPend.length > 0) {
              if (poPend[0].status === 'N') {
                this.Error = poPend[0].Msg;
                this.userHeader = 'Error';
                return this.opendialog();
              }
              return {
                ...item,
                IssueQty: '',
                Select: false,
                PoPendingQty: poPend[0]?.bal
              }
            }
          }))
        );
        return forkJoin(pocalls)
      })
    ).subscribe((finalData: any) => {
      this.dataSource.data = finalData;
      this.dataSource.data = [...this.dataSource.data]
      this.dataSource.paginator = this.dataSourcePaginator;
    })
  }
  materialInput(e: any) {
    let searchValue = e.target.value
    if (searchValue) {
      this.dataSource.filter = searchValue.trim().toLowerCase();
      this.dataSource.data = [...this.dataSource.data]
    }
    this.dataSource.data = [... this.dataSource.data]
  }
  @ViewChild('Oldpo') Oldpo!: TemplateRef<any>
  oldpodialog: any = ''
  RawmatName: string = ''
  SelectRawmatid: number = 0
  OldIndentDataSource = new MatTableDataSource()
  getOldpo(row: any) {
    this.ViewType = 'OldIndent'
    this.RawmatName = row.gStrMatDisp
    this.SelectRawmatid = row.RawMatID
    this.oldpodialog = this.dialog.open(this.Oldpo, {
      disableClose: true,
    })
    this.getOldPoUnit()
    this.getOldPoUnit2()
    this.ViewType = 'OldIndent'
    this.service.PoPending(this.loactionId, row.RawMatID, this.ViewType).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.OldIndentDataSource.data = res;
          this.OldIndentDataSource.data = [...this.OldIndentDataSource.data]
          this.OldIndentDataSource.paginator = this.OldIndentpaginator
        }
      }
    })
  }
  closeDialog() {
    this.oldpodialog.close()
  }
  oldPoDataSource = new MatTableDataSource()
  getOldPoUnit() {
    this.service.IndentEntry_OldPo(this.SelectRawmatid, this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }

          this.oldPoDataSource.data = res;
          this.oldPoDataSource.data = [...this.oldPoDataSource.data]
          console.log(this.oldPoDataSource.data);
          this.oldPoDataSource.paginator = this.oldPoPaginator

          // this.dataSource.paginator = this.dataSourcePaginator
        }
      }
    })
  }
  oldPoDataSource2 = new MatTableDataSource()
  getOldPoUnit2() {
    let Locid: number = 0
    if (this.loactionId == 1) {
      Locid = 2
    }
    this.service.IndentEntry_OldPo(this.SelectRawmatid, Locid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].staus == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.oldPoDataSource2.data = res;
          this.oldPoDataSource2.data = [...this.oldPoDataSource2.data]
          this.oldPoDataSource2.paginator = this.oldPoPaginator1
          // this.dataSource.paginator = this.dataSourcePaginator
        }
      }
    })
  }

  CurrentQtyEvent(row: any) {
    let PendingQty: number = row.srqty - (row.minqty + row.prqty)
    if (row.IssueQty > PendingQty) {
      row.IssueQty = ''
      this.Error = 'Quantity cannot be greater than pending quantity'
      this.userHeader = 'Information'
      return this.opendialog()
    }
  }
  getSaveVaild() {
    let isSelected = this.dataSource.data.filter((item: any) => item.Select)
    console.log(isSelected);


    if (isSelected.length == 0) {
      this.Error = 'Select Atleast One Material To Convert Requestion To Indent '
      this.userHeader = 'Information'
      return this.opendialog()
    }
    const hasInvalidIssueQty = isSelected.some((item: any) => !item.IssueQty || Number(item.IssueQty) <= 0);
    if (hasInvalidIssueQty) {
      this.Error = 'Select Indent Material IssueQty Should Be Greater Than Zero '
      this.userHeader = 'Information'
      return this.opendialog()
    }
    else {
      this.Error = 'Do You Want To Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.Save()
        } else {
          this.Error = 'Save Cancelled'
          this.userHeader = 'Information'
          return this.opendialog()
        }
      })
    }
  }
  Save() {
    let SaveArr = {}
    let MatlArr: any[] = []
    let isSelected = this.dataSource.data.filter((item: any) => item.Select)
    console.log(isSelected);

    isSelected.forEach((Matl: any) => {
      MatlArr.push({
        Rawmatid: Matl.RawMatID,
        Prqty: parseInt(Matl.IssueQty),
        Uom: Matl.Uom,
        SrId: Matl.SRId,
        Materialspec: Matl.MaterialSpec,
        MaterialDesc: Matl.MaterialSpec,
        DescRemark: Matl.Desc,
        Priority: Matl.priority,
        capexno: Matl.capexno,
        capexnumber: Matl.capexnumber,
        capexattach: Matl.capexattach
      })
    });
    SaveArr = {
      pr_ref_no: this.form.controls['StockReqNo'].value,
      DeptID: this.form.controls['dept'].value,
      capexattach: parseInt(this.form.controls['Capex'].value ? this.form.controls['Capex'].value : 0),
      costcenter: parseInt(this.form.controls['costcenter'].value),
      pr_newtype: parseInt(this.form.controls['prnewtype'].value),
      PRDesc: this.form.controls['desc'].value ? this.form.controls['desc'].value : '',
      ApprovedBy: this.form.controls['Approvedby'].value,
      LocationId: this.loactionId,
      Empid: this.Empid,
      PurResponsable: this.form.controls['PurDeptResponse'].value,
      MatlDetail: MatlArr,
    }
    console.log(SaveArr);
    this.service.Save(SaveArr).subscribe({
      next: (data: any) => {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          return this.opendialog()
        } else {
          this.Error = data[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
              this.form.reset()
              this.form.controls['prnewtype'].setValue('1')
              this.form.controls['FromDate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
              this.form.controls['Todate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
              this.form.controls['Todate'].disable()
              this.dataSource.data = []
              this.oldPoDataSource.data = []
              this.oldPoDataSource2.data = []
              this.form.markAsUntouched()
              this.getStockReqno()
              this.GetDepartment()
              this.getcostCenter()
              this.category()
            }
          })
        }
      }
    })
  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }
}


