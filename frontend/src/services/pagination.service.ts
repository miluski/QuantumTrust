import { Injectable } from '@angular/core';

/**
 * @class PaginationService
 * @description This service is responsible for managing pagination of items.
 *
 * @providedIn 'root'
 *
 * @property {number} totalPages - The total number of pages.
 * @property {number} currentPage - The current page number.
 * @property {number} itemsPerPage - The number of items per page.
 * @property {any[]} paginatedArray - The array of items to be paginated.
 * @property {string} paginationMethod - The method of pagination ('default' or 'movableItems').
 * @property {number} largeBreakpointItemsPerPage - The number of items per page for large breakpoints.
 *
 * @constructor
 *
 * @method onResize - Handles the window resize event to adjust pagination.
 * @param {UIEvent} event - The resize event.
 * @param {number} mediumBreakpointItems - The number of items per page for medium breakpoints.
 * @param {number} maximumBreakpointItems - The number of items per page for maximum breakpoints.
 * @method handleWidthChange - Handles the width change to update items per page and pages count.
 * @param {number} width - The width of the window.
 * @param {number} mediumBreakpointItems - The number of items per page for medium breakpoints.
 * @param {number} maximumBreakpointItems - The number of items per page for maximum breakpoints.
 * @method setPaginatedArray - Sets the array of items to be paginated.
 * @param {any[]} paginatedArray - The array of items to be paginated.
 * @method setLargeBreakpointItemsPerPage - Sets the number of items per page for large breakpoints.
 * @param {number} largeBreakpointItemsPerPage - The number of items per page for large breakpoints.
 * @method setCurrentPage - Sets the current page number.
 * @param {number} currentPage - The current page number.
 * @method previousPage - Moves to the previous page.
 * @method nextPage - Moves to the next page.
 * @method updateItemsPerPage - Updates the number of items per page based on the window width.
 * @param {number} width - The width of the window.
 * @param {number} mediumBreakpointItems - The number of items per page for medium breakpoints.
 * @param {number} maximumBreakpointItems - The number of items per page for maximum breakpoints.
 * @method updatePagesCount - Updates the total number of pages based on the items per page.
 * @method paginatedItems - Getter method to get the paginated items for the current page.
 * @returns {any[]} - Returns the paginated items for the current page.
 * @method moveArrayBackward - Moves the array of items backward by one position.
 * @method moveArrayForward - Moves the array of items forward by one position.
 */
@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  public totalPages: number;
  public currentPage: number;
  public itemsPerPage: number;
  public paginatedArray!: any[];
  public paginationMethod: string;
  public largeBreakpointItemsPerPage: number;

  constructor() {
    this.totalPages = 1;
    this.currentPage = 1;
    this.itemsPerPage = 3;
    this.paginationMethod = 'default';
    this.largeBreakpointItemsPerPage = 3;
  }

  public onResize(
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

  public handleWidthChange(
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

  public setPaginatedArray(paginatedArray: any[]): void {
    this.paginatedArray = [...paginatedArray];
  }

  public setLargeBreakpointItemsPerPage(
    largeBreakpointItemsPerPage: number
  ): void {
    this.largeBreakpointItemsPerPage = largeBreakpointItemsPerPage;
  }

  public setCurrentPage(currentPage: number): void {
    this.currentPage = currentPage;
  }

  public previousPage(): void {
    if (this.paginationMethod !== 'default') {
      this.moveArrayBackward();
    } else {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }

  public nextPage(): void {
    if (this.paginationMethod !== 'default') {
      this.moveArrayForward();
    } else {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
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
    if (this.paginatedArray) {
      this.totalPages = Math.ceil(
        this.paginatedArray.length / this.itemsPerPage
      );
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }
    }
  }

  public get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return (
      this.paginatedArray && this.paginatedArray.slice(startIndex, endIndex)
    );
  }

  private moveArrayBackward(): void {
    if (this.paginatedArray && this.paginatedArray.length > 1) {
      const lastElement = this.paginatedArray.pop();
      this.paginatedArray.unshift(lastElement);
    }
  }

  private moveArrayForward(): void {
    if (this.paginatedArray && this.paginatedArray.length > 1) {
      const firstElement = this.paginatedArray.shift();
      this.paginatedArray.push(firstElement);
    }
  }
}
