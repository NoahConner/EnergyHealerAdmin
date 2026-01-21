import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
    public categories: any[] = [];
    public duePage!: any;
    public total!: any;
    public selectedCategory: any;
    public searchInput!: any;
    public isDrawerOpen: boolean = false;
    public state: boolean = false;
    public editForm: FormGroup;

    constructor(
        private http: HttpService,
        private fb: FormBuilder,
        private helper: HelperService
    ) {
        this.editForm = this.fb.group({
            name: [null, Validators.required],
            image: [null, Validators.required],
            status: [1],
        });
    }

    ngOnInit() {
        this.getAllCategories();
    }

    async getAllCategories() {
        try {
            const res: any = await this.http.get('/get_all_categories', true).toPromise();
            this.categories = res?.data || res?.categories || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    open(state: string) {
        this.isDrawerOpen = true;
        this.state = state === 'edit';
        if (this.state) {
            const { id, name, image, status } = this.selectedCategory || {};
            if (!this.editForm.contains('id')) {
                this.editForm.addControl('id', new FormControl(id));
            }
            this.editForm.patchValue({
                name,
                image,
                status,
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
        this.selectedCategory = null;
    }

    onImageSelected(event: any) {
        this.helper
            .fileUploadHttp(event)
            .then((result: any) => {
                this.editForm.patchValue({
                    image: result.image_url,
                });
            })
            .catch((error: any) => {
                console.error(error);
            });
    }

    async updateStatus(event: any, item: any) {
        this.selectedCategory = item;
        const status = event.target.checked ? 1 : 0;
        const formData = {
            id: item.id,
            status: status,
        };

        // Assuming a status update endpoint or using the general update endpoint
        this.http.post('/update_category_status', formData, true).subscribe({
            next: () => {
                this.getAllCategories();
            },
            error: () => {
                // Revert if failed
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
        const url = this.state ? '/update_category' : '/create_category';

        this.http.post(url, formData, true).subscribe({
            next: () => {
                this.proceed();
                this.getAllCategories();
            },
        });
    }

    deleteCategory(id: any) {
        if (confirm('Are you sure you want to delete this category?')) {
            this.http.post(`/delete_category/${id}`, {}, true).subscribe({
                next: () => {
                    this.getAllCategories();
                },
            });
        }
    }
}
