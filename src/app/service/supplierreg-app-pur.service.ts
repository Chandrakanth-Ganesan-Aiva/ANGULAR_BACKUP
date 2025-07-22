import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupplierregAppPurService {

  constructor(private http: HttpClient) { }
  load(empid: any) {
    return this.http.get(environment.Api + "/Purchase/Approvals/suppregAppPurchaseload?empid=" + empid)
  }
  organisation() {
    return this.http.get(environment.Api + "/Purchase/Approvals/suppregAppPurchaseorganisation")
  }
  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/suppregAppPurchasetable')
  }
  input(code: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurchaseinp?code=' + code)
  }
  org(id: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurchaseorg?id=' + id)
  }
  approve(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregAppPurchase', data)
  }
  unapprove(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregAppPurchaseUnappr', data)
  }
  unapproveCheck(partyid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurParty?partyid=' + partyid)
  }
  ApproveCheck(partyid: any) {

    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurParty?partyid=' + partyid)
  }
  insertType(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/SupregPurInsertType', data)
  }
  email(data: any) {
    const empid = data[0]?.empid;
    return this.http.post(
      `${environment.Api}/Purchase/Approvals/supregPurchaseemail?empid=${empid}`,
      data
    );
  }
  country() {
    return this.http.get(environment.Api + '/Purchase/Approvals/SupregAppPurCountry')
  }
  stateid(countryid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurState?countryid=' + countryid)
  }
  area(stateid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurArea?stateid=' + stateid)
  }
  edit(data: any) {
    console.log(data);
    return this.http.post(environment.Api + '/Purchase/Approvals/SupregAppPurEdit', data)
  }
  backup(data: any) {
    return this.http.post(environment.Api + "/Purchase/Approvals/supregAppPurbackup", data)
  }
}