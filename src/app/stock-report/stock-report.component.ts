import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StockReportService } from '../service/stock-report.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { debounceTime, distinctUntilChanged, filter, from, map, Subscription, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrl: './stock-report.component.scss'
})
export class StockReportComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  form!: FormGroup
  LocationId: number = 0
  Empid: number = 0
  CatgFilter = new FormControl('')
  LocFilter = new FormControl('')
  UnitFilter = new FormControl('')
  ItemFilter = new FormControl()
  filterSubscription: Subscription | undefined;
  constructor(private date: DatePipe, private fb: FormBuilder, private dialog: MatDialog, private service: StockReportService) {

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]

    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid

    this.form = this.fb.group({
      frmdate: [this.date.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      todate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, [Validators.required]],
      Category: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      Item: ['', [Validators.required]]
    })
  }
  @ViewChild('paginator')paginator!:MatPaginator
  ngAfterViewInit() {
    this.dataSource.paginator=this.paginator
  }
  ngOnInit() {
    this.getCatg()

    this.CatgFilter.valueChanges.pipe(map((search) =>
      this.catgArr.filter((option: any) =>
        option.grntype.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.catgArrFilter = filtered))

    this.LocFilter.valueChanges.pipe(map((search) =>
      this.LocArr.filter((option: any) =>
        option.location.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.LocArrFilter = filtered))

    this.ItemFilter.valueChanges.pipe(map((search) =>
      this.ItemArr.filter((option: any) =>
        option.rawmatname.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.ItemArrFilt = filtered))


    // this.filterSubscription = this.ItemFilter.valueChanges
    //   .pipe(
    //     debounceTime(300), // Wait for 300ms after the user stops typing
    //     distinctUntilChanged(), // Only trigger if the search term has changed
    //     filter((search: string) => search.trim().length >= 2), // Ensure at least 2 characters before calling the API
    //     switchMap((search: string) => this.service.Item(this.form.controls['Category'].value, search)) // Call the service to fetch the data
    //   )
    //   .subscribe({
    //     next: (res: any) => {
    //       if (res.length > 0) {
    //         if (res[0].status == 'N') {
    //           this.Error = res[0].Msg
    //           this.userHeader = 'Error'
    //           return this.openDialog()
    //         }
    //         this.ItemArrFilt = res
    //       }
    //     }
    //   })
  }
  dateChageEvent(e: any) {
    this.form.controls['frmdate'].setValue(this.date.transform(e.target.value, 'yyyy-MM-dd'))
  }
  catgArr: any[] = new Array()
  catgArrFilter: any[] = new Array()
  getCatg() {
    const sub = this.service.Category().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.catgArr = res
          this.catgArrFilter = res
          // this.form.controls['Category'].setValue(res[0].grntypeid)
          this.getLoc()
        }
      }
    })

    this.subscriptions.add(sub)
  }
  LocArr: any[] = new Array()
  LocArrFilter: any[] = new Array()
  getLoc() {
    const sub = this.service.Unit().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.LocArr = res
          this.LocArrFilter = res
          this.form.controls['unit'].setValue(res[0].companyid)
        }
      }
    })
    this.subscriptions.add(sub)
  }
  CategoryName:string=''
  catgChangeEvent() {
    if (this.form.controls['Category'].value) {
    const result=this.catgArrFilter.filter((res:any)=>{
      if(res.grntypeid ==this.form.controls['Category'].value){
        this.CategoryName= res.grntype
      }
    })
      this.getItem()
    }
  }
  ItemArrFilt: any[] = new Array()
  ItemArr: any[] = new Array()
  getItem() {
    // let Rawmatname = this.ItemFilter.value
    const sub = this.service.Item(this.form.controls['Category'].value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.ItemArr = res
          this.ItemArrFilt = res
        }
      }
    })
    this.subscriptions.add(sub)
  }
  dataSource = new MatTableDataSource<any>()
  ViewItem: any[] = new Array()
  View() {
    let startDt = this.form.controls['frmdate'].value
    let endDt = this.form.controls['todate'].value
    let grnTypeId = this.form.controls['Category'].value
    let RawmatName = this.form.controls['Item'].value
    const sub = this.service.View(startDt, endDt, this.LocationId, grnTypeId, RawmatName).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.openDialog()
          }
          this.ViewItem = res
          this.ViewItem =this.ViewItem .map((element:any)=> ({
            ...element,
            closing:((Number(element.OP)+Number(element.rec))-(Number(element.is)) - Number(element.rejection)),
            Val1:Number(element.OP+element.rec),
            Val2:Number(element.is - element.rejection),
            value:(element.closing) * (element.grate),
          }));
          console.log( this.ViewItem);
          
          this.dataSource.data = [...this.ViewItem]
        }else{
          this.Error='No Records Founded <br> Category: <strong style="color:brown"> '+this.CategoryName+' </strong> </br>  Item: <strong style="color:brown"> '+RawmatName+' </strong>'
          this.userHeader='Information'
          return this.openDialog()
        }
      }
    })
    this.subscriptions.add(sub)
  }
  search(e: any) {
    let searchValue = e.target.value
    if (searchValue) {
      this.dataSource.filter = searchValue.trim().toLowerCase()
      this.dataSource.data = [... this.dataSource.data];
    } else {
      searchValue = ''
    }
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
    this.subscriptions.unsubscribe()
  }


}
