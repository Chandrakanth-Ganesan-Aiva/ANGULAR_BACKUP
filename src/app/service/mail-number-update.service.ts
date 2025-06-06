import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MailNumberUpdateService {

  constructor(private http: HttpClient) { }

  suppinactY() {
    return this.http.get(environment.Api + '/Purchase/Master/mailphonesupp2')
  }
  suppinactN() {
    return this.http.get(environment.Api + '/Purchase/Master/mailphonesupp1')
  }
  suppinactSub() {
    return this.http.get(environment.Api + "/Purchase/Master/mailphonesubcon")
  }
  searchinactY(name: any) {
    return this.http.get(environment.Api + "/Purchase/Master/mailphonesearchsupp1?name=" + name)
  }
  searchinactN(name: any) {
    return this.http.get(environment.Api + '/Purchase/Master/mailphonesearchsupp?name=' + name)
  }
  searchsub(name: any) {
    return this.http.get(environment.Api + '/Purchase/Master/mailphonesearchsubcon?name=' + name)
  }
  update(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/mailphonesearchsave', data)
  }
}
