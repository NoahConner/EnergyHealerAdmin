import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { HelperService } from "src/app/shared/services/helper.service";
import { HttpService } from "src/app/shared/services/http.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent {
  public users: any = [];
  filteredUsers: any[];

  public activeTab: string = "all";
  public duePage: number = 1;
  public total: number = 0;
  public searchInput: string | null = null;
  public itemsPerPage = 5;

  public notificationForm: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private helper: HelperService
  ) {
    this.notificationForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      user_ids: this.fb.array([]), // FormArray for selected users
    });
  }
  ngOnInit() {
    this.loadData();
  }
  async loadData() {
    await this.getUsers(this.activeTab);
  }

  get userIdsArray() {
    return this.notificationForm.get("user_ids") as FormArray;
  }

  async getUsers(tab: string) {
    try {
      this.users = [];
      this.filteredUsers = [];
      const endpoint =
        tab === "all" ? "/notification_users" : "/active_notification_users";
      const res: any = await this.http.get(endpoint, true).toPromise();
      console.log(res);
      this.users = res?.users || [];
      this.filteredUsers = this.users;

      if (this.users && this.users.length > 0) {
        this.total = this.users.length;
      } else {
        this.total = 0;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.duePage = 1;
    this.getUsers(tab);
  }

  async save() {
    if (this.userIdsArray.length === 0) {
      alert("Select at least one user");
      return;
    }

    this.http
      .post("/send_notification", this.notificationForm.value, true)
      .subscribe(() => {
        this.notificationForm.reset();
        (this.notificationForm.get("user_ids") as FormArray).clear();
        this.users.forEach((u) => (u.checked = false));
      });
  }
  toggleUserSelection(user: any, event: any) {
    user.checked = event.target.checked;

    const index = this.userIdsArray.controls.findIndex(
      (c) => c.value === user.id
    );
    if (user.checked && index === -1) {
      this.userIdsArray.push(new FormControl(user.id));
    } else if (!user.checked && index > -1) {
      this.userIdsArray.removeAt(index);
    }
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.users.forEach((user) => {
      user.checked = checked;
      this.toggleUserSelection(user, { target: { checked } });
    });
  }

  isAllUsersSelected() {
    return this.users?.length > 0 && this.users.every((user) => user.checked);
  }
}
