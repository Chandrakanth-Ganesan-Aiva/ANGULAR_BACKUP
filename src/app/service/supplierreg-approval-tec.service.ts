import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupplierregApprovalTecService {

  constructor(private http: HttpClient) { }
  empid(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregApptecemp?empid=' + empid)
  }
  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregApptectable')
  }
  input(code: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregApptecinp?code=' + code)
  }

  unapprove(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregAppTecUnappr', data)
  }
  ApproveCheck(partyid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppTecParty?partyid=' + partyid)
  }
  insertType(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/SupregTecInsertType', data)
  }
  approve(data: any) {
    console.log(data);

    return this.http.post(environment.Api + '/Purchase/Approvals/supregApptec', data)
  }
  unapproveCheck(partyid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppTecParty?partyid=' + partyid)
  }
  email(data: any) {
    const empid = data[0]?.empid;
    return this.http.post(
      `${environment.Api}/Purchase/Approvals/supregTechnicalemail?empid=${empid}`,
      data
    );
  }
  email2(data: any) {
    const empid = data[0]?.empid;
    return this.http.post(
      `${environment.Api}/Purchase/Approvals/supregTechnicalemail2?empid=${empid}`,
      data
    );
  }
  editsave(data: any) {
    return this.http.post(environment.Api + "/Purchase/Approvals/supregTecEdit", data)
  }
  backup(data:any){
    return this.http.post(environment.Api+"/Purchase/Approvals/supregAppTecbackup",data)
  }
}
