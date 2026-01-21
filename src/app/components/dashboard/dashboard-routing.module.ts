import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingsComponent } from "./settings/settings.component";
import { NotificationComponent } from "./notification/notification.component";
import { HomeComponent } from "./home/home.component";
import { EventsComponent } from "./events/events.component";
import { CategoriesComponent } from "./categories/categories.component";

import { MusicComponent } from "./music/music.component";
import { SubscriptionsComponent } from "./subscriptions/subscriptions.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "notifications",
        component: NotificationComponent,
      },
      {
        path: "setting",
        component: SettingsComponent,
      },
      {
        path: "events",
        component: EventsComponent,
      },

      {
        path: "categories",
        component: CategoriesComponent,
      },
      {
        path: "music",
        component: MusicComponent,
      },
      {
        path: "subscriptions",
        component: SubscriptionsComponent,
      },
      {
        path: "**",
        redirectTo: "notifications",
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
