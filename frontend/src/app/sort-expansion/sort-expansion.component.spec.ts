import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { SortExpansionComponent } from './sort-expansion.component';

describe('SortExpansionComponent', () => {
  let component: SortExpansionComponent;
  let fixture: ComponentFixture<SortExpansionComponent>;
  let filtersService: FiltersService;
  let appInformationStatesService: AppInformationStatesService;
  beforeEach(async () => {
    const filtersServiceMock = {
      resetSelectedFilters: jasmine.createSpy('resetSelectedFilters'),
      currentExpansionFlagsArray: of([true]),
      actualSelectedFilters: ['Po dacie rosnąco'],
      setSelectedFilters: jasmine.createSpy('setSelectedFilters'),
    };
    const appInformationStatesServiceMock = {
      canSetAbsoluteStyle: jasmine.createSpy('canSetAbsoluteStyle'),
    };
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatRadioModule,
        SortExpansionComponent,
      ],
      providers: [
        { provide: FiltersService, useValue: filtersServiceMock },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SortExpansionComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    appInformationStatesService = TestBed.inject(AppInformationStatesService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with default values', () => {
    expect(component.isExpanded).toBeTrue();
    expect(component.options.length).toBe(5);
  });
  it('should update isExpanded based on currentExpansionFlagsArray', () => {
    component.ngOnInit();
    expect(component.isExpanded).toBeTrue();
  });
  it('should return "true" if the option is selected in isChecked method', () => {
    const result = component.isChecked('Po dacie rosnąco');
    expect(result).toBe('true');
  });
  it('should return "false" if the option is not selected in isChecked method', () => {
    const result = component.isChecked('Po dacie malejąco');
    expect(result).toBe('false');
  });
  it('should change the selected option in changeCheckedOption method', () => {
    component.changeCheckedOption('Po dacie malejąco');
    expect(filtersService.setSelectedFilters).toHaveBeenCalledWith([
      'Po dacie malejąco',
    ]);
  });
});
