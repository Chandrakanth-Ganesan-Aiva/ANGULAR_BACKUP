import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ItemmasterService {

  constructor(private http:HttpClient) { }

  itemCat(LocationId:any):Observable<any>{
    const url=environment.Api + `/Master/itemMasCategory?LocationId=${LocationId}`
    return this.http.get<any>(url)
  }
  itemDept(LocationId:any):Observable<any>{
    const url=environment.Api +`/Master/itemMasDept?LocationId=${LocationId}`
    return this.http.get<any>(url)
  }
  itemUom():Observable<any>{
    const url=environment.Api +`/Master/itemMasUom`
    return this.http.get<any>(url)
  }
  itemHsncode():Observable<any>{
    const url=environment.Api +`/Master/itemMashsncode`
    return this.http.get<any>(url)
  }
  itemgrade():Observable<any>{
    const url=environment.Api +`/Master/itemMasgrade`
    return this.http.get<any>(url)
  }
  itemRawLoc():Observable<any>{
    const url=environment.Api +`/Master/itemMasRawLoc`
    return this.http.get<any>(url)
  }
  itemRawMaterial(Rawmatname:any):Observable<any>{
    const url=environment.Api +`/Master/itemMasRawmaterial?Rawmatname=${Rawmatname}`
    return this.http.get<any>(url)
  }
  itemItemMaster(Rawmatname:any):Observable<any>{
    const url=environment.Api +`/Master/itemMasItemMaster?Rawmatname=${Rawmatname}`
    return this.http.get<any>(url)
  }
  // itemMas-ExistingItemCheck
  exisitingItemCheck(Rawmatname:any):Observable<any>{
    const url=environment.Api +`/Master/itemMas-ExistingItemCheck?Rawmatname=${Rawmatname}`
    return this.http.get<any>(url)
  }
}
