import { Component, PLATFORM_ID, Inject, ChangeDetectorRef } from "@angular/core";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { map, delay, withLatestFrom } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';
import { LoaderService } from "./shared/services/loader.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {


  loaders = this.loader.progress$.pipe(
    delay(1000),
    withLatestFrom(this.loader.progress$),
    map((v) => v[1])
  );
  public show: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private loader: LoadingBarService,
    private cd: ChangeDetectorRef,
  ) { }








  async observe() {
    LoaderService.loader.subscribe((res: any) => {
      this.show = res;
      if (this.show == true) {
        this.document.body.classList.add('bodyLoader');
      } else {
        this.document.body.classList.remove('bodyLoader');
      }
      this.cd.detectChanges();
    });


  }


}
