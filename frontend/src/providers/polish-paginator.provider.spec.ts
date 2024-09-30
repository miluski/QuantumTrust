import { TestBed } from '@angular/core/testing';
import { PolishPaginatorProvider } from './polish-paginator.provider';

describe('PolishPaginatorProvider', () => {
  let paginator: PolishPaginatorProvider;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolishPaginatorProvider],
    });
    paginator = TestBed.inject(PolishPaginatorProvider);
  });
  it('should be created', () => {
    expect(paginator).toBeTruthy();
  });
  it('should have Polish labels', () => {
    expect(paginator.itemsPerPageLabel).toBe('Elementów na stronę');
    expect(paginator.nextPageLabel).toBe('Następna strona');
    expect(paginator.previousPageLabel).toBe('Poprzednia strona');
    expect(paginator.firstPageLabel).toBe('Pierwsza strona');
    expect(paginator.lastPageLabel).toBe('Ostatnia strona');
  });
  it('should return correct range label when length is 0', () => {
    const label = paginator.getRangeLabel(0, 10, 0);
    expect(label).toBe('0 z 0');
  });
  it('should return correct range label when pageSize is 0', () => {
    const label = paginator.getRangeLabel(0, 0, 100);
    expect(label).toBe('0 z 100');
  });
  it('should return correct range label for first page', () => {
    const label = paginator.getRangeLabel(0, 10, 100);
    expect(label).toBe('1 - 10 z 100');
  });
  it('should return correct range label for middle page', () => {
    const label = paginator.getRangeLabel(1, 10, 100);
    expect(label).toBe('11 - 20 z 100');
  });
  it('should return correct range label for last page', () => {
    const label = paginator.getRangeLabel(9, 10, 95);
    expect(label).toBe('91 - 95 z 95');
  });
  it('should return correct range label when endIndex exceeds length', () => {
    const label = paginator.getRangeLabel(9, 10, 98);
    expect(label).toBe('91 - 98 z 98');
  });
});
