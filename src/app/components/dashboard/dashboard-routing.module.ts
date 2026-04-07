import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingsComponent } from "./settings/settings.component";
import { NotificationComponent } from "./notification/notification.component";
import { HomeComponent } from "./home/home.component";
import { EventsComponent } from "./events/events.component";
import { CategoriesComponent } from "./categories/categories.component";

import { MusicComponent } from "./music/music.component";
import { AdminPlaylistComponent } from "./admin-playlist/admin-playlist.component";
import { SubscriptionsComponent } from "./subscriptions/subscriptions.component";
import { DailyEnergyFlowComponent } from "./daily-energy-flow/daily-energy-flow.component";
import { TermConditionComponent } from "./term-condition/term-condition.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { RefundPolicyComponent } from "./refund-policy/refund-policy.component";
import { HelpComponent } from "./help/help.component";
import { CustomReminderComponent } from "./custom-reminder/custom-reminder.component";
import { FaqsComponent } from "./faqs/faqs.component";
import { CustomHealingComponent } from "./custom-healing/custom-healing.component";
import { QuizComponent } from "./quiz/quiz.component";

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
        path: "daily-energy-flow",
        component: DailyEnergyFlowComponent,
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
        path: "admin-playlist",
        component: AdminPlaylistComponent,
      },
      {
        path: "subscriptions",
        component: SubscriptionsComponent,
      },
      {
        path: "terms-condition",
        component: TermConditionComponent,
      },
      {
        path: "privacy-policy",
        component: PrivacyPolicyComponent,
      },
      {
        path: "refund-policy",
        component: RefundPolicyComponent,
      },
      {
        path: "help",
        component: HelpComponent,
      },
      {
        path: "custom-reminder",
        component: CustomReminderComponent,
      },

      {
        path: "faqs",
        component: FaqsComponent
      },

      {
        path: "custom-healing",
        component: CustomHealingComponent
      },

            {
        path: "quiz",
        component: QuizComponent
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
