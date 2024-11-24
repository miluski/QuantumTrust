import { TestBed } from '@angular/core/testing';

import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set paginated array', () => {
    const array = [1, 2, 3, 4, 5];
    service.setPaginatedArray(array);
    expect(service.paginatedArray).toEqual(array);
  });

  it('should set large breakpoint items per page', () => {
    service.setLargeBreakpointItemsPerPage(5);
    expect(service.largeBreakpointItemsPerPage).toBe(5);
  });

  it('should set current page', () => {
    service.setCurrentPage(2);
    expect(service.currentPage).toBe(2);
  });

  it('should move to the previous page', () => {
    service.setCurrentPage(2);
    service.previousPage();
    expect(service.currentPage).toBe(1);
  });

  it('should not move to the previous page if on the first page', () => {
    service.setCurrentPage(1);
    service.previousPage();
    expect(service.currentPage).toBe(1);
  });

  it('should move to the next page and not exceed the totalPages limit', () => {
    service.setPaginatedArray([1, 2, 3, 4, 5, 6]);
    service.setCurrentPage(1);
    service.nextPage();
    expect(service.currentPage).toBe(1);
  });

  it('should not move to the next page if on the last page', () => {
    service.setPaginatedArray([1, 2, 3]);
    service.setCurrentPage(1);
    service.nextPage();
    expect(service.currentPage).toBe(1);
  });

  it('should return paginated items', () => {
    service.setPaginatedArray([1, 2, 3, 4, 5, 6]);
    service.setCurrentPage(1);
    expect(service.paginatedItems).toEqual([1, 2, 3]);
  });

  it('should update items per page based on screen width', () => {
    service.updateItemsPerPage(800, 2, 4);
    expect(service.itemsPerPage).toBe(1);
    service.updateItemsPerPage(1500, 2, 4);
    expect(service.itemsPerPage).toBe(3);
    service.updateItemsPerPage(1700, 2, 4);
    expect(service.itemsPerPage).toBe(service.largeBreakpointItemsPerPage);
    service.updateItemsPerPage(2200, 2, 4);
    expect(service.itemsPerPage).toBe(4);
  });

  it('should update total pages count', () => {
    service.setPaginatedArray([1, 2, 3, 4, 5, 6]);
    service.updatePagesCount();
    expect(service.totalPages).toBe(2);
  });

  it('should handle width change', () => {
    service.setPaginatedArray([1, 2, 3, 4, 5, 6]);
    service.handleWidthChange(1500, 2, 4);
    expect(service.itemsPerPage).toBe(3);
    expect(service.totalPages).toBe(2);
  });

  it('should handle resize event', () => {
    const event = new UIEvent('resize', { view: window });
    spyOnProperty(window, 'innerWidth').and.returnValue(1500);
    service.onResize(event);
    expect(service.itemsPerPage).toBe(3);
  });
});
