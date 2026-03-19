import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  public Editor:any = ClassicEditor;
  editorInstance: any;
  public privacyForm: any = this.fb.group({
    description: [null, Validators.required]
  });
  constructor(private fb:FormBuilder, private http:HttpService,
  ){

  }
  ngOnInit() {
    this.loadData();
  }
  async loadData() {
    await Promise.all([this.getPrivacy()]);
  }

  async getPrivacy() {
    try {
      const res: any = await this.http.get('/get_privacy', true).toPromise();
      await this.privacyForm.patchValue({
        description: res?.privacy,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  async save() {
    await this.http
      .post('/create_privacy', this.privacyForm.value, true)
      .subscribe((res: any) => {
        console.log(res);
        this.getPrivacy();
      });
  }

}