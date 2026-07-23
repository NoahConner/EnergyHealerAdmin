import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpService } from '../../../shared/services/http.service';

interface SupportTicket {
  id: number;
  user_id?: string;
  email: string;
  message: string;
  reply: string | null;
  replied_at: string | null;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {

  public helps: SupportTicket[] = [];
  public duePage!: any;
  public total!: any;
  public searchInput!: any;
  selectedHelp: any;

  isReplyModalOpen = false;
  selectedTicket: SupportTicket | null = null;
  isEditingReply = false;
  replyText = '';
  isSubmittingReply = false;
  replyError: string | null = null;

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

    openReplyModal(item: SupportTicket) {
      this.selectedTicket = item;
      this.replyText = item.reply || '';
      this.isEditingReply = !item.reply;
      this.replyError = null;
      this.isReplyModalOpen = true;
    }

    closeReplyModal() {
      this.isReplyModalOpen = false;
      this.selectedTicket = null;
      this.replyText = '';
      this.isEditingReply = false;
      this.replyError = null;
    }

    startEditReply() {
      if (!this.selectedTicket) {
        return;
      }
      this.isEditingReply = true;
      this.replyText = this.selectedTicket.reply || '';
      this.replyError = null;
    }

    cancelEditReply() {
      if (this.selectedTicket?.reply) {
        this.isEditingReply = false;
        this.replyText = this.selectedTicket.reply;
        this.replyError = null;
      } else {
        this.closeReplyModal();
      }
    }

    async submitReply() {
      if (!this.selectedTicket) {
        return;
      }

      const trimmedReply = (this.replyText || '').trim();
      if (!trimmedReply) {
        this.replyError = 'Reply message cannot be empty.';
        return;
      }

      this.isSubmittingReply = true;
      this.replyError = null;

      try {
        const res: any = await this.http
          .post(`/support/${this.selectedTicket.id}/reply`, { reply: trimmedReply }, true)
          .toPromise();

        const updated: SupportTicket = res?.data;
        if (updated) {
          this.helps = this.helps.map((h) => (h.id === updated.id ? { ...h, ...updated } : h));
          this.selectedTicket = updated;
        }
        this.isEditingReply = false;
      } catch (error) {
        console.error('Error sending reply:', error);
        this.replyError = 'Unable to send reply. Please try again.';
      } finally {
        this.isSubmittingReply = false;
      }
    }
  }
  

  