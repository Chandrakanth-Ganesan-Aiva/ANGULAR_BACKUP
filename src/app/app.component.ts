import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { LogoutService } from './service/logout.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { Observable, of } from 'rxjs';
import { switchMap, map, debounceTime, filter, mergeMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

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
  title = 'Commercial';
  locationId: number = 0;
  empId: number = 0;
  token: string = '';
  sessionTimeoutHandled: boolean = false; // Flag to track if session timeout logic has been executed
  timeoutSubscription: any; // Store the subscription to the idle timeout

  constructor(
    private logoutService: LogoutService,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private storeIssueService: StoreIssueService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.showNavbar = !data['hideNavbar'];
      console.log(this.showNavbar);

    });
  }
  LocationId: number = 0
  Empid: number = 0
  UserName: string = ''// Change this to any name
  isLogin: boolean = false
  showNavbar = true;
  ngOnInit() {
    this.LocationId = JSON.parse(sessionStorage.getItem('location') || '{}')
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.UserName = Data.cusername;
    this.Empid = Data.empid
    this.isLogin = Boolean(JSON.parse(sessionStorage.getItem('islogIn') || 'false'))

    this.getMenu()
    this.initializeSessionData();
    this.setupIdleTimeout();
    //  Load all the Menu in Navigation Search Bar
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.fetchSubMenus(value || ''))
      )
      .subscribe((data: any[]) => {
        this.filteredOptions = data;
      });
    // Router
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.getDeepestChild(this.activatedRoute);
        route.data.subscribe(data => {
          this.currentMenuId = data['menuId'] ?? null;
        });
      });
  }
  //  Load all the Menu in Navigation Search Bar
  searchControl = new FormControl('');
  filteredOptions: any[] = [];
  fetchSubMenus(value: any): Observable<any> {
    if (!value || value.trim() === '') {
      return of(null);
    }
    return this.loginService.SubMenuInput(value).pipe(
      map((response: any[]) =>
        response.filter(item =>
          item.SubMenuName.toLowerCase().includes(value.toLowerCase())
        )
      )
    );
  }
  currentMenuId: number = 0
  getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
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
    const idleTimeoutInSeconds = 300;  // 5 minutes Set to the number of seconds you want for idle timeout
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

  // -------------------Animation start-----------------------
  getArrowIcon(menu: any): string {
    return this.selectedMainMenuTitle === menu.Name ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
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

  //-----------------Display the Menu Rigts Record in  SideNavbar------------------
  Subtitle: string = ''
  navigateToSubContainer(subtitle: any): void {
    this.Subtitle = subtitle.MainMenuName;
    this.MainMenuId = subtitle.MainMenuId;
    this.animateTransition();
    this.loginService.RighitsCheck(this.Empid, this.LocationId).pipe(
      switchMap((rightsData: any[]) => {
        if (rightsData.length === 0 || rightsData[0].status === 'N') {
          return of([]);
        }
        this.MenuRights = rightsData;
        return this.loginService.SubMenuList(this.MainMenuId, this.Mainid);
      })
    ).subscribe({
      next: (subMenuData: any[]) => {
        if (subMenuData.length === 0 || subMenuData[0].status === 'N') {
          return;
        }
        this.MenuRights = subMenuData.filter((item: any) =>
          this.MenuRights.some((right: any) => right.Menuid === item.SubMenuId && right.Status === 'Y')
        );
      }
    });
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
        } else {
          this.MenuRights = []
        }
      }
    })
  }
  SearchEvent(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.MenuRights = this.MenuRights.filter(subMenu =>
      subMenu.SubMenuName.toLowerCase().startsWith(searchTerm)
    );
  }

  toogleMenu(subMenu: any) {
    console.log(subMenu);
    const path = this.getRouteByMenuId(subMenu.SubMenuId);
    if (!path) {
      this.searchControl.setValue('');
      this.Error = 'Route Path Mismatch Or Undefined';
      this.userHeader = 'Warning!!';
      return this.opendialog();
    }
    this.router.navigate(['/', path]);
    this.isSidenavOpen = false;
    this.searchControl.setValue('');
  }
  toggleSidenav() {
    this.isSidenavOpen = this.isSidenavOpen ? false : true
  }

  getRouteByMenuId(menuId: number): string | null {
    const route = this.router.config.find((r: any) => r.data?.menuId === menuId);
    return route?.path ?? null;
  }

  // after Select Option 
  SubMenuId: number = 0
  SearchBarOptionSelect(e: any) {
    const SubMenuId = Number(e.option.value);
    this.SubMenuId = SubMenuId;

    this.loginService.RighitsCheck(this.Empid, this.LocationId).subscribe({
      next: (data: any) => {
        if (!this.isAccessAllowed(data)) return;

        if (SubMenuId === 166) {
          this.handleStoreIssueLogin(SubMenuId);
        } else {
          this.navigateToRoute(SubMenuId);
        }
      }
    });
  }

  private isAccessAllowed(data: any): boolean {
    if (data.length > 0 && data[0].status === 'N') {
      this.showDialog('Error', data[0].Msg);
      return false;
    }

    this.MenuRights = data;
    const matchedRight = this.MenuRights.find(
      (right: any) => right.Menuid === this.SubMenuId && right.Status === 'Y'
    );

    if (!matchedRight) {
      this.searchControl.setValue('');
      this.showDialog('Warning!!', 'Access Denied...');
      return false;
    }

    return true;
  }

  private handleStoreIssueLogin(SubMenuId: number) {
    this.storeIssueService.StoreissueloginDet(SubMenuId, this.LocationId, this.Empid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.showDialog('Error', res[0].Msg);
            return;
          }
          this.searchControl.setValue('');
          const msg = `Already Logged in By <strong style="color:brown">${res[0].empname}</strong> in <strong style="color:brown">${res[0].loginsystem}</strong>`;
          this.showDialog('Information', msg);
          return; // 🔒 Prevent navigation here
        }

        this.navigateToRoute(SubMenuId);

        let ModeuleId = 166
        let logoutStoreissue = {}
        logoutStoreissue = {
          modid: ModeuleId,
          locid: this.LocationId,
          loginid: this.Empid
        }
        this.storeIssueService.InsertScrrenlock(logoutStoreissue).subscribe({
          next: (res: any) => {
            if (res.length > 0) {
              if (res[0].status == 'N') {
                this.Error = res[0].Msg
                this.userHeader = 'Error'
                return this.opendialog()
              }
            }
          }
        })
      }
    })
  }


  private navigateToRoute(SubMenuId: number) {
    const path = this.getRouteByMenuId(SubMenuId);
    if (!path) {
      this.searchControl.setValue('');
      this.showDialog('Warning!!', 'Route Path Mismatch Or Undefined');
      return;
    }

    console.log('Opening Route:', path);
    this.router.navigate(['/', path]);
    this.isSidenavOpen = false;
    this.searchControl.setValue('');
  }

  private showDialog(header: string, message: string) {
    this.userHeader = header;
    this.Error = message;
    this.opendialog();
  }


  barChart() {
    window.open('http://dataserver/Reports/browse', '_blank');
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
          this.router.navigate(['']);
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
  ngOnDestroy() {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe(); // Unsubscribe to avoid subsequent timeouts
    }
    this.logoutService.stopTimer();
    this.dialog.closeAll();
    let ModeuleId = 166
    let logoutStoreissue = {}
    logoutStoreissue = {
      locid: this.locationId,
      loginid: this.Empid,
      modid: ModeuleId,
      loginsystem: 'Tab-Entry'
    }
    this.storeIssueService.UpdateStoreissueLogout(logoutStoreissue).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.toastr.success(res[0].Msg)
        }
      }
    })
    this.Logout()
  }
}