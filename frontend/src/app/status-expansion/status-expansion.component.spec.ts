import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton } from '@angular/material/radio';
import { of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { FiltersService } from '../../services/filters.service';
import { StatusExpansionComponent } from './status-expansion.component';
import { StatusExpansionModule } from './status-expansion.module';

describe('StatusExpansionComponent', () => {
  let component: StatusExpansionComponent;
  let fixture: ComponentFixture<StatusExpansionComponent>;
  let filtersService: FiltersService;
  let appInformationStatesService: AppInformationStatesService;

  beforeEach(async () => {
    const filtersServiceMock = {
      currentExpansionFlagsArray: of([false, false, true]),
      actualSelectedFilters: ['Blokada', 'Rozliczona', 'Domyślnie'],
      setSelectedFilters: jasmine.createSpy('setSelectedFilters'),
    };
    const appInformationStatesServiceMock = {
      canSetAbsoluteStyle: jasmine.createSpy('canSetAbsoluteStyle'),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatRadioButton,
        MatExpansionModule,
        StatusExpansionModule,
      ],
      providers: [
        { provide: FiltersService, useValue: filtersServiceMock },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusExpansionComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    appInformationStatesService = TestBed.inject(AppInformationStatesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(component.isExpanded).toBeTrue();
  });

  it('should return true if the option is selected', () => {
    expect(component.isChecked('Domyślnie')).toBe('true');
  });

  it('should return false if the option is not selected', () => {
    expect(component.isChecked('Blokada')).toBe('false');
  });

  it('should change the selected option', () => {
    component.changeCheckedOption('Blokada');
    expect(filtersService.setSelectedFilters).toHaveBeenCalledWith([
      'Blokada',
      'Rozliczona',
      'Blokada',
    ]);
  });
});
