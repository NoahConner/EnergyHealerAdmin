import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from 'src/app/shared/services/helper.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  public users: any[] = [];
  public duePage!: any;
  public total!: any;
  public selectedUser: any;
  public searchInput!: any;
  public isDrawerOpen: boolean = false;
  public state: boolean = false;
  public show: boolean = false;
  currentImage: any;

  constructor(
    private http: HttpService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private helper: HelperService
  ) { }

  public editForm: any = this.fb.group({
    name: [null, Validators.required],
    email: [null, Validators.required],
    phone_number: [null, Validators.required],
    password: [null, Validators.required],
    status: [1],
    image: [null, Validators.required],
  });



  userForm: any = this.fb.group({
    id: [null, Validators.required],
    status: [null, Validators.required],
  });

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    await Promise.all([this.getAllUsers()]);
  }

  open(state: string) {
    this.isDrawerOpen = true;
    this.state = state == 'edit' ? true : false;
    if (state == 'edit') {
      const { id, name, email, phone_number, password, image, status } = this.selectedUser || {};
      if (!this.editForm.contains('id')) {
        this.editForm.addControl('id', new FormControl(id));
      }
      this.editForm.patchValue({
        name,
        email,
        phone_number,
        password,
        image,
        status: status
      });
      this.currentImage = image;
    }
  }

  proceed() {
    this.isDrawerOpen = false;
    this.editForm.reset();
    if (this.editForm.contains('id')) {
      this.editForm.removeControl('id');
    }
    this.state = false;
    this.currentImage = null;
  }

  onImageSelected(event: any) {
    this.helper
      .fileUploadHttp(event)
      .then((result: any) => {
        this.editForm.patchValue({
          image: result.image_url,
        });
        console.log(this.editForm.value);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  async getAllUsers() {
    try {
      const res: any = await this.http.get('/get_all_users', true).toPromise();
      console.log(res);
      this.users = res?.user;
      console.log(this.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async userDetail(id: any) {
    this.router.navigateByUrl(`/users/user/${id}`);
  }

  async updateStatus(event: any, data: any) {
    this.selectedUser = this.users?.find((e: any) => e?.id == event.id);
    if (this.selectedUser) {
      const { id } = this.selectedUser || {};
      this.userForm.patchValue({
        id: id,
        status: data.target.checked ? 1 : 0,
      });
      await this.save(false, true);
    }
  }

  async stateItem(event: any, data: any) {
    this.selectedUser = this.users?.find((e: any) => e?.id == event.id);
    if (this.selectedUser) {
      const { id, name, email, phone_number, password, image } = this.selectedUser || {};

      this.editForm.patchValue({
        ...this.editForm.value,
        name,
        email,
        phone_number,
        password,
        image,
        status: data.target.checked ? 1 : 0,
      });

      this.editForm.addControl('id', new FormControl(id));
    }
    await this.save(false);
  }

  save(modal: boolean, isStatusUpdate: boolean = false) {
    if (!this.state) {
      this.editForm.patchValue({
        ...this.editForm.value,
        position: this.users?.length + 1,
      });
    }

    const formData = isStatusUpdate ? this.userForm.value : this.editForm.value;

    this.http.post('/update_user', formData, true).subscribe({
      next: () => {
        this.proceed();
        this.editForm.reset();
        this.userForm.reset();
      },
      complete: () => {
        this.getAllUsers();
      },
    });
  }

  showPassword() {
    this.show = !this.show;
  }

  async deleteUser(id: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.post(`/user_delete/${id}`, {}, true).subscribe({
        next: () => {
          this.getAllUsers();
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
