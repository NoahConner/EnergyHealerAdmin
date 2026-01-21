import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from 'src/app/shared/services/helper.service';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  public events: any[] = [];
  public duePage: number = 1;
  public total: number = 0;
  public selectedEvent: any;
  public searchInput: string = '';
  public isDrawerOpen: boolean = false;
  public state: boolean = false;
  public show: boolean = false;
  currentImage: any;

  public editForm: FormGroup;
  public statusForm: FormGroup;

  constructor(
    private http: HttpService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private helper: HelperService
  ) {
    this.editForm = this.fb.group({
      id: [null],
      title: [null, Validators.required],
      description: [null, Validators.required],
      date_time: [null, Validators.required],
      link: [null],
      status: [1],
    });

    this.statusForm = this.fb.group({
      // id: [null, Validators.required],
      event_status: [null, Validators.required],
      link: [null]
    });
  }

  ngOnInit() {
    this.getAllEvents();
  }

  async getAllEvents() {
    try {
      const res: any = await this.http.get('/get_all_events', true).toPromise();
      this.events = res?.events || [];
      this.total = this.events.length;
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  open(state: string) {
    this.isDrawerOpen = true;
    this.state = state == 'edit' ? true : false;
    if (state == 'edit') {
      const { id, title, description, date_time, link, status } = this.selectedEvent || {};
      this.editForm.patchValue({
        id,
        title,
        description,
        date_time,
        link,
        status: status
      });
    }
  }

  proceed() {
    this.isDrawerOpen = false;
    this.editForm.reset();
    this.state = false;
  }


  openStatusModal(content: any, event: any) {
    this.selectedEvent = event;
    this.statusForm.reset();
    this.statusForm.patchValue({ id: event.id });
    this.modalService.open(content, { centered: true });
  }

  confirmStartEvent(modal: any) {
    this.statusForm.patchValue({ event_status: 1 });
    this.http.post(`/event-status-update/${this.selectedEvent.id}`, this.statusForm.value, true).subscribe({
      next: () => {
        modal.close();
        this.getAllEvents();
      }
    });
  }

  confirmCompleteEvent(modal: any) {
    this.statusForm.patchValue({ event_status: 2 });
    this.http.post(`/event-status-update/${this.selectedEvent.id}`, this.statusForm.value, true).subscribe({
      next: () => {
        modal.close();
        this.getAllEvents();
      }
    });
  }

  save() {
    const formData = this.editForm.value;
    this.http.post('/event_send', formData, true).subscribe({
      next: () => {
        this.proceed();
        this.getAllEvents();
      }
    });
  }

  async deleteEvent(id: any) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ca26d9',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#1a1a20',
      color: '#fff'
    });

    if (result.isConfirmed) {
      this.http.post(`/delete-event/${id}`, {}, true).subscribe({
        next: () => {
          this.getAllEvents();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your event has been deleted.',
            icon: 'success',
            background: '#1a1a20',
            color: '#fff',
            confirmButtonColor: '#ca26d9'
          });
        },
        error: (error: any) => console.error('Error deleting event:', error)
      });
    }
  }

}
