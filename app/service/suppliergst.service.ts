import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SuppliergstService {

  constructor(private http: HttpClient) { }
  supplier() {
    return this.http.get(environment.Api + '/Purchase/Master/supgstsupp')
  }
  supplier1(supid: any) {
    return this.http.get(environment.Api + '/Purchase/Master/supgstsupp1?supid=' + supid)
  }
  suppliertable() {
    return this.http.get(environment.Api + '/Purchase/Master/supgstsupptble')
  }
  subcontract() {
    return this.http.get(environment.Api + '/Purchase/Master/supgstsub')
  }
  subcontract1(supid: any) {
    return this.http.get(environment.Api + '/Purchase/Master/supgstsub1?supid=' + supid)
  }
  subcontracttable() {
    return this.http.get(environment.Api + '/Purchase/Master/supgstsubtble')
  }
  customer() {
    return this.http.get(environment.Api + '/Purchase/Master/supgstcust')
  }
  customer1(supid: any) {
    return this.http.get(environment.Api + '/Purchase/Master/supgstcust1?supid=' + supid)
  }
  customertable() {
    return this.http.get(environment.Api + '/Purchase/Master/supgstcustTable')
  }
  savesupp(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/supgstsavesupp', data)
  }
  savesubcon(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/supgstsavesub', data)
  }
  savecust(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/supgstsavecust', data)
  }
}
