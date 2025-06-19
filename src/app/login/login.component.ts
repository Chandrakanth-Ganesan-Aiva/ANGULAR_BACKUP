import { AfterViewInit, Component, ElementRef, inject, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  loginForm!: FormGroup;
  private formBuilder = inject(FormBuilder);

  constructor(private fb: FormBuilder, private service: LoginService, private dialog: MatDialog,
    private toastr: ToastrService, private zone: NgZone, private router: Router, private date: DatePipe) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      // location: ['', Validators.required],
    })



  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy() {

  }


  Loaction: any[] = new Array()
  ngOnInit() {
    this.service.companyDetail().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.Loaction = res

        }
      }
    })

  }


  isCapsLockOnPass = false;
  isCapsLockOnUser = false
  checkCapsLockPass(event: KeyboardEvent): void {
    this.isCapsLockOnPass = event.getModifierState('CapsLock');
  }

  checkCapsLockUser(event: KeyboardEvent): void {
    this.isCapsLockOnUser = event.getModifierState('CapsLock');
  }
  loginvaildbtn: any
  logindata: any = new Array()
  login() {
    this.loginvaildbtn = true
    if (this.loginForm.invalid) {
      return
    } else {
      this.service.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.opendialog()
              return
            }
            this.logindata = res
            if (this.logindata[0].password === this.service.CryptString(this.loginForm.controls['password'].value)) {
              sessionStorage.setItem('session', JSON.stringify(this.logindata[0]));
              let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
              this.service.checkloginsts(Data.empid).subscribe({
                next: (chck: any) => {
                  if (chck.length >= 1) {
                    if (chck[0].status == 'N') {
                      this.Error = chck[0].Msg
                      this.userHeader = 'Error'
                      this.opendialog()
                      return
                    }
                    this.Error = 'You are already logged in on another system, or you did not log out properly last time. <br> ' +
                      ' Would you like to log out from the previous session?'
                    this.userHeader = 'Warning!!!'
                    this.opendialog()
                    this.dialogRef.afterClosed().subscribe((res: boolean) => {
                      if (res == true) {
                        let updatelist = []
                        updatelist.push({
                          EmpId: Data.empid,
                        })
                        this.service.UpdateUserDet(updatelist).subscribe({
                          next: (data: any) => {
                            if (data.length > 0) {
                              if (data.status == 'N') {
                                this.Error = data[0].Msg
                                this.userHeader = 'Error'
                                this.opendialog()
                                return
                              }
                              this.LocationDialog()
                            }
                          }
                        })
                      } else {
                        return
                      }
                    })
                  } else {
                    this.LocationDialog()
                  }
                }
              })
            } else {
              this.Error = 'Your Password Is Invaild..Please Check...'
              this.userHeader = 'Error'
              this.opendialog()
              return
            }
          } else {
            this.Error = 'Check User Name And Password'
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
        }
      })
    }
  }
  Login = new FormControl('')
  @ViewChild('Location') Location!: TemplateRef<any>;
  RecDialog: any = ''
  LocationDialog() {
    this.RecDialog = this.dialog.open(this.Location, {
      disableClose: true,
    })
  }
  closeDialog() {
    this.RecDialog.close();
  }
  DeptDet: any[] = new Array()
  userDet: any[] = new Array()
  getUserDetIns() {
    sessionStorage.setItem('location', JSON.stringify(this.Login.value))
    sessionStorage.setItem('islogIn', "true");
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.service.Dept(Data.empid).subscribe({
      next: (res: any) => {
        if (res) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.DeptDet = res
          this.userDet = []
          this.userDet.push({
            Empid: Data.empid,
            Empname: Data.cusername,
            LocationId: this.Login.value,
            LoginTime: this.date.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            DeptId: this.DeptDet[0].deptid,
            DeptName: this.DeptDet[0].deptname
          })
          this.service.loginUserDetInsert(this.userDet).subscribe({
            next: (res: any) => {
              if (res && res.length > 0) { // Ensure response exists
                if (res[0].status === 'N') {
                  this.Error = res[0].Msg;
                  this.userHeader = 'Error';
                  return this.opendialog();
                }
                this.router.navigate(['/Dashboard']);
                setTimeout(() => {
                  window.location.reload();
                });
                // let tokenData = {
                //   UserName: this.loginForm.controls['username'].value,
                //   Password: this.loginForm.controls['password'].value,
                // };
                // this.service.tokenDet(tokenData).subscribe({
                //   next: (token: any) => {
                //     if (token?.Token) {
                //       this.zone.run(() => {
                //         sessionStorage.setItem('token', JSON.stringify(token.Token));
                //         this.router.navigate(['/Dashboard']);

                //         // Remove unnecessary page reload unless needed
                //         setTimeout(() => {
                //           window.location.reload();
                //         }, 1000);
                //       });
                //     } else {
                //       console.error('Token is missing in response');
                //     }
                //   },
                //   error: (err) => {
                //     console.error('Error fetching token:', err);
                //     this.Error = 'Login failed. Please try again.';
                //     this.opendialog();
                //   }
                // });
              }
            },
            error: (err) => {
              console.error('Login API error:', err);
              this.Error = 'An error occurred while logging in. Please try again.';
              this.opendialog();
            }
          });

        }
      }
    })

  }
  @ViewChild('frgPass') frgPass!: TemplateRef<any>;
  frgPassDialog: MatDialogRef<any> | null = null;
  ForgetPass(event: Event) {
    event.preventDefault();
    this.frgPassDialog = this.dialog.open(this.frgPass, {
      disableClose: true,
      maxWidth: '400px',
      height: 'fit-content'
    });
  }
  OTPbtn = true;
  username = new FormControl('', Validators.required)
  dob = new FormControl('', Validators.required)
  userDetArr: any
  Verify() {
    if (this.username.value && this.dob.value) {
      let dob = this.date.transform(this.dob.value, 'yyyy-MM-dd')
      this.service.UserNameCheck(this.username.value, dob).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            this.userDetArr = res
            this.toastr.success('UserName Matched')
            this.username.disable()
            this.dob.disable()
            this.OTPbtn = false
          } else {
            this.Error = 'Enter Correct Credentials'
            this.userHeader = 'Warning!!'
            return this.opendialog()
          }
        }
      })
    }
  }
  AutoGenerateOtp: number = 0
  SendOTP() {
    this.AutoGenerateOtp = Math.floor(1000 + Math.random() * 9000);
    const { empname, email } = this.userDetArr[0]
    this.service.OTP(empname, this.AutoGenerateOtp, email).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          console.log(res);
          this.OTPbtn = true
          this.toastr.success('Mail Send Successfully')
          this.OTP.enable()
          this.verfiyOtp = false
        }
      }
    })
  }
  verfiyOtp: boolean = true
  OTP = new FormControl({ value: '', disabled: true }, Validators.required)
  VerfiyOTP() {
    if (this.OTP.invalid) return this.OTP.markAllAsTouched()
    let date = this.date.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const { LoginID, empname, email } = this.userDetArr[0]
    console.log(Number(this.OTP.value), this.AutoGenerateOtp);

    if (Number(this.OTP.value) == this.AutoGenerateOtp) {
      this.service.InsertOtp(LoginID, date, empname, this.AutoGenerateOtp, email).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            console.log(res);
            this.toastr.success(res[0].Msg)
            this.OTPbtn = true
            this.verfiyOtp = true
            this.PaswBtn=false
          }
        }
      })
    } else {
      this.Error = 'Your OTP is InValid'
      this.userHeader = 'Error'
      return this.opendialog()
    }
  }
  PaswBtn:boolean=true
  UptPass = new FormControl('', Validators.required)
  updatePassword() {
    if (this.UptPass.invalid) return this.UptPass.markAsUntouched()
    let password = this.UptPass.value;
    if (!password || password.length < 8) {
      this.Error = 'Password must be at least 8 characters long.';
      this.userHeader = 'Error';
      return this.opendialog();
    }

    const { LoginID } = this.userDetArr[0]
    const UpDatePass = {
      psw: this.UptPass.value,
      loginid: LoginID
    }
    console.log(UpDatePass);

    this.service.UpdatePass(UpDatePass).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.userDetArr = res
          this.toastr.success('Your is Password Changed Successfully')
          this.frgPasscloseDialog()
        }
      }
    })
  }
  frgPasscloseDialog() {
    if (this.frgPassDialog) {
      this.frgPassDialog.close()
      this.username.setValue('')
      this.dob.setValue('')
      this.OTP.setValue('')
      this.UptPass.setValue('')
      this.username.enable()
      this.dob.enable()
    }
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
}
