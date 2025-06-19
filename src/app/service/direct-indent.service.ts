import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class DirectIndentService {

  constructor(private http: HttpClient) {
  }

  Stockreno(trandate: any, locid: any) {
    return this.http.get(environment.Api + '/Inventory/DirectIndentpath?trandate=' + trandate + '&locid=' + locid)
  }
  Department(locationid: any, Empid: any) {
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
  ResponsableEmp() {
    return this.http.get(environment.Api + '/Inventory/IndentResponsableEmp')
  }
  RawMat(Rawmatname: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/RawMaterial?Rawmatname=' + Rawmatname + '&Rawmatid=' + Rawmatid)
  }

  StockAvl(FrmModule: any, IndentType: any, Issuelocationwise: any, MaterialId: any, LoactionId: any, EmpId: any, Issuelocid: any) {
    return this.http.get(environment.Api + '/Inventory/StockCheck?FrmModule=' + FrmModule + '&IndentType=' + IndentType + '&Issuelocationwise=' + Issuelocationwise + '&MaterialId=' + MaterialId + '&LoactionId=' + LoactionId + '&EmpId=' + EmpId + '&Issuelocid=' + Issuelocid)
  }
  IssueLocId(empid: any) {
    return this.http.get(environment.Api + '/Inventory/IssueLocid?empid=' + empid)
  }
  StoreLoaction(LoactionId: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/StoreLoaction?LoactionId=' + LoactionId + '&Rawmatid=' + Rawmatid)
  }
  Machine(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Machinename?LocationId=' + LocationId)
  }
  Warehouse(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Warehouse?LocationId=' + LocationId)
  }
  OldPOView(locid: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/OldPoView?locid=' + locid + '&Rawmatid=' + Rawmatid)
  }
  oldPo_Tot(Poid: any): Observable<any> {
    const url = environment.Api + `/Inventory/oldPo-Tot?Poid=${Poid}`
    return this.http.get<any>(url)
  }
  IntendPendingView(LocationId: any, RawMatID: any) {
    return this.http.get(environment.Api + '/Inventory/IndentPendingViewDet?LocationId=' + LocationId + '&RawMatID=' + RawMatID)
  }
  MatQtyPending(LocationId: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/MatQtypendingsts?LocationId=' + LocationId + '&Rawmatid=' + Rawmatid)
  }
  Save(DirectIndentSave: any) {
    return this.http.post(environment.Api + '/Inventory/Post_DirectIndent', DirectIndentSave)
  }
}

