import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class IndentEntryService {

  constructor(private http: HttpClient) { }


  Stockreno(trandate: any, locid: any) {
    return this.http.get(environment.Api + '/Inventory/DirectIndentpath?trandate=' + trandate + '&locid=' + locid)
  }
  Department(locationid: any, Frmdate: any, Todate: any) {
    return this.http.get(environment.Api + '/Inventory/IndentEntryDept?LocationID=' + locationid + '&Frmdate=' + Frmdate + '&Todate=' + Todate)
  }
  Category(locationid: any, Empid: any) {
    return this.http.get(environment.Api + '/Inventory/Department?locationid=' + locationid + '&empid=' + Empid)
  }
  CostCenter() {
    return this.http.get(environment.Api + '/Inventory/CostCenter')
  }
  Approvedby(LocationId: any, DeptId: any) {
    return this.http.get(environment.Api + '/Inventory/Approvedby?LocationId=' + LocationId + '&DeptId=' + DeptId)
  }
  Capex(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Capex?LocationId=' + LocationId)
  }
  StoreRelaseEmp(locid: any, Deptid: any, Catid: any) {
    return this.http.get(environment.Api + '/Inventory/IndentEntryStoreReleaseEmp?locid=' + locid + '&Deptid=' + Deptid + '&Catid=' + Catid)
  }
  ResponsableEmp() {
    return this.http.get(environment.Api + '/Inventory/IndentResponsableEmp')
  }
  
  StoreMatl(locid: any, Deptid: any) {
    return this.http.get(environment.Api + '/Inventory/IndentEntryStoreReleaseRawmaterial?locid=' + locid + '&Deptid=' + Deptid)
  }

  View(locid: any, Deptid: any, SrType: any, Empid: any, Rawmatid: any, FrmDate: any, ToDate: any){
    return this.http.get(environment.Api + '/Inventory/IndentEntryStoreReleaseView?locid=' + locid + '&Deptid=' + Deptid + '&SrType=' + SrType +
      '&Empid=' + Empid + '&Rawmatid=' + Rawmatid + '&FrmDate=' + FrmDate + '&ToDate=' + ToDate)
  }

  PoPending(locid: any, Rawmatid: any,Type:any) {
    return this.http.get(environment.Api + '/Inventory/IndentPoPendingQty?locid=' + locid + '&Rawmatid=' + Rawmatid + '&Type=' + Type)
  }

  IndentEntry_OldPo(Rawmatid: any, locid: any) {
    return this.http.get(environment.Api + '/Inventory/IndentEntry_OldPo?Rawamtid=' + Rawmatid + '&locid=' + locid)
  }

  Save(IndentSave: any) {
    return this.http.post(environment.Api + '/Inventory/Post_IndentEntry', IndentSave)
  }
}
