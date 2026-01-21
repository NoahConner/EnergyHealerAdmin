import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/shared/services/helper.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public settingForm: any = this.fb.group({
    android_url: [null, Validators.required],
    ios_url: [null, Validators.required],
    email: [null, Validators.required],
    admin_percent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    driver_percent: [{ value: '', disabled: true }, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  constructor(private fb: FormBuilder, private http: HttpService, private router: Router) { }

  ngOnInit() {
    this.getSetting(); // Call getSetting directly
    this.settingForm.get('admin_percent')?.valueChanges.subscribe(value => {
      this.updateDriverPercent();
    });
  }

  async loadData() {
    await Promise.all([this.getSetting()]);
  }

  async saveSetting() {
    // Enable the driver percent field before submitting
    this.settingForm.get('driver_percent')?.enable();

    // Convert the percentages to decimal values
    const formValue = this.settingForm.value;
    formValue.admin_percent = formValue.admin_percent / 100;
    formValue.driver_percent = formValue.driver_percent / 100;

    await this.http.post('create-setting', formValue, true).subscribe((res: any) => {
      console.log(res);
      // Re-disable the driver percent field after submitting
      this.settingForm.get('driver_percent')?.disable();
    });
  }

  async getSetting() {
    try {
      const res: any = await this.http.get('get-setting', true).toPromise();
      // Convert the decimal values to percentages
      res.setting.admin_percent = res.setting.admin_percent * 100;
      res.setting.driver_percent = res.setting.driver_percent * 100;
      this.settingForm.patchValue(res.setting);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  updateDriverPercent(): void {
    const adminPercent = this.settingForm.get('admin_percent')?.value || 0;
    const driverPercent = 100 - adminPercent;
    this.settingForm.get('driver_percent')?.setValue(driverPercent);
  }
}
