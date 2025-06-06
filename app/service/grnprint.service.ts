import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrnprintService {

  constructor(private http: HttpClient) { }
  Unit():Observable<any> {
    const url = environment.Api + `/Report/grnPrint-Unit`
    return this.http.get<any>(url)
  }
  Supplier():Observable<any> {
    const url = environment.Api + `/Report/grnPrint-Supplier`
    return this.http.get<any>(url)
  }
  View(LocationId: any, StartDate: any, EndDate: any, SupId: any):Observable<any> {
    const url = environment.Api + `/Report/grnPrint-View?LocationId=${LocationId}&StartDate=${StartDate}&EndDate=${EndDate}&SupId=${SupId}`
    return this.http.get<any>(url)
  }
  Print(grnRefNo: any):Observable<any> {
    const url = environment.Api + `/Report/grnPrint-Print?grnRefNo=${grnRefNo}`
    return this.http.get<any>(url)
  }
}
