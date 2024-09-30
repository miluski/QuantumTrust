import { Injectable } from '@angular/core';

/**
 * @fileoverview PaginationService manages the pagination of arrays.
 * It provides functionalities to paginate arrays, handle page changes, and adjust items per page based on screen width.
 *
 * @service
 * @providedIn root
 *
 * @class PaginationService
 * @property {any[]} paginatedArray - The array to be paginated.
 * @property {number} itemsPerPage - The number of items per page.
 * @property {number} currentPage - The current page number.
 * @property {number} totalPages - The total number of pages.
 * @property {number} largeBreakpointItemsPerPage - The number of items per page for large breakpoints.
 * @property {string} paginationMethod - The method of pagination ('default' or custom).
 *
 * @method onResize - Handles the resize event to adjust items per page based on screen width.
 * @param {UIEvent} event - The resize event.
 * @param {number} mediumBreakpointItems - The number of items per page for medium breakpoints.
 * @param {number} maximumBreakpointItems - The number of items per page for maximum breakpoints.
 * @method handleWidthChange - Handles the change in screen width to update items per page and total pages.
 * @param {number} width - The current screen width.
 * @param {number} mediumBreakpointItems - The number of items per page for medium breakpoints.
 * @param {number} maximumBreakpointItems - The number of items per page for maximum breakpoints.
 * @method setPaginatedArray - Sets the array to be paginated.
 * @param {any[]} paginatedArray - The array to be paginated.
 * @method setLargeBreakpointItemsPerPage - Sets the number of items per page for large breakpoints.
 * @param {number} largeBreakpointItemsPerPage - The number of items per page for large breakpoints.
 * @method setCurrentPage - Sets the current page number.
 * @param {number} currentPage - The current page number.
 * @method previousPage - Moves to the previous page.
 * @method nextPage - Moves to the next page.
 * @method get paginatedItems - Returns the items for the current page.
 * @returns {any[]} - The items for the current page.
 * @method moveArrayBackward - Moves the array backward by one element.
 * @method moveArrayForward - Moves the array forward by one element.
 * @method updateItemsPerPage - Updates the number of items per page based on screen width.
 * @param {number} width - The current screen width.
 * @param {number} mediumBreakpointItems - The number of items per page for medium breakpoints.
 * @param {number} maximumBreakpointItems - The number of items per page for maximum breakpoints.
 * @method updatePagesCount - Updates the total number of pages based on the length of the array and items per page.
 */
@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  public paginatedArray!: any[];
  public itemsPerPage: number = 3;
  public currentPage: number = 1;
  public totalPages: number = 1;
  public largeBreakpointItemsPerPage: number = 3;
  public paginationMethod: string = 'default';
  onResize(
    event: UIEvent,
    mediumBreakpointItems: number = 2,
    maximumBreakpointItems: number = 4
  ): void {
    const target = event.target as Window | null;
    if (target) {
      this.handleWidthChange(
        target.innerWidth,
        mediumBreakpointItems,
        maximumBreakpointItems
      );
    }
  }
  handleWidthChange(
    width: number,
    mediumBreakpointItems: number = 2,
    maximumBreakpointItems: number = 4
  ): void {
    this.updateItemsPerPage(
      width,
      mediumBreakpointItems,
      maximumBreakpointItems
    );
    this.updatePagesCount();
  }
  setPaginatedArray(paginatedArray: any[]): void {
    this.paginatedArray = [...paginatedArray];
  }
  setLargeBreakpointItemsPerPage(largeBreakpointItemsPerPage: number): void {
    this.largeBreakpointItemsPerPage = largeBreakpointItemsPerPage;
  }
  setCurrentPage(currentPage: number): void {
    this.currentPage = currentPage;
  }
  previousPage(): void {
    if (this.paginationMethod !== 'default') {
      this.moveArrayBackward();
    } else {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
  nextPage(): void {
    if (this.paginationMethod !== 'default') {
      this.moveArrayForward();
    } else {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return (
      this.paginatedArray && this.paginatedArray.slice(startIndex, endIndex)
    );
  }
  public updateItemsPerPage(
    width: number,
    mediumBreakpointItems: number,
    maximumBreakpointItems: number
  ) {
    if (width < 1024) {
      this.itemsPerPage = 1;
    } else if (width > 1400 && width < 1600) {
      this.itemsPerPage = 3;
    } else if (width >= 1600 && width < 2100) {
      this.itemsPerPage = this.largeBreakpointItemsPerPage;
    } else if (width >= 2100) {
      this.itemsPerPage = maximumBreakpointItems;
    } else {
      this.itemsPerPage = mediumBreakpointItems;
    }
  }
  public updatePagesCount(): void {
    this.totalPages = Math.ceil(this.paginatedArray.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }
  private moveArrayBackward(): void {
    if (this.paginatedArray.length > 1) {
      const lastElement = this.paginatedArray.pop();
      this.paginatedArray.unshift(lastElement);
    }
  }
  private moveArrayForward(): void {
    if (this.paginatedArray.length > 1) {
      const firstElement = this.paginatedArray.shift();
      this.paginatedArray.push(firstElement);
    }
  }
}
