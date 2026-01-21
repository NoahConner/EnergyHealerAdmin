import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-music',
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
    public musicList: any[] = [];
    public categories: any[] = [];
    public duePage!: any;
    public total!: any;
    public selectedMusic: any;
    public searchInput!: any;
    public isDrawerOpen: boolean = false;
    public state: boolean = false;
    public editForm: FormGroup;
    public audioUrl: string | null = null;

    constructor(
        private http: HttpService,
        private fb: FormBuilder,
        private helper: HelperService
    ) {
        this.editForm = this.fb.group({
            category_id: [null, Validators.required],
            title: [null, Validators.required],
            artist_name: [null, Validators.required],
            music_image: [null, Validators.required],
            music: [null, Validators.required],
            album: ['-', Validators.required],
            status: [1]
        });
    }

    ngOnInit() {
        this.getAllMusic();
        this.getAllCategories();
    }

    async getAllMusic() {
        try {
            const res: any = await this.http.get('/get_all_musics', true).toPromise();
            const categoriesData = res?.data || res?.category || [];
            this.musicList = [];
            if (Array.isArray(categoriesData)) {
                categoriesData.forEach((cat: any) => {
                    if (cat.musics && Array.isArray(cat.musics)) {
                        const musicsWithCat = cat.musics.map((m: any) => ({ ...m, category_name: cat.name }));
                        this.musicList = [...this.musicList, ...musicsWithCat];
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching music:', error);
        }
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
            const { id, categary_id, category_id, title, artist, artwork, url, status, album } = this.selectedMusic || {};
            if (!this.editForm.contains('id')) {
                this.editForm.addControl('id', new FormControl(id));
            }
            this.editForm.patchValue({
                category_id: category_id || categary_id, // Handle both keys
                title,
                artist_name: artist,
                music_image: artwork,
                music: url,
                album: album || '-',
                status
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
        this.selectedMusic = null;
        this.audioUrl = null;
    }

    onImageSelected(event: any) {
        this.helper.fileUploadHttp(event).then((result: any) => {
            this.editForm.patchValue({ music_image: result.image_url });
        }).catch(error => console.error(error));
    }

    onAudioSelected(event: any) {
        (this.helper as any).uploadAudio(event).then((result: any) => {
            const audioUrl = result.data?.url || result?.data?.audio_url;
            this.editForm.patchValue({ music: audioUrl });
        }).catch((error: any) => console.error(error));
    }

    async updateStatus(event: any, item: any) {
        this.selectedMusic = item;
        const status = event.target.checked ? 1 : 0;
        const formData = {
            id: item.id,
            status: status
        };

        this.http.post('/update_music_status', formData, true).subscribe({
            next: () => this.getAllMusic(),
            error: () => event.target.checked = !event.target.checked
        });
    }

    save() {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }
        const formData = this.editForm.value;
        const url = this.state ? '/update_music' : '/create_music';

        this.http.post(url, formData, true).subscribe({
            next: () => {
                this.proceed();
                this.getAllMusic();
            }
        });
    }

    deleteMusic(id: any) {
        if (confirm('Are you sure you want to delete this music?')) {
            this.http.post(`/delete-music/${id}`, {}, true).subscribe({
                next: () => this.getAllMusic()
            });
        }
    }
}
