import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { HttpService } from "../../../shared/services/http.service";
import { HelperService } from "../../../shared/services/helper.service";
import Swal from "sweetalert2";

interface AudioGalleryItem {
  id: number;
  title: string;
  url: string;
  artwork: string | null;
  artist?: string | null;
  duration?: string | null;
}

@Component({
  selector: 'app-admin-playlist',
  templateUrl: './admin-playlist.component.html',
  styleUrls: ['./admin-playlist.component.scss'],
})
export class AdminPlaylistComponent implements OnInit {
  playlists: any[] = [];
  duePage!: number;
  total!: number;
  searchInput: string = '';

  selectedPlaylist: any;
  isDrawerOpen = false;
  state = false;
  editForm: FormGroup;

  isGalleryOpen = false;
  galleryItems: AudioGalleryItem[] = [];
  isGalleryLoading = false;
  galleryError: string | null = null;
  gallerySearch = '';
  galleryPage = 1;
  selectedAudios: AudioGalleryItem[] = [];

  private previewAudio: HTMLAudioElement | null = null;
  previewingTrackId: number | null = null;

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    private helper: HelperService
  ) {
    this.editForm = this.fb.group({
      name: [null, Validators.required],
      icon: [null, Validators.required],
      status: [1],
    });
  }

  ngOnInit(): void {
    this.getAllPlaylists();
    this.loadGalleryAudios();
  }

  async getAllPlaylists() {
    try {
      const res: any = await this.http.get('/get_all_playlists', true).toPromise();
      const data = res?.data || res?.adminPlaylist || [];
      this.playlists = Array.isArray(data) ? data : [];
      this.total = this.playlists.length;
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  }

  open(state: 'add' | 'edit') {
    this.isDrawerOpen = true;
    this.state = state === 'edit';

    if (this.state && this.selectedPlaylist) {
      const { id, name, icon, audios, status } = this.selectedPlaylist;
      if (!this.editForm.contains('id')) {
        this.editForm.addControl('id', new FormControl(id));
      }
      this.editForm.patchValue({
        name,
        icon,
        status,
      });
      this.selectedAudios = Array.isArray(audios)
        ? audios.map((a: any) => ({
            id: a.id,
            title: a.title,
            url: a.url || a.file, 
            artwork: a.artwork || null,
            artist: a.artist ?? null,
            duration: a.duration ? String(a.duration) : null,
          }))
        : [];
    } else {
      this.selectedAudios = [];
    }
  }

  proceed() {
    this.isDrawerOpen = false;
    this.editForm.reset({ status: 1 });
    if (this.editForm.contains('id')) {
      this.editForm.removeControl('id');
    }
    this.state = false;
    this.selectedPlaylist = null;
    this.selectedAudios = [];
  }

  onIconSelected(event: any) {
    this.helper
      .fileUploadHttp(event)
      .then((result: any) => {
        this.editForm.patchValue({ icon: result.image_url });
      })
      .catch((error) => console.error(error));
  }

  async loadGalleryAudios(): Promise<void> {
    this.isGalleryLoading = true;
    this.galleryError = null;
    try {
      const res: any = await this.http.get('/get_all_audios', true).toPromise();
      const musics = res?.musics || res?.data || [];
      this.galleryItems = Array.isArray(musics)
        ? musics.map((m: any) => ({
            id: m.id,
            title: m.title,
            url: m.url,
            artwork: m.artwork || m.music_image || null,
            artist: m.artist ?? null,
            duration: m.duration ? String(m.duration) : null,
          }))
        : [];
    } catch (error) {
      console.error('Error loading gallery audios:', error);
      this.galleryError = 'Unable to load audios.';
    } finally {
      this.isGalleryLoading = false;
    }
  }

  openGallery(): void {
    this.isGalleryOpen = true;
  }

  closeGallery(): void {
    if (this.previewAudio) {
      this.previewAudio.pause();
      this.previewAudio = null;
      this.previewingTrackId = null;
    }
    this.isGalleryOpen = false;
  }

  selectFromGallery(item: AudioGalleryItem): void {
    const exists = this.selectedAudios.some((a) => a.id === item.id);
    if (exists) {
      this.selectedAudios = this.selectedAudios.filter((a) => a.id !== item.id);
    } else {
      this.selectedAudios = [...this.selectedAudios, item];
    }
  }

  removeFromSelection(id: number): void {
    this.selectedAudios = this.selectedAudios.filter((a) => a.id !== id);
  }

  isSelected(item: AudioGalleryItem): boolean {
    return this.selectedAudios.some((a) => a.id === item.id);
  }

  togglePreview(item: AudioGalleryItem, event: Event): void {
    event.stopPropagation();

    if (this.previewAudio && this.previewingTrackId === item.id) {
      if (this.previewAudio.paused) {
        this.previewAudio.play();
      } else {
        this.previewAudio.pause();
      }
      return;
    }

    if (this.previewAudio) {
      this.previewAudio.pause();
      this.previewAudio = null;
    }

    this.previewingTrackId = item.id;
    this.previewAudio = new Audio(item.url);
    this.previewAudio.play().catch((err) => {
      console.error('Error playing preview audio:', err);
      this.previewingTrackId = null;
      this.previewAudio = null;
    });
  }

  isPlaying(item: AudioGalleryItem): boolean {
    return !!this.previewAudio && this.previewingTrackId === item.id && !this.previewAudio.paused;
  }


  save() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.editForm.value,
      audios: this.selectedAudios.map((track) => ({
        title: track.title,
        file: track.url,
        artwork: track.artwork ?? '',
      })),
    };

    this.http.post('/create_admin_playlist', formData, true).subscribe({
      next: () => {
        this.proceed();
        this.getAllPlaylists();
      },
    });
  }

  deletePlaylist(id: any) {
    Swal.fire({
      title: "Delete Playlist?",
      text: "This action will permanently remove the playlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`/delete-playlist/${id}`, {}, true).subscribe({
          next: () => {
            this.getAllPlaylists();
            Swal.fire("Deleted!", "Playlist has been deleted.", "success");
          },
        });
      }
    });
  }
}

