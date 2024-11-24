import { Component, Input } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { MediaService } from '../../services/media.service';

/**
 * @component ImageComponent
 * @description This component is responsible for displaying an image with various input properties and animations.
 *
 * @selector app-image
 * @templateUrl ./image.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class ImageComponent
 *
 * @property {string} src - The source URL of the image.
 * @property {string} alt - The alternative text for the image.
 * @property {string} ownClass - The custom class for the image.
 * @property {Function} click - The click event handler for the image.
 * @property {Function} error - The error event handler for the image.
 * @property {Record<string, any>} ngClass - The ngClass directive for the image.
 * @property {boolean} isLoaded - Flag indicating if the image is loaded.
 *
 * @constructor
 * @param {MediaService} mediaService - Service to manage media-related operations.
 *
 * @method onload - Event handler for the image load event. Sets the isLoaded flag to true.
 * @method onerror - Event handler for the image error event. Calls the error handler and sets the isLoaded flag to false.
 * @method canRender - Getter method to determine if the image can be rendered.
 * @returns {boolean} - Returns true if the image can be rendered, otherwise false.
 */
@Component({
  selector: 'app-image',
  animations: [AnimationsProvider.animations],
  templateUrl: './image.component.html',
})
export class ImageComponent {
  @Input() src!: string;
  @Input() alt!: string;
  @Input() ownClass!: string;
  @Input() click!: () => void;
  @Input() error!: void;
  @Input() ngClass!: Record<string, any>;

  private isLoaded: boolean;

  constructor(protected mediaService: MediaService) {
    this.isLoaded = false;
  }

  public onload(): void {
    this.isLoaded = true;
  }

  public onerror(): void {
    this.error;
    this.isLoaded = false;
  }

  get canRender(): boolean {
    return (
      this.mediaService.getPhotoUrl(this.src) !== 'PHOTO_LOADING_SKELETON' ||
      this.isLoaded
    );
  }
}
