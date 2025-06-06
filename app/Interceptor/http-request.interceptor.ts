import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { catchError, finalize, Observable, throwError } from "rxjs";
import { DialogCompComponent } from "../dialog-comp/dialog-comp.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  activeRequests = 0;

  constructor(private spinner: NgxSpinnerService, private router: Router, private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.activeRequests++) this.spinner.show();

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let userMessage = "An unexpected error occurred.";

        if (error.error?.Msg) {
          userMessage = `Error ${error.status}: ${error.error.Msg}`;
        } else {
          switch (error.status) {
            case 0:
              userMessage = "Network error or server unreachable. Please try again.";
              break;
            case 400:
              userMessage = "Bad Request: The server could not understand the request. Please check your input.";
              break;
            case 401:
              userMessage = "Unauthorized access. Please log in again.";
              break;
            case 403:
              userMessage = "Forbidden: Invalid or expired token.";
              break;
            case 404:
              userMessage = "Requested resource not found.";
              break;
            case 408:
              userMessage = "Request timeout. Please try again.";
              break;
            case 409:
              userMessage = "Conflict: The request could not be completed due to a conflict with the current state.";
              break;
            case 413:
              userMessage = "Payload Too Large: The request size is too big.";
              break;
              case 422:
                if (error?.error?.errors && Array.isArray(error.error.errors)) {
                  userMessage = `Validation failed: ${error.error.errors.join(', ')},${error.error.context} `;
                } else {
                  userMessage = "Validation failed. Please check your input.";
                }
                break;
            case 429:
              userMessage = "Too Many Requests: You have hit the rate limit. Please wait before retrying.";
              break;
            case 500:
              userMessage = "Server error. Please try again later.";
              break;
            case 502:
              userMessage = "Bad Gateway: Server received an invalid response.";
              break;
            case 503:
              userMessage = "Service Unavailable: Server is temporarily down. Please try again later.";
              break;
            case 504:
              userMessage = "Gateway Timeout: Server took too long to respond.";
              break;
            default:
              userMessage = `Unexpected error occurred (Status: ${error.status}). Please contact support.`;
          }
          
        }

        this.ErrorMsg = userMessage;
        this.userHeader = "Error";
        this.openDialog();

        return throwError(() => error);
      }),
      finalize(() => {
        if (--this.activeRequests === 0) {
          this.spinner.hide();
        }
      })
    );
  }

  ErrorMsg: string = '';
  userHeader: string = '';
  dialogRef!: MatDialogRef<DialogCompComponent>;

  openDialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.ErrorMsg, Type: this.userHeader }
    });

    this.dialogRef.afterClosed().subscribe(() => {
      // Hide the spinner when dialog is closed
      if (--this.activeRequests === 0) {
        this.spinner.hide();
      }
      
      // Navigate to Dashboard
      this.router.navigate(['/dashboard']);
    });
  }
}
