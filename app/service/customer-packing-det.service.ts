import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerPackingDetService {

  constructor(private http: HttpClient) { }

  load() {
    return this.http.get(environment.Api + '/Purchase/Master/packdetload')
  }
  load1() {
    return this.http.get(environment.Api + '/Purchase/Master/packdetload1')
  }
  cust(custid: any, locationid: any) {
    return this.http.get(environment.Api + ('/Purchase/Master/packdetcust?custid=' + custid + '&locationid=' + locationid + ''))
  }
  castingw(rawmatid: any, locationid: any) {
    return this.http.get(environment.Api + ('/Purchase/Master/packdetcasting?rawmatid=' + rawmatid + '&locationid=' + locationid + ''))
  }
  maxid(custid: any, matlid: any) {
    return this.http.get(environment.Api + ('/Purchase/Master/packdetmaxid?custid=' + custid + '&matlid=' + matlid + ''))
  }
  table(custid: any, matlid: any, tranid: any) {
    return this.http.get(environment.Api + ('/Purchase/Master/packedttable?custid=' + custid + '&prodid=' + matlid + '&tranid=' + tranid + ''))
  }
  save(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/packdetsave', data)
  }
}
