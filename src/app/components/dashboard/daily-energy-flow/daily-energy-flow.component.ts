import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "../../../shared/services/http.service";

interface AudioGalleryItem {
  id: number;
  title: string;
  url: string;
  artwork: string | null;
  artist?: string | null;
  duration?: string | null;
}

@Component({
  selector: "app-daily-energy-flow",
  templateUrl: "./daily-energy-flow.component.html",
  styleUrls: ["./daily-energy-flow.component.scss"],
})
export class DailyEnergyFlowComponent implements OnInit {
  dailyFlowForm: FormGroup;

  // Static audio gallery
  isGalleryOpen = false;
  selectedGalleryItems: AudioGalleryItem[] = [];
  galleryItems: AudioGalleryItem[] = [];
  isGalleryLoading = false;
  galleryError: string | null = null;
  gallerySearch: string = "";
  galleryPage: number = 1;
  flowId: number | null = null;

  // Audio preview state
  private previewAudio: HTMLAudioElement | null = null;
  previewingTrackId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpService) {
    this.dailyFlowForm = this.fb.group({
      heading: ["", [Validators.required, Validators.maxLength(120)]],
      description: ["", [Validators.required, Validators.maxLength(600)]],
    });
  }

  get f() {
    return this.dailyFlowForm.controls;
  }

  ngOnInit(): void {
    this.loadGalleryAudios();
    this.getDailyFlow();
  }

  async loadGalleryAudios(): Promise<void> {
    this.isGalleryLoading = true;
    this.galleryError = null;
    try {
      const res: any = await this.http.get("/get_all_audios", true).toPromise();
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
      console.error("Error loading gallery audios:", error);
      this.galleryError = "Unable to load audios.";
    } finally {
      this.isGalleryLoading = false;
    }
  }

  getDailyFlow(): void {
    this.http.get("/get_daily_flow", true).subscribe({
      next: (res: any) => {
        const data = res?.dailyEnergyFlow;

        if (data) {
          this.flowId = data.id;

          this.dailyFlowForm.patchValue({
            heading: data.heading,
            description: data.description,
          });

          this.selectedGalleryItems = (data.audio || []).map(
            (a: any, index: number) => ({
              id: index + 1,
              title: a.title,
              url: a.file,
              artwork: a.artwork,
            })
          );
        }
      },
      error: (err) => {
        console.error("Error fetching flow:", err);
      },
    });
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
    const exists = this.selectedGalleryItems.some((a) => a.id === item.id);
    if (exists) {
      this.selectedGalleryItems = this.selectedGalleryItems.filter(
        (a) => a.id !== item.id
      );
    } else {
      this.selectedGalleryItems = [...this.selectedGalleryItems, item];
    }
  }

  removeFromSelection(id: number): void {
    this.selectedGalleryItems = this.selectedGalleryItems.filter(
      (a) => a.id !== id
    );
  }

  isSelected(item: AudioGalleryItem): boolean {
    return this.selectedGalleryItems.some((a) => a.id === item.id);
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
      console.error("Error playing preview audio:", err);
      this.previewingTrackId = null;
      this.previewAudio = null;
    });
  }

  isPlaying(item: AudioGalleryItem): boolean {
    return (
      !!this.previewAudio &&
      this.previewingTrackId === item.id &&
      !this.previewAudio.paused
    );
  }

  saveDailyFlow(): void {
    if (this.dailyFlowForm.invalid) {
      this.dailyFlowForm.markAllAsTouched();
      return;
    }
    const formValue = this.dailyFlowForm.value;

    const payload: any = {
      heading: formValue.heading,
      description: formValue.description,
      audio: this.selectedGalleryItems.map((track) => ({
        title: track.title,
        file: track.url,
        artwork: track.artwork ?? null,
      })),
    };

    if (this.flowId) {
      payload.id = this.flowId;
    }

    this.http.post("/create_energy_flow", payload, true).subscribe({
      next: (res: any) => {
        console.log("Saved:", res);

        if (!this.flowId && res?.data?.id) {
          this.flowId = res.data.id;
        }
      },
      error: (err) => {
        console.error("Error:", err);
      },
    });
  }
}
