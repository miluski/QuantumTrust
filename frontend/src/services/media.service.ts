import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getPhotoUrl(photoName: string): string {
    if (isPlatformServer(this.platformId)) {
      return 'PHOTO_LOADING_SKELETON';
    }
    return `${environment.apiUrl}/media/public/${photoName}`;
  }

}
