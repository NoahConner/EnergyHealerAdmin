import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import * as feather from "feather-icons";
import { HelperService } from "src/app/shared/services/helper.service";
import { HttpService } from "src/app/shared/services/http.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpService, private helper: HelperService) {}

  public users: number = 0;
  public events: number = 0;
  public categories: number = 0;
  public musics: number = 142; // Mock data for now

  ngOnInit() {
    this.loadData();
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      feather.replace();
    });
  }

  async loadData() {
    await Promise.all([this.getDataLenght()]);
  }

  async getDataLenght() {
    try {
      const res: any = await this.http.get("/get_all_users", true).toPromise();
      console.log(res);
      this.users = res?.user?.length || 0;
    } catch (error) {
      console.error("Error fetching users:", error);
    }

    try {
      const res: any = await this.http.get("/get_all_events", true).toPromise();
      this.events = res?.events?.length || 0;
    } catch (error) {
      console.error("Error fetching events:", error);
    }

    try {
      const res: any = await this.http
        .get("/get_all_categories", true)
        .toPromise();
      this.categories = res?.data?.length || 0;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }

    try {
      const res: any = await this.http.get("/get_all_musics", true).toPromise();
      // this.categories = res?.data?.length || 0;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
}
