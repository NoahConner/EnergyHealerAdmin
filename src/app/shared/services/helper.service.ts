import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable } from "rxjs";
import { Socket, io } from "socket.io-client";
import { HttpService } from "./http.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  token = new BehaviorSubject(undefined);

  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) {}

  uploadAudio(event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("audio", file);
        this.http.post("/upload-audio", formData, true).subscribe(
          (response: any) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject("No file selected");
      }
    });
  }

  fileUploadHttp(event: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const formData = new FormData();
                  formData.append("image", blob, "image.webp");
                  this.http.post("/upload-image", formData, true).subscribe(
                    (response: any) => {
                      resolve(response);
                    },
                    (error) => {
                      reject(error);
                    }
                  );
                } else {
                  reject("Failed to process image");
                }
              },
              "image/webp",
              0.8
            );
          }
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
