import { Component, OnDestroy, OnInit, Type, inject } from '@angular/core';
import { debounceTime, from, map, Subscription, switchMap } from 'rxjs';
import { ItemmasterService } from '../service/itemmaster.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrl: './item-master.component.scss'
})
export class ItemMasterComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  LocationId: number = 0
  form!: FormGroup;
  Empid: number = 0
  constructor(private service: ItemmasterService, private dialog: MatDialog, private fb: FormBuilder, private date: DatePipe) {
    this.LocationId = JSON.parse(sessionStorage.getItem('location') || '{}');
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.form = this.fb.group({
      itemCode: ['', Validators.required],
      category: ['', Validators.required],
      Dept: ['', Validators.required],
      drgo: [''],
      itemName: ['', Validators.required],
      Spec: [{ value: '', disabled: true }, [Validators.required]],
      Uom: ['', Validators.required],
      make: [''],
      weight: [''],
      grade: [''],
      saleable: [false],
      shelflife: [false],
      qcReq: [false],
      loc_id: [''],
      min_level: [''],
      max_level: [''],
      reorder_level: [''],
      hsncode: ['']
    })

  }
  catFilterControl = new FormControl('')
  deptFilterArr = new FormControl('')
  UomFilterArr = new FormControl('')
  GradeFiterArr = new FormControl('')
  RawMatLocFilterArr = new FormControl('')
  hsnArrFormcontrol = new FormControl('')
  ngOnInit() {

    this.getCat()
    this.getDept()
    this.getUom()
    this.gethsn()
    this.getgrade()
    this.getRawLoc()

    this.catFilterControl.valueChanges.pipe(map((search) =>
      this.categoryArr.filter((option: any) =>
        option.grntype.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.filterCategory = filtered))

    this.deptFilterArr.valueChanges.pipe(map((search) =>
      this.DeptArr.filter((option: any) =>
        option.deptname.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.filterDept = filtered))

    this.UomFilterArr.valueChanges.pipe(map((search) =>
      this.uomArr.filter((option: any) =>
        option.uomname.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered: any) => (this.filterUom = filtered))

    this.GradeFiterArr.valueChanges.pipe(map((search) =>
      this.gradeArr.filter((option: any) =>
        option.gradename.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.filterGrade = filtered))

    this.RawMatLocFilterArr.valueChanges.pipe(map((search) =>
      this.RawMatLocArr.filter((option: any) =>
        option.locid.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered: any) => (this.filterRawMatLoc = filtered))

    this.hsnArrFormcontrol.valueChanges.pipe(
      map((search: any) => {
        if (search && search.length > 1) {
          return this.hsnArr.filter((option: any) =>
            option.hsncode.toLowerCase().includes(search.toLowerCase())
          );
        } else {
          return [];
        }
      })
    ).subscribe((filtered: any) => {
      this.hsnArrFilter = filtered;
    });


  }

  categoryArr: any[] = new Array()
  filterCategory: any[] = new Array()
  getCat() {
    const sub = this.service.itemCat(this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.categoryArr = res
          this.filterCategory = res
        }
      }
    })
    this.subscriptions.add(sub);
  }

  CategoryEvent() {
    if (this.form.controls['category'].value == 104) {
      this.form.controls['saleable'].setValue(true)
      this.form.controls['drgo'].setValidators(Validators.required)
      this.form.get('drgo')?.updateValueAndValidity();
      this.form.controls['saleable'].disable()
      this.form
    } else {
      this.form.controls['saleable'].setValue(false)
      this.form.get('drgo')?.setValidators([]);
      this.form.get('drgo')?.updateValueAndValidity();
      this.form.controls['saleable'].enable()
    }
    if (this.form.controls['category'].value == 1) {
      this.form.controls['Spec'].enable()
    }
  }

  DeptArr: any[] = new Array()
  filterDept: any[] = new Array()
  getDept() {
    const sub = this.service.itemDept(this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.DeptArr = res
          this.filterDept = res
        }
      }
    })
    this.subscriptions.add(sub)
  }

  uomArr: any[] = new Array()
  filterUom: any[] = new Array()
  getUom() {
    const sub = this.service.itemUom().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.uomArr = res
          this.filterUom = res
        }
      }
    })
    this.subscriptions.add(sub)
  }

  hsnArr: any[] = new Array()
  hsnArrFilter: any[] = new Array()
  gethsn() {
    const sub = this.service.itemHsncode().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'Y') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.hsnArr = res
          this.hsnArrFilter = res
        }
      }
    })
    this.subscriptions.add(sub)
  }

  gradeArr: any[] = new Array()
  filterGrade: any[] = new Array()
  getgrade() {
    const sub = this.service.itemgrade().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.gradeArr = res
          this.filterGrade = res
        }
      }
    })
    this.subscriptions.add(sub)
  }

  RawMatLocArr: any[] = new Array()
  filterRawMatLoc: any[] = new Array()
  getRawLoc() {
    const sub = this.service.itemRawLoc().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.RawMatLocArr = res
          this.filterRawMatLoc = res
        }
      }
    })
    this.subscriptions.add(sub)
  }
  Search(e: any) {
    let searchValue = e.target.value
    if (searchValue) {
      this.dataSource.filter = searchValue.trim().toLowerCase()
      this.dataSource.data = [... this.dataSource.data];
    } else {
      searchValue = ''
    }
  }

  Rawmaterial: any[] = new Array()
  itemMaster: any[] = new Array()
  dataSource = new MatTableDataSource()
  dataSource1 = new MatTableDataSource()
  itemEvent() {
    const inputValue: string = this.form.controls['itemName'].value || '';
    const totalLength: number = inputValue.length;
    if (totalLength >= 3) {
      const sub = this.service.itemRawMaterial(this.form.controls['itemName'].value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.openDialog()
            }
            this.Rawmaterial = res


            this.dataSource.data = [...res]
            this.dataSource.data = [...this.dataSource.data]
            console.log(this.dataSource.data);
          } else {
            this.dataSource.data = []
          }
        }
      })
      const sub1 = this.service.itemItemMaster(this.form.controls['itemName'].value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.openDialog()
            }
            this.itemMaster = res
            this.dataSource1.data = [...this.itemMaster]
            this.dataSource1.data = [...this.dataSource1.data]
          } else {
            this.dataSource.data = []
          }
        }
      })
      this.subscriptions.add(sub);
      this.subscriptions.add(sub1);
    } else {
      this.dataSource.data = []
      this.dataSource1.data = []
    }
  }
  saleable: string = 'N'
  shelflife: string = 'N'
  qcreq: string = 'N'
  saveVaild() {
    if (this.form.invalid) {
      return this.form.markAllAsTouched()
    }
    this.saleable = this.form.controls['saleable'].value ? 'Y' : 'N';
    this.shelflife = this.form.controls['shelflife'].value ? 'Y' : 'N';
    this.qcreq = this.form.controls['qcReq'].value ? 'Y' : 'N';

    const categoryValue = Number(this.form.controls['category'].value);
    if (categoryValue === 104 && this.saleable === 'N') {
      this.Error = `Please check the Saleable Option.Because Your Selecting a Category type <strong style="color:brown;">Product</strong>`
      this.userHeader = 'Warining'
      return this.openDialog()
    }
    if (this.saleable === 'Y') {
      if (categoryValue === 104) {
        if (this.form.controls['drgo'].value == '') {
          this.form.controls['drgo'].setValidators(Validators.required)
          this.Error = `Please fill the Drawing No.`
          this.userHeader = 'Warining'
          return this.openDialog()
        }
        if (this.form.controls['grade'].value == '') {
          this.form.controls['grade'].setValidators(Validators.required)
          this.Error = `Without Grade cannot be saved.`
          this.userHeader = 'Warining'
          return this.openDialog()
        }
      }
    }
    this.service.exisitingItemCheck(this.form.controls['itemName'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          if (res[0].cc > 0) {
            this.Error = 'Already Exists in Rawmaterial Master. You cannot create duplicate material'
            this.userHeader = "Information"
            return this.openDialog()
          } else {
            this.Error = 'Do you Want To Save ? '
            this.userHeader = 'Save'
            this.openDialog()
            this.dialogRef.afterClosed().subscribe((res: any) => {
              if (res) {
                this.save()
              } else {
                this.Error = 'Save Canclled '
                this.userHeader = 'Infromation'
                return this.openDialog()
              }
            })
          }
        }
      }
    })

  }

  UomName: string = ''
  save() {
    this.uomArr.filter((item: any) => {
      if (this.form.controls['Uom'].value == item.uomid) {
        this.UomName = item.uomname
      }
    })
    const updateData = {
      itemcode: this.form.controls['itemCode'].value,
      itemname: this.form.controls['itemName'].value,
      deptid: this.form.controls['Dept'].value,
      spec: this.form.controls['Spec'].value,
      hsncode: this.form.controls['hsncode'].value ? this.form.controls['hsncode'].value : null,
      make: this.form.controls['make'].value ? this.form.controls['make'].value : '',
      uom: this.UomName,
      loc_id: this.form.controls['loc_id'].value ? this.form.controls['loc_id'].value : null,
      uomid: this.form.controls['Uom'].value,
      grntypeid: this.form.controls['category'].value,
      min_level: parseFloat(Number(this.form.controls['min_level'].value ? this.form.controls['min_level'].value : 0).toFixed(3)),
      max_level: parseFloat(Number(this.form.controls['max_level'].value ? this.form.controls['max_level'].value : 0).toFixed(3)),
      reorder_level: parseFloat(Number(this.form.controls['reorder_level'].value ? this.form.controls['reorder_level'].value : 0).toFixed(3)),
      qcreq: this.qcreq,
      shelflife: this.shelflife,
      saleable: this.saleable,
      weight: parseFloat(Number(this.form.controls['weight'].value ? this.form.controls['weight'].value : 0).toFixed(3)),
      locationid: this.LocationId,
      loginid: this.Empid,
      drgno: this.form.controls['drgo'].value ? this.form.controls['drgo'].value : '',
      gradeid: this.form.controls['grade'].value ? this.form.controls['grade'].value : 0,
      EntryDate: this.date.transform(new Date, 'yyyy-MM-dd')
    }
    const sub = this.service.ItemMasSave(updateData).subscribe({
      next: (res: any) => {
        if (res[0].status == 'Y') {
          this.Error = res[0].Msg
          this.userHeader = 'Information'
          this.openDialog()
          this.dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
              this.form.reset()
              this.form.markAsUntouched()
              this.getCat()
              this.getDept()
              this.getUom()
              this.gethsn()
              this.getgrade()
              this.getRawLoc()
            }
          })
        } else {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          return this.openDialog()
        }
      }
    })
  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  openDialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      height: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // cleans up all added subs
  }


}
