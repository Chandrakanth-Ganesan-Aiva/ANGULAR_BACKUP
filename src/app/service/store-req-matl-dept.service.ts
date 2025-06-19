import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StoreReqMatlDeptService {

  constructor(private http: HttpClient) { }
  Machine(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Machinename?LocationId=' + LocationId)
  }

  Warehouse(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Warehouse?LocationId=' + LocationId)
  }

  Material(rawmatname: any) {
    return this.http.get(environment.Api + '/Inventory/RawMaterial-StoreReqmatlDet?rawmatname=' + rawmatname)
  }

  StoreLoaction(LoactionId: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/StoreLoactionCheck?LoactionId=' + LoactionId + '&Rawmatid=' + Rawmatid)
  }
  StoreReqMatlDet(LocationId: any, RawMatid: any, frm_module: any, Indenttype: any, EmpId: any) {
    return this.http.get(environment.Api + '/Inventory/StoreReqMatlDet?LocationId=' + LocationId + '&RawMatid=' + RawMatid + '&frm_module=' + frm_module +
      '&Indenttype=' + Indenttype + '&EmpId=' + EmpId)
  }
  MatlPrevIssueRec(LocationId: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/MatlPrevIssueRec?LocationId=' + LocationId + '&Rawmatid=' + Rawmatid)
  }
  IntendPendingView(LocationId: any, RawMatID: any) {
    return this.http.get(environment.Api + '/Inventory/IndentPendingViewDet?LocationId=' + LocationId + '&RawMatID=' + RawMatID)
  }
  IssueReq_machine(locid: any) {
    return this.http.get(environment.Api + '/Inventory/IssueReq_machine?locid=' + locid)
  }
}
