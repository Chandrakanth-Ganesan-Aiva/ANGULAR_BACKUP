import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestService {

  constructor(private http: HttpClient) {

  }


  Department(locationid:any,Empid: any) {
    return this.http.get(environment.Api + '/Inventory/Department?locationid='+locationid+'&empid=' + Empid)
  }
  Company() {
    return this.http.get(environment.Api + '/Inventory/company')
  }
  CompName(CompanyId: any) {
    return this.http.get(environment.Api + '/Inventory/companyname?CompanyId=' + CompanyId)
  }
  Capex(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Capex?LocationId=' + LocationId)
  }
  CapexValidationDept(empid: any) {
    return this.http.get(environment.Api + '/Inventory/CapexDepartment?empid=' + empid)
  }
  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api + '/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  StockReNoValidation(StockReqNo: any) {
    return this.http.get(environment.Api + '/Inventory/StockReqNochck?StockReqNo=' + StockReqNo)
  }
  Rawmaterial(locationid: any, Rawmatname: any) {
    return this.http.get(environment.Api + '/Inventory/Get_RawMaterial?locationid=' + locationid + '&Rawmatname=' + Rawmatname)
  }
  
  IndentDet(LocationId: any, SRDate: any, RawMatId: any, DeptId: any) {
    return this.http.get(environment.Api + '/Inventory/StoreIndentDetl?LocationId=' + LocationId + '&SRDate=' + SRDate + '&RawMatId=' + RawMatId + '&DeptId=' + DeptId)
  }

  IssueLocId(empid: any) {
    return this.http.get(environment.Api + '/Inventory/IssueLocid?empid=' + empid)
  }
  StockAvl(FrmModule: any, IndentType: any, Issuelocationwise: any, MaterialId: any, LoactionId: any, EmpId: any, Issuelocid: any) {
    return this.http.get(environment.Api + '/Inventory/StockCheck?FrmModule=' + FrmModule + '&IndentType=' + IndentType + '&Issuelocationwise=' + Issuelocationwise + '&MaterialId=' + MaterialId + '&LoactionId=' + LoactionId + '&EmpId=' + EmpId + '&Issuelocid=' + Issuelocid)
  }
  Uom(RawMatId: any) {
    return this.http.get(environment.Api + '/Inventory/ProductUom?RawMatId=' + RawMatId)
  }

  OldPOView(locid: any, Rawmatid: any): Observable<any> {
    const url = environment.Api + `/Inventory/OldPoView?locid=${locid}&Rawmatid=${Rawmatid}`
    return this.http.get<any>(url)
  }
  oldPo_Tot(Poid: any): Observable<any> {
    const url = environment.Api + `/Inventory/oldPo-Tot?Poid=${Poid}`
    return this.http.get<any>(url)
  }
  Save(PurchaseReqSave: any) {
    return this.http.post(environment.Api + '/Inventory/Post_PurchaseReq', PurchaseReqSave)
  }
}
