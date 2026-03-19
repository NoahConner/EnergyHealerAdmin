import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.scss']
})
export class RefundPolicyComponent {
public Editor:any = ClassicEditor;
  editorInstance: any;
  public refundForm: any = this.fb.group({
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
      const res: any = await this.http.get('/get-refund-policy', true).toPromise();
      await this.refundForm.patchValue({
        description: res?.refund,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  async save() {
    await this.http
      .post('/create-refund-policy', this.refundForm.value, true)
      .subscribe((res: any) => {
        console.log(res);
        this.getPrivacy();
      });
  }
}
