import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";
import { HelperService } from "./helper.service";

// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Search Box
  public search: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router, private Help: HelperService) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });

    if (window.innerWidth < 991) {
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    { path: "/dashboard/home", icon: "home", title: "Home", type: "link" },
    { path: "/users", icon: "users", title: "Users", type: "link" },
    {
      path: "/dashboard/events",
      icon: "calendar",
      title: "Events",
      type: "link",
    },
    {
      path: "/dashboard/categories",
      icon: "calendar",
      title: "Categories",
      type: "link",
    },
    { path: "/dashboard/music", icon: "music", title: "Music", type: "link" },
    { path: "/dashboard/admin-playlist", icon: "list", title: "Admin Playlist", type: "link" },
    {
      path: "/dashboard/daily-energy-flow",
      icon: "plus-circle",
      title: "Daily Energy Flow",
      type: "link",
    },


          {
        path: "/dashboard/custom-reminder",
        icon: "clock",
        title: "Custom Reminder",
        type: "link",
      },

              {
      path: "/dashboard/custom-healing",
      icon: "activity",
      title: "Custom Healings",
      type: "link",
    },

                  {
      path: "/dashboard/quiz",
      icon: "activity",
      title: "Quiz",
      type: "link",
    },

    {
      path: "/dashboard/subscriptions",
      icon: "users",
      title: "Subscriptions",
      type: "link",
    },
    {
      path: "/dashboard/notifications",
      icon: "bell",
      title: "Notifications",
      type: "link",
    },

     {
      path: "/dashboard/terms-condition",
      icon: "sliders",
      title: "Terms And Condition",
      type: "link",
    },
    {
      path: "/dashboard/privacy-policy",
      icon: "shield",
      title: "Privacy Policy",
      type: "link",
    },


    {
      path: "/dashboard/refund-policy",
      icon: "refresh-cw",
      title: "Refund Policy",
      type: "link",
    },

    {
      path: "/dashboard/faqs",
      icon: "help-circle",
      title: "FAQs",
      type: "link",
    },
    {
      path: "/dashboard/help",
      icon: "help-circle",
      title: "Help & Support",
      type: "link",
    },



  ];

  MEGAMENUITEMS: Menu[] = [
    {
      title: "Error Pages",
      type: "sub",
      active: true,
      children: [
        {
          path: "/error-page/error-400",
          title: "Error Page 400",
          type: "link",
        },
        {
          path: "/error-page/error-401",
          title: "Error Page 401",
          type: "link",
        },
        {
          path: "/error-page/error-403",
          title: "Error Page 403",
          type: "link",
        },
        {
          path: "/error-page/error-404",
          title: "Error Page 404",
          type: "link",
        },
        {
          path: "/error-page/error-500",
          title: "Error Page 500",
          type: "link",
        },
        {
          path: "/error-page/error-503",
          title: "Error Page 503",
          type: "link",
        },
      ],
    },
    {
      title: "Authentication",
      type: "sub",
      active: false,
      children: [
        {
          path: "/authentication/simple-login",
          title: "Login Simple",
          type: "link",
        },
        {
          path: "/authentication/login-with-background-image",
          title: "Login BG Image",
          type: "link",
        },
        {
          path: "/authentication/login-with-background-video",
          title: "Login BG Video",
          type: "link",
        },
        {
          path: "/authentication/simple-register",
          title: "Simple Register",
          type: "link",
        },
        {
          path: "/authentication/register-with-background-image",
          title: "Register BG Image",
          type: "link",
        },
        {
          path: "/authentication/register-with-background-video",
          title: "Register BG Video",
          type: "link",
        },
      ],
    },
    {
      title: "Usefull Pages",
      type: "sub",
      active: false,
      children: [
        { path: "/search-pages", title: "Search Pages", type: "link" },
        {
          path: "/authentication/unlock-user",
          title: "Unlock User",
          type: "link",
        },
        {
          path: "/authentication/forgot-password",
          title: "Forgot Password",
          type: "link",
        },
        {
          path: "/authentication/reset-password",
          title: "Reset Password",
          type: "link",
        },
        { path: "/maintenance", title: "Maintenance", type: "link" },
      ],
    },
    {
      title: "Email templates",
      type: "sub",
      active: false,
      children: [
        {
          path: "http://admin.pixelstrap.com/cuba/theme/basic-template.html",
          title: "Basic Email",
          type: "extTabLink",
        },
        {
          path: "http://admin.pixelstrap.com/cuba/theme/email-header.html",
          title: "Basic With Header",
          type: "extTabLink",
        },
        {
          path: "http://admin.pixelstrap.com/cuba/theme/template-email.html",
          title: "Ecomerce Template",
          type: "extTabLink",
        },
        {
          path: "http://admin.pixelstrap.com/cuba/theme/template-email-2.html",
          title: "Email Template 2",
          type: "extTabLink",
        },
        {
          path: "http://admin.pixelstrap.com/cuba/theme/ecommerce-templates.html",
          title: "Ecommerce Email",
          type: "extTabLink",
        },
        {
          path: "http://admin.pixelstrap.com/cuba/theme/email-order-success.html",
          title: "Order Success",
          type: "extTabLink",
        },
      ],
    },
    {
      title: "Coming Soon",
      type: "sub",
      active: false,
      children: [
        { path: "/coming-soon/simple", title: "Coming Simple", type: "link" },
        {
          path: "/coming-soon/simple-with-bg-img",
          title: "Coming BG Image",
          type: "link",
        },
        {
          path: "/coming-soon/simple-with-bg-vid",
          title: "Coming BG Video",
          type: "link",
        },
      ],
    },
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
  megaItems = new BehaviorSubject<Menu[]>(this.MEGAMENUITEMS);
}
