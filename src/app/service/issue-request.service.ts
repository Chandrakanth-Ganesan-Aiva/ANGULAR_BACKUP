import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class IssueRequestService {

  constructor(private http: HttpClient) { }

  Department(locationid: any, Empid: any) {
    return this.http.get(environment.Api + '/Inventory/Department?locationid=' + locationid + '&empid=' + Empid)
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
  save(IssueReqSave: any) {
    return this.http.post(environment.Api + '/Inventory/Post_IssueReq', IssueReqSave)
  }
}
