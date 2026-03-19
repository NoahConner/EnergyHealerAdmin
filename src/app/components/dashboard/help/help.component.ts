import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {

  public helps: [] = [];
  public duePage!: any;
  public total!: any;
  public searchInput!: any;
  selectedHelp: any;

  constructor(
    private http: HttpService,
    private router: Router,
    private fb: FormBuilder,
  ) {}
  userForm: any = this.fb.group({
    id: [null, Validators.required],
    status: [null, Validators.required],
  });
  ngOnInit() {
    this.loadData();
  }
  async loadData() {
    await Promise.all([this.getHelps()]);
  }

  async getHelps() {
    try {
      const res: any = await this.http.get('/get_support', true).toPromise();
      console.log(res);
      this.helps = res?.support;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

    async deleteHelp(id: number) {
      try {
        await this.http.post(`/support/${id}`, {}, true).toPromise();
        this.getHelps();
      } catch (error) {
        console.error('Error deleting help:', error);
      }
    }
  
    confirmBox(item: any) {
      this.selectedHelp = item;
  
      if (this.selectedHelp && this.selectedHelp.id) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Are you sure you want to proceed?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Delete it!'
        }).then((result) => {
          if (result.value) {
            this.deleteHelp(this.selectedHelp.id);
          }
        });
      } else {
        console.error('Invalid or missing ID for the selected help item.');
      }
    }

  
  }
  

  