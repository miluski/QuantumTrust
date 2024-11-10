import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton } from '@angular/material/radio';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { DurationExpansionComponent } from './duration-expansion.component';
import { DurationExpansionModule } from './duration-expansion.module';

describe('DurationExpansionComponent', () => {
  let component: DurationExpansionComponent;
  let fixture: ComponentFixture<DurationExpansionComponent>;
  let filtersService: FiltersService;
  let appInformationStatesService: AppInformationStatesService;
  beforeEach(async () => {
    const filtersServiceMock = {
      resetSelectedFilters: jasmine.createSpy('resetSelectedFilters'),
      currentExpansionFlagsArray: of([false, true]),
      actualSelectedFilters: ['Domyślnie', 'Ostatni tydzień'],
      setSelectedFilters: jasmine.createSpy('setSelectedFilters'),
    };
    const appInformationStatesServiceMock = jasmine.createSpyObj(
      'AppInformationService',
      ['canSetAbsoluteStyle']
    );
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatExpansionModule,
        MatRadioButton,
        DurationExpansionModule,
      ],
      providers: [
        { provide: FiltersService, useValue: filtersServiceMock },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DurationExpansionComponent);
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
    expect(component.options.length).toBe(6);
  });
  it('should check if an option is selected', () => {
    expect(component.isChecked('Ostatni tydzień')).toBe('true');
    expect(component.isChecked('Ostatni miesiąc')).toBe('false');
  });
  it('should change the selected option', () => {
    component.changeCheckedOption('Ostatni miesiąc');
    expect(filtersService.setSelectedFilters).toHaveBeenCalledWith([
      'Domyślnie',
      'Ostatni miesiąc',
    ]);
  });
});
