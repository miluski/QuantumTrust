import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FiltersService } from '../../services/filters.service';
import { DepositListModule } from '../deposit-list/deposit-list.module';
import { DurationExpansionModule } from '../duration-expansion/duration-expansion.module';
import { SortExpansionModule } from '../sort-expansion/sort-expansion.module';
import { StatusExpansionModule } from '../status-expansion/status-expansion.module';
import { MobileFiltersComponent } from './mobile-filters.component';
import { MobileFiltersModule } from './mobile-filters.module';

describe('MobileFiltersComponent', () => {
  let component: MobileFiltersComponent;
  let fixture: ComponentFixture<MobileFiltersComponent>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let filtersService: jasmine.SpyObj<FiltersService>;
  beforeEach(async () => {
    breakpointObserver = jasmine.createSpyObj('BreakpointObserver', [
      'observe',
    ]);
    breakpointObserver.observe.and.returnValue(
      of({ matches: true } as BreakpointState)
    );
    filtersService = jasmine.createSpyObj(
      'FiltersService',
      [
        'setIsMobileFiltersOpened',
        'resetSelectedFilters',
        'setSelectedFilters',
      ],
      {
        currentIsMobileFiltersOpened: of(true),
        currentExpansionFlagsArray: of([false]),
        actualSelectedFilters: ['Domyślnie'],
      }
    );
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SortExpansionModule,
        DurationExpansionModule,
        StatusExpansionModule,
        DepositListModule,
        MobileFiltersModule,
      ],
      providers: [
        { provide: BreakpointObserver, useValue: breakpointObserver },
        { provide: FiltersService, useValue: filtersService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MobileFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with isOpened set to true', () => {
    fixture.detectChanges();
    expect(component.isOpened).toBeTrue();
  });
  it('should subscribe to filter state changes on init', () => {
    filtersService.currentIsMobileFiltersOpened = of(true);
    fixture.detectChanges();
    expect(component.isOpened).toBeTrue();
  });
  it('should observe breakpoints and update filter state accordingly', () => {
    const breakpointState: BreakpointState = { matches: true, breakpoints: {} };
    breakpointObserver.observe.and.returnValue(of(breakpointState));
    fixture.detectChanges();
    expect(filtersService.setIsMobileFiltersOpened).toHaveBeenCalledWith(false);
  });
  it('should not update filter state if breakpoints do not match', () => {
    const breakpointState: BreakpointState = {
      matches: false,
      breakpoints: {},
    };
    breakpointObserver.observe.and.returnValue(of(breakpointState));
    fixture.detectChanges();
    expect(filtersService.setIsMobileFiltersOpened).toHaveBeenCalled();
  });
});
