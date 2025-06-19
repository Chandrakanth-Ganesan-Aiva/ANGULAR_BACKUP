import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginService } from './service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private authService:LoginService) {}

  canActivate(): boolean {
    if (sessionStorage.getItem("islogIn") == "true") {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
//   const isLoggedIn = sessionStorage.getItem("islogIn") === "true";
//   if (!isLoggedIn) {
//     return of(this.router.createUrlTree(['/login']));
//   }

//   const empId = sessionStorage.getItem('Empid');
//   const locationId = sessionStorage.getItem('Locationid');
//   const routeMenuId = route.data['menuId'];

//   if (!empId || !locationId) {
//     return of(this.router.createUrlTree(['/unauthorized']));
//   }

//   return this.authService.RighitsCheck(empId, locationId).pipe(
//     map((menuIds: number[]) => {
//       if (menuIds.includes(routeMenuId)) {
//         return true;
//       } else {
//         return this.router.createUrlTree(['/unauthorized']);
//       }
//     }),
//     catchError(() => of(this.router.createUrlTree(['/unauthorized'])))
//   );
// }

}
