import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingBarModule } from "@ngx-loading-bar/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { SecureInnerPagesGuard } from "./shared/guard/SecureInnerPagesGuard.guard";
import { AdminGuard } from "./shared/guard/admin.guard";
import { ImageModule } from "./image/image.module";
import { ToastrModule } from "ngx-toastr";
import { AuthInterceptorService } from "./shared/services/auth-interceptor.service";
import { SharedModule } from "./shared/shared.module";
import { LightboxModule } from "ngx-lightbox";

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    ImageModule,
    ToastrModule.forRoot(),
    SharedModule,
    LightboxModule,
  ],
  providers: [
    AdminGuard,
    SecureInnerPagesGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
