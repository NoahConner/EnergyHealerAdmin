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

  fileUploadHttp(event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const file = event.target.files[0];
      if (!file) {
        reject("No file selected");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
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
            const supportedTypes = ["image/png", "image/jpeg", "image/webp"];
            const outputType = supportedTypes.includes(file.type)
              ? file.type
              : "image/jpeg";
            const extension = outputType.split("/")[1] || "jpg";
            const outputFileName = file.name.replace(/\.[^/.]+$/, "") + "." + extension;

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const formData = new FormData();
                  formData.append("image", blob, outputFileName);
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
              outputType,
              outputType === "image/png" ? undefined : 0.8
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
