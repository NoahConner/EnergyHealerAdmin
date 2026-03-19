import { Component, OnInit } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-term-condition',
  templateUrl: './term-condition.component.html',
  styleUrls: ['./term-condition.component.scss'],
})
export class TermConditionComponent implements OnInit {
  public Editor: any = ClassicEditor;
  editorInstance: any;

  public termsForm = this.fb.group({
    description: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    await this.getTerms();
  }

  async getTerms() {
    try {
      const res: any = await this.http.get('/get_terms', true).toPromise();
      this.termsForm.patchValue({
        description: res?.description,
      });
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  }

  async save() {
    try {
      const res: any = await this.http
        .post('/create_terms', this.termsForm.value, true)
        .toPromise();
      console.log(res);
      await this.getTerms();
    } catch (error) {
      console.error('Error saving terms:', error);
    }
  }


}