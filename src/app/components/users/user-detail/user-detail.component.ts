import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent {
  public user: any;
  public ratings: any[] = [];
  public loading: boolean = true;
  public currentPlayingUrl: string | null = null;
  public musicSearch: string = '';
  private audio: HTMLAudioElement = new Audio();

  constructor(
    private route: ActivatedRoute,
    private http: HttpService
  ) {
    this.audio.onended = () => {
      this.currentPlayingUrl = null;
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let userId = params['id'];
      if (userId) {
        this.getUser(userId);
      }
    });
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
  }

  async getUser(id: any) {
    this.loading = true;
    try {
      const res: any = await this.http.get(`/get-user/${id}`, true).toPromise();
      this.user = res?.user;
      this.ratings = res?.rating || [];
      console.log('User Data:', this.user);
      console.log('Ratings Data:', this.ratings);
    } catch (error) {
      console.error('Error fetching user detail:', error);
    } finally {
      this.loading = false;
    }
  }

  generateStarArray(rating: any): any[] {
    const r = rating === 'true' ? 5 : (typeof rating === 'number' ? Math.round(rating) : 0);
    return Array(r).fill(0);
  }

  playMusic(url: string) {
    if (this.currentPlayingUrl === url) {
      this.audio.pause();
      this.currentPlayingUrl = null;
    } else {
      this.audio.src = url;
      this.audio.play();
      this.currentPlayingUrl = url;
    }
  }
}
