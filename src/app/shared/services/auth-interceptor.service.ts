import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, from } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("Error:", error);
        this.toastr.error(
          error?.error?.message ? error?.error?.message : error?.error?.error
        );

        return throwError(error);
      })
    );
  }

  async logoutUser() {
    localStorage.clear();
    this.router.navigateByUrl("auth/login");
  }
}
