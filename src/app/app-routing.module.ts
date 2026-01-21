import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";
import { AdminGuard } from './shared/guard/admin.guard';
import { SecureInnerPagesGuard } from './shared/guard/SecureInnerPagesGuard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [AdminGuard],
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [SecureInnerPagesGuard],
    children: content
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [SecureInnerPagesGuard],
    children: full
  },
  {
    path: '**',
    redirectTo: 'users'
  }
];

@NgModule({
  imports: [[RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    // enableTracing: true 
})],
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
