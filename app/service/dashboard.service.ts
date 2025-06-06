import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }
  ListWarhouse(){
    return this.http.get(environment.Api+'/Inventory/DashWarehouse')
  }
  Category(){
    return this.http.get(environment.Api+'/Inventory/DashViewStockGrnCatg')
  }
  MatlData(LocationId:any,GrnTypeId:any){
    return this.http.get(environment.Api+'/Inventory/DashViewStockDet?LocationId='+LocationId+'&GrnTypeId='+GrnTypeId)
  }


}
