import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule, NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageModule } from '../image/image.module';
import { FilterPipe } from '../pipes/filter.pipe';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { MegaMenuComponent } from './components/header/elements/mega-menu/mega-menu.component';
import { MyAccountComponent } from './components/header/elements/my-account/my-account.component';
import { NotificationComponent } from './components/header/elements/notification/notification.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/layout/content/content.component';
import { FullComponent } from './components/layout/full/full.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';
import { DisableKeyPressDirective } from './directives/disable-key-press.directive';
import { OnlyAlphabetsDirective } from './directives/only-alphabets.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { ShowOptionsDirective } from './directives/show-options.directive';
import { LayoutService } from './services/layout.service';
import { NavService } from './services/nav.service';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    BreadcrumbComponent,
    FeatherIconsComponent,
    FullComponent,
    ShowOptionsDirective,
    DisableKeyPressDirective,
    OnlyAlphabetsDirective,
    OnlyNumbersDirective,
    LoaderComponent,
    TapToTopComponent,
    MegaMenuComponent,
    NotificationComponent,
    MyAccountComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ImageModule,
    StarRatingModule.forRoot(),
    NgbRatingModule,
    NgbAccordionModule
    
  ],
  providers: [
    NavService,
    LayoutService
  ],
  exports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    BreadcrumbComponent,
    FeatherIconsComponent,
    TapToTopComponent,
    DisableKeyPressDirective,
    OnlyAlphabetsDirective,
    OnlyNumbersDirective,
    FilterPipe,
    StarRatingModule,
    NgbRatingModule,
    NgbAccordionModule
    // LazyLoadImageModule
  ],
})
export class SharedModule { }
