import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupplierregAppFinService {

  constructor(private http: HttpClient) { }

  load() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supRegAppFinload')
  }
  empid(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/suppregAppFinemp?empid=' + empid)
  }
  input(code: any) {
    return this.http.get(environment.Api + "/Purchase/Approvals/supregAppFininp?code=" + code)
  }
  currency(curr: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFincurrency?curr=' + curr)
  }
  partytype(CTypeId: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinpartyType?CTypeId=' + CTypeId)
  }
  pType() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinType')
  }
  ledgergrp() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinledgerGroup')
  }
  ledger(partygrp: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinledgerGrp?partygroup=' + partygrp)
  }
  approve(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregAppFinUp', data)
  }
  unapprove(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregAppFinUnappr', data)
  }
  ApproveCheck(partyid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinParty?partyid=' + partyid)
  }
  insertType(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/SupregFinInsertType', data)
  }
  unapproveCheck(partyid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinParty?partyid=' + partyid)
  }
  email(data: any) {
    const empid = data[0]?.empid;
    return this.http.post(
      `${environment.Api}/Purchase/Approvals/supregFinanceemail?empid=${empid}`,
      data
    );
  }
  currencyEdit() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinCurre')
  }
  editsave(data: any) {
    console.log(data, 'data');

    return this.http.post(environment.Api + '/Purchase/Approvals/supregFinEdit', data)
  }
  backup(data: any) {
    return this.http.post(environment.Api + "/Purchase/Approvals/supregAppFinBackup", data)
  }
}