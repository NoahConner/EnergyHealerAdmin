import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { HomeComponent } from "./home/home.component";
import { CountToModule } from "angular-count-to";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NotificationComponent } from "./notification/notification.component";
import { SettingsComponent } from "./settings/settings.component";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgApexchartsModule } from "ng-apexcharts";
import { FlatpickrModule } from "angularx-flatpickr";
import { EventsComponent } from "./events/events.component";
import { CategoriesComponent } from "./categories/categories.component";
import { MusicComponent } from "./music/music.component";
import { AdminPlaylistComponent } from "./admin-playlist/admin-playlist.component";
import { SubscriptionsComponent } from "./subscriptions/subscriptions.component";
import { DailyEnergyFlowComponent } from './daily-energy-flow/daily-energy-flow.component';

@NgModule({
  declarations: [
    HomeComponent,
    NotificationComponent,
    SettingsComponent,
    EventsComponent,
    CategoriesComponent,
    MusicComponent,
    AdminPlaylistComponent,
    SubscriptionsComponent,
    DailyEnergyFlowComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    DashboardRoutingModule,
    CountToModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxPaginationModule,
    NgApexchartsModule,
    FlatpickrModule.forRoot(),
  ],
})
export class DashboardModule {}
