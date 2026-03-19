import { Component } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-healing',
  templateUrl: './custom-healing.component.html',
  styleUrls: ['./custom-healing.component.scss']
})
export class CustomHealingComponent {

  public healings: [] = [];
  public duePage!: any;
  public total!: any;
  public searchInput!: any;
  selectedHelp: any;
  public isDrawerOpen: boolean = false;
  public state: boolean = false;
  public editForm: FormGroup;
  public selectedHealing: any;



  constructor(
    private http: HttpService,
    private fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      answer: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadData();
  }
  async loadData() {
    await Promise.all([this.getCustomHealing()]);
  }

  openAnswer(item: any) {
    this.selectedHealing = item;
    this.isDrawerOpen = true;

    this.editForm.patchValue({
      answer: item?.answer || ''
    });

    if (!this.editForm.contains('id')) {
      this.editForm.addControl('id', new FormControl(item?.id));
    }
  }

  proceed() {
    this.isDrawerOpen = false;
    this.editForm.reset();
    if (this.editForm.contains('id')) {
      this.editForm.removeControl('id');
    }
    this.state = false;
    this.selectedHealing = null;
  }


  async getCustomHealing() {
    try {
      const res: any = await this.http.get('/get_custom_healing', true).toPromise();
      console.log(res);
      this.healings = res?.healing;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async saveAnswer() {
    try {

      const body = this.editForm.value;

      const res: any = await this.http.post('/answer_custom_healing', body, true).toPromise();

      if (res?.status) {
        this.proceed();
        this.getCustomHealing();
      }

    } catch (error) {
      console.error(error);
    }
  }

}
