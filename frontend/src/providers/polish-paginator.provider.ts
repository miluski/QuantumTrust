import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/**
 * @fileoverview Provides a custom paginator implementation for Angular Material
 *               with Polish translations for pagination labels.
 * 
 * @classdesc PolishPaginatorProvider extends MatPaginatorIntl to provide
 *            Polish translations for pagination labels used in Angular Material.
 *
 * @extends MatPaginatorIntl
 *
 * @example
 * // Import the provider in your Angular module
 * import { PolishPaginatorProvider } from './providers/polish-paginator.provider';
 *
 * @Injectable({
 *   providedIn: 'root',
 * })
 * export class AppModule { }
 *
 * @description This provider overrides the default pagination labels with Polish
 *              translations and customizes the range label format.
 *
 * @property {string} itemsPerPageLabel - Label for the items per page dropdown.
 * @property {string} nextPageLabel - Label for the next page button.
 * @property {string} previousPageLabel - Label for the previous page button.
 * @property {string} firstPageLabel - Label for the first page button.
 * @property {string} lastPageLabel - Label for the last page button.
 * @method getRangeLabel - Custom function to generate the range label for the paginator.
 *
 * @param {number} page - The current page number.
 * @param {number} pageSize - The number of items per page.
 * @param {number} length - The total number of items.
 * @returns {string} The formatted range label.
 */
@Injectable({
  providedIn: 'root',
})
export class PolishPaginatorProvider extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementów na stronę';
  override nextPageLabel = 'Następna strona';
  override previousPageLabel = 'Poprzednia strona';
  override firstPageLabel = 'Pierwsza strona';
  override lastPageLabel = 'Ostatnia strona';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 z ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} z ${length}`;
  };
}
