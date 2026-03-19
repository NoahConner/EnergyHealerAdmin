import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/services/http.service';
import { HelperService } from '../../../shared/services/helper.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
   public faqs: any[] = [];
    public duePage!: any;
    public total!: any;
    public selectedFaq: any;
    public searchInput!: any;
    public isDrawerOpen: boolean = false;
    public state: boolean = false;
    public editForm: FormGroup;

    constructor(
        private http: HttpService,
        private fb: FormBuilder,
    ) {
        this.editForm = this.fb.group({
            question: [null, Validators.required],
            answer: [null, Validators.required],
        });
    }

    ngOnInit() {
        this.getAllFaqs();
    }
    
    async getAllFaqs() {
        try {
            const res: any = await this.http.get('/get_faqs', true).toPromise();
            this.faqs = res?.data || res?.faqs || [];
        } catch (error) {
            console.error('Error fetching faqs:', error);
        }
    }

    open(state: string) {
        this.isDrawerOpen = true;
        this.state = state === 'edit';
        if (this.state) {
            const { id, question, answer } = this.selectedFaq || {};
            if (!this.editForm.contains('id')) {
                this.editForm.addControl('id', new FormControl(id));
            }
            this.editForm.patchValue({
                question,
                answer,
            });
        }
    }

    proceed() {
        this.isDrawerOpen = false;
        this.editForm.reset();
        if (this.editForm.contains('id')) {
            this.editForm.removeControl('id');
        }
        this.state = false;
        this.selectedFaq = null;
    }

  

    async updateStatus(event: any, item: any) {
        this.selectedFaq = item;
        const status = event.target.checked ? 1 : 0;
        const formData = {
            id: item.id,
            status: status,
        };

        this.http.post('/update_faq', formData, true).subscribe({
            next: () => {
                this.getAllFaqs();
            },
            error: () => {
                event.target.checked = !event.target.checked;
            }
        });
    }

    save() {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }
        const formData = this.editForm.value;
        const url = this.state ? '/update_faq' : '/create_faq';

        this.http.post(url, formData, true).subscribe({
            next: () => {
                this.proceed();
                this.getAllFaqs();
            },
        });
    }
}
