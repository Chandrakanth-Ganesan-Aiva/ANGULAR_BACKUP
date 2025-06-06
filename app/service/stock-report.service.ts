import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockReportService {

  constructor(private http: HttpClient) { }
  Category():Observable<any>{
    const url = environment.Api + `/Report/StkRep-Cat`
    return this.http.get<any>(url)
  }

  Unit():Observable<any> {
    const url = environment.Api + `/Report/StkRep-unit`
    return this.http.get<any>(url)
  }

  Item(grntypeid:any,):Observable<any> {
    const url = environment.Api + `/Report/StkRep-Item?grntypeid=${grntypeid}`
    return this.http.get<any>(url)
  }

  View(startDate:any,endDate:any,LocationId:any,GrntypeId:any,Itemid:any):Observable<any> {
    const url = environment.Api + `/Report/StkRep-View?startDate=${startDate}&endDate=${endDate}&LocationId=${LocationId}&GrntypeId=${GrntypeId}&Itemid=${Itemid}`
    return this.http.get<any>(url)
  }

  View_Dept(LocationId:any,Rawmatid:any):Observable<any> {
    const url = environment.Api + `/Report/StkRep-Viewdept?LocationId=${LocationId}&Rawmatid=${Rawmatid}`
    return this.http.get<any>(url)
  }

  View_ViewMinMax(Rawmatid:any):Observable<any> {
    const url = environment.Api + `/Report/StkRep-ViewMinMax?Rawmatid=${Rawmatid}`
    return this.http.get<any>(url)
  }

  Viewloc_nname(LocationId:any,Rawmatid:any):Observable<any> {
    const url = environment.Api + `/Report/StkRep-Viewloc_nname?LocationId=${LocationId}&Rawmatid=${Rawmatid}`
    return this.http.get<any>(url)
  }
}
