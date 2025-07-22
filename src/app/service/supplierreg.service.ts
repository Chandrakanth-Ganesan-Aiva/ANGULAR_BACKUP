import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupplierregService {

  constructor(private http: HttpClient) { }
  organisation() {
    return this.http.get(environment.Api + '/Purchase/Master/supregorg')
  }
  country() {
    return this.http.get(environment.Api + '/Purchase/Master/supregcountry')
  }
  currency() {
    return this.http.get(environment.Api + '/Purchase/Master/supregcurrency')
  }
  ledger() {
    return this.http.get(environment.Api + '/Purchase/Master/supregledgergroup')
  }
  party() {
    return this.http.get(environment.Api + '/Purchase/Master/supregcode')
  }
  supplier() {
    return this.http.get(environment.Api + '/Purchase/Master/supregsup')
  }
  subcontractor() {
    return this.http.get(environment.Api + '/Purchase/Master/supregsub')
  }
  customer() {
    return this.http.get(environment.Api + '/Purchase/Master/supregcust')
  }
  fetchstateid(countryid: any) {
    return this.http.get(environment.Api + '/Purchase/Master/supregctry?countryid=' + countryid)
  }
  fetchareaid(stateid: any) {
    return this.http.get(environment.Api + '/Purchase/Master/supregarea?stateid=' + stateid)
  }
  newOrg(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/supregorgsave', data)
  }
  partyname(partyname: any) {
    return this.http.get(environment.Api + '/Purchase/Master/supregpatyname?partyname=' + partyname)
  }
  // save(data: any) {
  //   return this.http.post(environment.Api + '/Purchase/Master/supregsave', data)
  // }
}
