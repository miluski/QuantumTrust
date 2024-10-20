import { Component, Input } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';

/**
 * @component ImageComponent
 *
 * @description
 * A standalone Angular component for rendering an image with various input properties and animations.
 *
 * @selector app-image
 *
 * @inputs
 * - `src: string` - The source URL of the image.
 * - `alt: string` - The alternative text for the image.
 * - `classString: string` - The CSS class to apply to the image.
 * - `click: () => void` - The click event handler for the image.
 * - `ngClass: Record<string, any>` - The dynamic classes to apply to the image.
 *
 * @properties
 * - `isLoaded: boolean` - A private property indicating whether the image has loaded.
 *
 * @getters
 * - `canRender: boolean` - A getter that returns whether the image can be rendered based on its load state.
 *
 * @methods
 * - `onload(): void` - A method to set the image as loaded.
 * - `onerror(): void` - A method to set the image as not loaded in case of an error.
 */
@Component({
  selector: 'app-image',
  animations: [AnimationsProvider.animations],
  templateUrl: './image.component.html',
})
export class ImageComponent {
  @Input() src!: string;
  @Input() alt!: string;
  @Input() class!: string;
  @Input() click!: () => void;
  @Input() error!: void;
  @Input() ngClass!: Record<string, any>;
  private isLoaded: boolean = false;
  get canRender(): boolean {
    return this.isLoaded;
  }
  onload(): void {
    this.isLoaded = true;
  }
  onerror(): void {
    this.error;
    this.isLoaded = false;
  }
}
