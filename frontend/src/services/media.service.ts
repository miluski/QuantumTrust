import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment.development';

/**
 * @service MediaService
 * @description This service provides methods for handling media-related operations, such as retrieving photo URLs.
 *
 * @class MediaService
 *
 * @constructor
 * @param {Object} platformId - The platform ID for checking if the platform is a server.
 *
 * @method getPhotoUrl - Retrieves the URL of a photo.
 * @param {string} photoName - The name of the photo.
 * @returns {string} - Returns the URL of the photo.
 */
@Injectable({
  providedIn: 'root',
})
export class MediaService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public getPhotoUrl(photoName: string): string {
    if (isPlatformServer(this.platformId)) {
      return 'PHOTO_LOADING_SKELETON';
    }
    return `${environment.apiUrl}/media/public/${photoName}`;
  }

}
