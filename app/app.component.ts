import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { LogoutService } from './service/logout.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreIssueService } from './service/store-issue.service';
import { LoginService } from './service/login.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setToken } from './NgrxStore/auth.action';
import { DialogCompComponent } from './dialog-comp/dialog-comp.component';
import { KeyCode } from '@ng-select/ng-select/lib/ng-select.types';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('sidenavState', [
      state('open', style({ width: '250px' })),
      state('closed', style({ width: '0' })),
      transition('open <=> closed', animate('300ms ease-in-out')),
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  routeMap: Record<number, string> = {
    203: 'grnEntry',
    212: 'grnwithoutbillentry',
    234: 'IndentEntry',
    374: 'PurchaseReq',
    242: 'issueReq',
    143: 'directIndent',
    166: 'storeissue',
    396: 'reworkissue',
    282: 'MatlReceiveFrmDept',
    471: 'StorageQtyAlloc',
    440: 'Shelflife',
    472: 'StoretoStore',
    201: 'GrnDelete',
    539: 'WeighRejReq',
    191: 'GateEntryDelay',
    538: 'WeighprintDailmr',
    285: 'minmaxEntry',
    378: 'QtyDellaco',
    246: 'itemMasterAppr',
    380: 'QcReq',
    441: 'shelflifeRecertificate',
    322: 'packweight',
    111: 'customerreturn',
    192: 'GateEntryDelayAppr',
    245: 'itemmaster',
    202: 'GrnDeleteReq',
    208: 'grnSubmitToAcc',
    568: 'grnprint',
    467: 'stockreport',
    349: 'POClose1',
    350: 'poclose2',
    563: 'poclose3',
    76: 'clearingFrechargesApprovals',
    93: 'creditdaysApprovals',
    231: 'IndentApprovalPending',
    488: 'SupplierRegAppApurchase',
    487: 'SupplierRegAppFin',
    489: 'SupplierRegAppTec',
    333: 'PaymentTerms',
    155: 'MailNumberUpdate',
    108: 'customerPackDet',
    494: 'suppliergst',
    495: 'supplierreg'
  };

  title = 'Commercial';
  locationId: number = 0;
  empId: number = 0;
  storeIssueId: number = 460;
  token: string = '';
  sessionTimeoutHandled: boolean = false; // Flag to track if session timeout logic has been executed
  timeoutSubscription: any; // Store the subscription to the idle timeout

  constructor(
    private logoutService: LogoutService,
    private loginService: LoginService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private storeIssueService: StoreIssueService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private date: DatePipe,
  ) { }
  LocationId: number = 0
  Empid: number = 0
  UserName: string = ''// Change this to any name

  ngOnInit() {

    const Location = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = Location[Location.length - 1]
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.UserName = Data.cusername;
    this.Empid = Data.empid
    this.getMenu()

    // let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    // this.UserName = Data.cusername;
    this.initializeSessionData();
    this.setupIdleTimeout();
    this.updateStoreIssueLogout();
    this.dispatchTokenToStore();
  }
  ngOnDestroy(): void {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe(); // Unsubscribe to avoid subsequent timeouts
    }
    this.logoutService.stopTimer();
    this.dialog.closeAll();
  }

  private initializeSessionData(): void {
    const locationData = sessionStorage.getItem('location');
    if (locationData) {
      const data = JSON.parse(locationData);
      this.locationId = data[data.length - 1];
    }

    const sessionData = sessionStorage.getItem('session');
    if (sessionData) {
      const user = JSON.parse(sessionData);
      this.empId = user.empid;
    }
  }
  private setupIdleTimeout(): void {
    const idleTimeoutInSeconds = 500;  // 5 minutes Set to the number of seconds you want for idle timeout
    this.timeoutSubscription = this.logoutService.startWatching(idleTimeoutInSeconds).subscribe({
      next: (isTimeout: boolean) => {
        if (isTimeout && !this.sessionTimeoutHandled) {
          this.sessionTimeoutHandled = true;
          let logincheck = JSON.parse(sessionStorage.getItem('islogIn') || '{}');
          if (logincheck == true) {
            this.Logout(); // Call handleLogout for the first timeout
          }
          if (this.timeoutSubscription) {
            this.timeoutSubscription.unsubscribe();
          }
        }
      },
      error: (err) => console.error('Error in idle timeout:', err),
    });
  }

  updateStoreIssueLogout(): void {
    this.storeIssueId = 166;
    const lockScreenData = {
      LocationId: this.locationId,
      EmpId: this.empId,
      ModuleId: this.storeIssueId,
      Loginsystem: 'Tab-Entry',
    };

    // this.storeIssueService.Updatelogoutime(lockScreenData).subscribe({
    //   next: (res: any) => {
    //     res
    //   },
    //   error: (err) => {
    //     this.Error = err.message
    //     this.userHeader = 'Error'
    //     this.opendialog()
    //     return
    //   }
    // });
  }

  private dispatchTokenToStore(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.store.dispatch(setToken({ token }));
    }
  }

  // -------------------------------------------------------DASHBOARD---------------------------------------------------------------------
  showMoreOptions = false;

  toggleMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }
  openReports() {
    window.open("http://dataserver:1436/Reports/Pages/Folder.aspx", "_blank");
  }
  menus: any[] = new Array()
  showsubMenu: boolean = false;
  showSubTitles: boolean = false;
  selectedMainMenuTitle: any;
  Mainid: any
  getMenu() {
    this.menus = [{ 'Name': 'Finance', "MainId": 1, icon: 'account_balance', }, { 'Name': 'Inventory', "MainId": 2, icon: 'local_grocery_store', }, { 'Name': 'Purcahse', "MainId": 3, icon: 'local_parking', },
    { 'Name': 'Sales', "MainId": 4, icon: 'local_grocery_store', }, { 'Name': 'Home', "MainId": 6, icon: 'home', }, { 'Name': 'Admin', "MainId": 7, icon: 'lock', }]
    console.log(this.menus);
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    console.log(sessionStorage);
    if (sessionStorage.length > 0) {
      this.loginService.AdminAcess(Data.empid).subscribe({
        next: (res: any) => {
          if (res.length) {
            if (res[0].status === 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            let Adminaccess = res[0].admin_access
            if (Adminaccess != 'Y') {
              this.menus = this.menus.filter(menu => menu.Name !== 'Admin');
              console.log(this.menus, 'aseadas');

            }
          }
        }
      })
    }

  }
  subTitle: any[] = new Array()
  MainMenuId: number = 0
  lastMenu: any
  toggleSubTitles(menu: any) {
    this.lastMenu = menu
    if (menu.MainId == 6) {
      this.router.navigate(['/Dashboard'], {});
      this.isSidenavOpen = this.isSidenavOpen ? false : true
      return
    }
    if (menu.MainId == 7) {
      this.router.navigate(['/admin'], {});
      this.isSidenavOpen = this.isSidenavOpen ? false : true
      return
    }
    if (this.selectedMainMenuTitle === menu.Name) {
      this.selectedMainMenuTitle = null;
      this.subTitle = [];
      return;
    }
    this.Mainid = menu.MainId;
    this.selectedMainMenuTitle = menu.Name;
    this.loginService.MenuList(this.Mainid).subscribe((res: any) => {
      if (res.length > 0) {
        if (res[0].status === 'N') {
          this.Error = res[0].Msg;
          this.userHeader = 'Error';
          return this.opendialog();
        }
        console.log(res)
        this.subTitle = res;
      }
    });
  }
  getArrowIcon(menu: any): string {
    return this.selectedMainMenuTitle === menu.Name ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }
  SubMenuArr: any[] = new Array()
  Subtitle: string = ''
  originalSubMenuArr: any[] = new Array()
  // navigateToSubContainer(subtitle: any) {

  //   this.Subtitle = subtitle.MainMenuName
  //   this.MainMenuId = subtitle.MainMenuId

  //   this.cdr.detectChanges();
  //   const mainContainer = document.getElementById('main-container');
  //   const subContainer = document.getElementById('sub-container');

  //   if (mainContainer && subContainer) {
  //     mainContainer.style.animation = 'mainAway 0.3s forwards';
  //     subContainer.style.display = 'block';
  //     subContainer.style.animation = 'subBack 0.3s forwards';
  //     setTimeout(() => {
  //       if (mainContainer) {
  //         mainContainer.style.display = 'none';
  //       }
  //     }, 300);

  //     this.loginService.RighitsCheck(this.Empid, this.LocationId).subscribe({
  //       next: (data: any) => {
  //         if (data.length > 0) {
  //           if (data[0].status === 'N') {
  //             this.Error = data[0].Msg;
  //             this.userHeader = 'Error';
  //             this.opendialog();
  //           }
  //           this.loginService.SubMenuList(this.MainMenuId, this.Mainid).subscribe({
  //             next: (res: any) => {
  //               if (res.length > 0) {
  //                 if (res[0].status === 'N') {
  //                   this.Error = res[0].Msg;
  //                   this.userHeader = 'Error';
  //                   return this.opendialog();
  //                 }
  //                 this.SubMenuArr = res
  //                 this.originalSubMenuArr = res
  //                 this.MenuRights = data
  //                 this.SubMenuArr = this.SubMenuArr.filter((item: any) =>
  //                   this.MenuRights.some((element) => element.Menuid === item.SubMenuId && element.Status === 'Y')
  //                 );
  //                 console.log(this.SubMenuArr);
  //                 this.matchedSubmenu = this.SubMenuArr
  //                 this.SubMenuArr.forEach((res: any) => {
  //                   if (this.routeMap[res.SubMenuId]) {
  //                     res.route = this.routeMap[res.SubMenuId];
  //                     console.log(res.route);
  //                   }
  //                 });
  //                 this.SubMenuArr = structuredClone(this.SubMenuArr)
  //                 this.originalSubMenuArr = structuredClone(this.SubMenuArr)
  //               }
  //             }
  //           })
  //         } else {
  //           this.SubMenuArr = []
  //         }
  //       }
  //     })
  //   }
  // }
  navigateToSubContainer(subtitle: any): void {
    this.Subtitle = subtitle.MainMenuName;
    this.MainMenuId = subtitle.MainMenuId;

    this.animateTransition();

    this.loginService.RighitsCheck(this.Empid, this.LocationId).pipe(
      switchMap((rightsData: any[]) => {
        if (rightsData.length === 0 || rightsData[0].status === 'N') {
          // this.displayError(rightsData[0]?.Msg || 'Access denied.');
          return of([]);
        }
        this.MenuRights = rightsData;
        return this.loginService.SubMenuList(this.MainMenuId, this.Mainid);
      })
    ).subscribe({
      next: (subMenuData: any[]) => {
        if (subMenuData.length === 0 || subMenuData[0].status === 'N') {
          // this.displayError(subMenuData[0]?.Msg || 'Menu Rights Not Available.');
          return;
        }

        this.SubMenuArr = subMenuData.filter((item: any) =>
          this.MenuRights.some((right: any) => right.Menuid === item.SubMenuId && right.Status === 'Y')
        );

        this.assignRoutesToSubMenus();
        this.cloneSubMenuArrays();
      },
      error: (err) => {
        this.displayError('An error occurred while fetching submenu data.');
        console.error(err);
      }
    });
  }

  private animateTransition(): void {
    const mainContainer = document.getElementById('main-container');
    const subContainer = document.getElementById('sub-container');

    if (mainContainer && subContainer) {
      mainContainer.style.animation = 'mainAway 0.3s forwards';
      subContainer.style.display = 'block';
      subContainer.style.animation = 'subBack 0.3s forwards';

      setTimeout(() => {
        if (mainContainer) {
          mainContainer.style.display = 'none';
        }
      }, 300);
    }
  }
  private assignRoutesToSubMenus(): void {
    this.SubMenuArr.forEach((item: any) => {
      if (this.routeMap[item.SubMenuId]) {
        item.route = this.routeMap[item.SubMenuId];
      }
    });
  }
  private cloneSubMenuArrays(): void {
    this.SubMenuArr = structuredClone(this.SubMenuArr);
    this.originalSubMenuArr = structuredClone(this.SubMenuArr);
  }
  private displayError(message: string): void {
    this.Error = message;
    this.userHeader = 'Error';
    this.opendialog();
  }
  @Input() isSidenavOpen: boolean = false;
  sidenavClass = 'lg';
  isSmallScreen: boolean = false;
  MenuRights: any[] = new Array()
  matchedSubmenu: any[] = new Array()
  getUserRights() {
    this.loginService.RighitsCheck(this.Empid, this.LocationId).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status === 'N') {
            this.Error = data[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
          }

          this.MenuRights = data
          this.SubMenuArr = this.SubMenuArr.filter((item: any) =>
            this.MenuRights.some((element) => element.Menuid === item.SubMenuId && element.Status === 'Y')
          );
          console.log(this.SubMenuArr);
          this.matchedSubmenu = this.SubMenuArr
          this.SubMenuArr.forEach((res: any) => {
            if (this.routeMap[res.SubMenuId]) {
              res.route = this.routeMap[res.SubMenuId];
              console.log(res.route);

            }
          });

          this.SubMenuArr = structuredClone(this.SubMenuArr)
          this.originalSubMenuArr = structuredClone(this.SubMenuArr)
        } else {
          this.SubMenuArr = []
        }
      }
    })
  }
  SearchEvent(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.SubMenuArr = this.originalSubMenuArr.filter(subMenu =>
      subMenu.SubMenuName.toLowerCase().startsWith(searchTerm)
    );
  }

  navigateToMainContainer() {
    const mainContainer = document.getElementById('main-container');
    const subContainer = document.getElementById('sub-container');
    if (mainContainer && subContainer) {
      subContainer.style.animation = 'subPush 0.3s forwards';
      mainContainer.style.display = 'block';
      mainContainer.style.animation = 'mainBack 0.3s forwards';
      setTimeout(() => {
        subContainer.style.display = 'none';
      });
    }
  }

  toggleSidenav() {
    this.isSidenavOpen = this.isSidenavOpen ? false : true
  }
  InputEvent(event: any) {
    if (event.target.value == 'home') {
      this.router.navigate(['/Dashboard'], {});
      this.isSidenavOpen = false
      event.target.value = ''
      return
    }
    if (event.target.value == 'open') {
      this.isSidenavOpen = true
      event.target.value = ''
      return
    }
    if (event.target.value == 'admin') {
      this.router.navigate(['/admin'], {});
      this.isSidenavOpen = false
      event.target.value = ''
      return
    }
    if (event.target.value == 'close') {
      this.isSidenavOpen = false
      event.target.value = ''
      return
    }
    this.loginService.RighitsCheck(this.Empid, this.LocationId).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status === 'N') {
            this.Error = data[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
          }
        }
        this.MenuRights = data
        const menuIds = this.MenuRights
          .filter(element => element.Status == 'Y')
          .map(element => element.Menuid);
        let hasAccess = menuIds.includes(Number(event.target.value));
        if (event.keyCode == 13) {
          if (hasAccess) {
            this.SubMenuArr = this.SubMenuArr.filter((item: any) =>
              this.MenuRights.some((element) => element.Menuid === item.SubMenuId && element.Status === 'Y')
            )
            console.log(this.SubMenuArr);
            let matchedSubMenu = this.SubMenuArr.find(res => res.SubMenuId == Number(event.target.value));
            if (matchedSubMenu) {
              matchedSubMenu.route = this.routeMap[matchedSubMenu.SubMenuId];
              if (!matchedSubMenu.route) {
                console.log(this.SubMenuArr)

                this.SubMenuArr = this.matchedSubmenu.filter((item: any) =>
                  this.MenuRights.some((element) => element.Menuid === item.SubMenuId && element.Status === 'Y')
                );
                event.target.value = ''
                this.Error = 'Route Path Mismatch Or Undefined'
                this.userHeader = 'Warning!!'
                return this.opendialog()
              } else {
                console.log('Opening Route:', matchedSubMenu.route);
                this.router.navigate(['/', matchedSubMenu.route]);
                event.target.value = ''
                this.isSidenavOpen = false
              }
            } else {
              this.Error = 'Type Match MenuId'
              this.userHeader = 'Warning!!'
              this.opendialog()
            }




          } else {
            event.target.value = ''
            this.Error = 'You Dont have Rights To View '
            this.userHeader = 'Warning!!'
            return this.opendialog()
          }
        } else {
          return
        }
      }
    })
  }
  Toolbar: boolean = false
  Logout() {
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    let updatelist = []
    updatelist.push({
      EmpId: Data.empid,
    })
    this.loginService.UpdateUserDet(updatelist).subscribe({
      next: (data: any) => {
        if (data.length >= 1) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.UserName = ''
          this.Toolbar = true
          this.toastr.success('Logout Successfully');
          sessionStorage.clear();
          localStorage.clear();
          this.dialog.closeAll();
          this.router.navigate(['/login']);
          // window.location.href = '/login';
        }
      }
    })
  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }
  //  Browser Close  
  //   @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event) {
  //   let updatelist:any = [];
  //   updatelist.push({
  //     EmpId: this.empId,
  //   });
  //   this.loginService.UpdateUserDet(updatelist).subscribe({
  //     next: (data: any) => {
  //       if (data.length >= 1) {
  //         if (data[0].status == 'N') {
  //           this.Error = data[0].Msg;
  //           this.userHeader = 'Error';
  //           this.opendialog();
  //           return;
  //         }
  //         this.UserName = ''
  //         this.Toolbar = true
  //         this.toastr.warning('Session Timeout Logout');
  //         sessionStorage.clear();
  //         localStorage.clear();
  //         this.dialog.closeAll();
  //         this.router.navigate(['/login']);
  //         localStorage.setItem('logoutdata', updatelist);
  //         // window.location.href = '/login';
  //       }
  //     },
  //   });
  //   alert(2)
  //   // Perform any cleanup tasks or API calls here
  // let date:any= this.date.transform(new Date ,'yyyy-MM-dd hh:mm:ss')
  //   localStorage.setItem('lastSession', date);
  // }
}


