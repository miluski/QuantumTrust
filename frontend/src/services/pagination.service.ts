import { Injectable } from '@angular/core';

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
  onResize(event: UIEvent, mediumBreakpointItems: number = 2, maximumBreakpointItems: number = 4): void {
    const target = event.target as Window | null;
    if (target) {
      this.handleWidthChange(target.innerWidth, mediumBreakpointItems, maximumBreakpointItems);
    }
  }
  handleWidthChange(width: number, mediumBreakpointItems: number = 2, maximumBreakpointItems: number = 4): void {
    this.updateItemsPerPage(width, mediumBreakpointItems, maximumBreakpointItems);
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
    return this.paginatedArray && this.paginatedArray.slice(startIndex, endIndex);
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
  private updateItemsPerPage(width: number, mediumBreakpointItems: number, maximumBreakpointItems: number) {
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
  private updatePagesCount(): void {
    this.totalPages = Math.ceil(this.paginatedArray.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }
}
