import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrnSubmitToAccountsService {

  constructor(private http:HttpClient) { }
  Unit(LocationId:any):Observable<any>{
    const url = environment.Api +`/Report/grnToAcc-Unit?LocationId=${LocationId}`
        return this.http.get<any>(url)
  }
  Id(LocationId:any):Observable<any>{
    const url = environment.Api +`/Report/grnToAcc-Id?LocationId=${LocationId}`
        return this.http.get<any>(url)
  }
  View(LocationId:any):Observable<any>{
    const url = environment.Api +`/Report/grnToAcc-View?LocationId=${LocationId}`
        return this.http.get<any>(url)
  }
  update(updateData: any[]):Observable<any> {
    return this.http.put(`${environment.Api}/Report/grnToAcc-Update`, updateData);
  }
  
}
