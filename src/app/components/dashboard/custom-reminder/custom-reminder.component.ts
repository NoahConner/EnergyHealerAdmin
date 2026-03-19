import { Component } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-custom-reminder',
  templateUrl: './custom-reminder.component.html',
  styleUrls: ['./custom-reminder.component.scss']
})
export class CustomReminderComponent {

  public helps: [] = [];
  public duePage!: any;
  public total!: any;
  public searchInput!: any;
  selectedHelp: any;

  constructor(
    private http: HttpService,
  ) {}

  ngOnInit() {
    this.loadData();
  }
  async loadData() {
    await Promise.all([this.getReminders()]);
  }

  async getReminders() {
    try {
      const res: any = await this.http.get('/get_custom_reminder', true).toPromise();
      console.log(res);
      this.helps = res?.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

 

}
