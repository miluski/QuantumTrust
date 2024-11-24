import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { CardListComponent } from './card-list.component';
import { CardListModule } from './card-list.module';

describe('CardListComponent', () => {
  let component: CardListComponent;
  let fixture: ComponentFixture<CardListComponent>;
  let productTypesService: ProductTypesService;
  let visaCardsPaginationService: PaginationService;
  let masterCardsPaginationService: PaginationService;

  beforeEach(async () => {
    const productTypesServiceMock = {
      currentCardType: of('standard'),
      changeCardType: jasmine.createSpy('changeCardType'),
    };

    await TestBed.configureTestingModule({
      imports: [CardListModule],
      providers: [
        { provide: ProductTypesService, useValue: productTypesServiceMock },
        { provide: PaginationService, useClass: PaginationService },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardListComponent);
    component = fixture.componentInstance;
    productTypesService = TestBed.inject(ProductTypesService);
    visaCardsPaginationService = component.visaCardsPaginationService;
    masterCardsPaginationService = component.masterCardsPaginationService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.cardType).toBe('standard');
  });

  it('should subscribe to currentCardType on init', () => {
    spyOn(productTypesService.currentCardType, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(productTypesService.currentCardType.subscribe).toHaveBeenCalled();
  });

  it('should set paginated arrays on init', () => {
    spyOn(visaCardsPaginationService, 'setPaginatedArray');
    spyOn(masterCardsPaginationService, 'setPaginatedArray');
    component.ngOnInit();
    expect(visaCardsPaginationService.setPaginatedArray).toHaveBeenCalled();
    expect(masterCardsPaginationService.setPaginatedArray).toHaveBeenCalled();
  });

  it('should handle width change on init', () => {
    spyOn(visaCardsPaginationService, 'handleWidthChange');
    spyOn(masterCardsPaginationService, 'handleWidthChange');
    component.ngOnInit();
    expect(visaCardsPaginationService.handleWidthChange).toHaveBeenCalledWith(
      window.innerWidth
    );
    expect(masterCardsPaginationService.handleWidthChange).toHaveBeenCalledWith(
      window.innerWidth
    );
  });

  it('should call onResize on window resize', () => {
    spyOn(visaCardsPaginationService, 'onResize');
    spyOn(masterCardsPaginationService, 'onResize');
    const event = new UIEvent('resize');
    component.onResize(event);
    expect(visaCardsPaginationService.onResize).toHaveBeenCalledWith(event);
    expect(masterCardsPaginationService.onResize).toHaveBeenCalledWith(event);
  });

  it('should change card type', () => {
    const newCardType = 'premium';
    component.changeCardType(newCardType);
    expect(productTypesService.changeCardType).toHaveBeenCalledWith(
      newCardType
    );
  });
});
