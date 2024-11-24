import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';
import { SingleCardComponent } from './single-card.component';
import { SingleCardModule } from './single-card.module';
import { provideHttpClient } from '@angular/common/http';

describe('SingleCardComponent', () => {
  let component: SingleCardComponent;
  let fixture: ComponentFixture<SingleCardComponent>;
  let productTypesService: jasmine.SpyObj<ProductTypesService>;

  beforeEach(async () => {
    const productTypesServiceSpy = jasmine.createSpyObj('ProductTypesService', [
      'changeCardType',
    ]);
    const paginationServiceSpy = jasmine.createSpyObj('PaginationService', [
      'onResize',
      'setPaginatedArray',
      'handleWidthChange',
    ]);
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'convert',
      'getPolishAccountType',
    ]);
    productTypesServiceSpy.currentAccountType = of(
      'business'
    ) as Observable<string>;
    productTypesServiceSpy.currentCardType = of('premium');
    productTypesServiceSpy.currentDepositType = of('instant');
    const appInformationStatesServiceSpy = jasmine.createSpyObj(
      'AppInformationStatesService',
      [
        'changeTabName',
        'changeTransactionsArrayLength',
        'observeBreakpoints',
        'changeDrawer',
      ]
    );
    appInformationStatesServiceSpy.currentTabName = of(
      'SingleAccountTransactions'
    );
    appInformationStatesServiceSpy.currentTransactionsArrayLength = of(25);

    await TestBed.configureTestingModule({
      imports: [SingleCardModule, BrowserAnimationsModule],
      providers: [
        { provide: ProductTypesService, useValue: productTypesServiceSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesServiceSpy,
        },
        { provide: ActivatedRoute, useValue: {} },
        provideHttpClient()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleCardComponent);
    component = fixture.componentInstance;
    productTypesService = TestBed.inject(
      ProductTypesService
    ) as jasmine.SpyObj<ProductTypesService>;

    spyOn<any>(component, 'getVisaCardObject').and.returnValue({
      id: 1,
      type: 'STANDARD',
      description:
        'Idealna karta do zakupów z programem lojalnościowym i ubezpieczeniami.',
      image: 'visa-standard.webp',
      publisher: 'Visa',
      benefits: [
        'Możliwość wygodnych płatności w ponad 200 krajach',
        'Wygodne płatności zbliżeniowe',
        'Dodatkowy poziom zabezpieczeń przy płatnościach online za pomocą technologii Verified by VISA',
        'Możliwość szybkiej wymiany i zastrzeżenia starej karty w przypadku jej zgubienia',
      ],
      limits: [
        { internetTransactions: [10000, 5], cashTransactions: [5000, 3] },
      ],
      backImage: 'visa-back.webp',
      showingCardSite: 'front',
      fees: {
        release: 0,
        monthly: 10,
      },
    });
    spyOn<any>(component, 'getMastercardObject').and.returnValue({
      id: 5,
      type: 'STANDARD',
      description:
        'Karta Mastercard z podstawowymi funkcjami płatniczymi i bezpieczeństwem.',
      image: 'mastercard-standard.webp',
      backImage: 'mastercard-standard-back.webp',
      benefits: [
        'Globalne wsparcie w przypadku awarii',
        'Unikalny program priceless cities dający dostęp do wyjątkowych wydarzeń i ofert na całym świecie',
        'Wygodne płatności zbliżeniowej dzięki technologii Tap & Go™',
        'Bezpieczeństwo transakcji online zapewnione za pomocą technologii Mastercard secure code',
      ],
      limits: [
        { internetTransactions: [10000, 5], cashTransactions: [5000, 3] },
      ],
      publisher: 'Mastercard',
      showingCardSite: 'front',
      fees: {
        release: 0,
        monthly: 10,
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fields on ngOnInit', () => {
    spyOn(component, 'initializeFields');
    component.ngOnInit();
    expect(component.initializeFields).toHaveBeenCalled();
  });

  it('should fetch Visa card object based on card type', () => {
    component['cardType'] = 'standard';
    const visaCard = component['getVisaCardObject']();
    expect(visaCard).toEqual(
      visaCardsObjectsArray.find((card) => card.type === 'STANDARD')!
    );
  });

  it('should fetch Mastercard object based on card type', () => {
    component['cardType'] = 'standard';
    const mastercard = component['getMastercardObject']();
    expect(mastercard).toEqual(
      mastercardCardsObjectsArray.find((card) => card.type === 'STANDARD')!
    );
  });

  it('should toggle the state of a question and answer pair', () => {
    component.questionsAndAnswersPairs = [
      { id: 0, content: 'Question 1', answer: 'Answer 1', isOpened: false },
      { id: 1, content: 'Question 2', answer: 'Answer 2', isOpened: false },
    ];
    component.changeStateOfQuestionAnswer(0);
    expect(component.questionsAndAnswersPairs[0].isOpened).toBeTrue();
    component.changeStateOfQuestionAnswer(0);
    expect(component.questionsAndAnswersPairs[0].isOpened).toBeFalse();
  });

  it('should change card type and update the service', () => {
    component.changeCardType('premium');
    expect(productTypesService.changeCardType).toHaveBeenCalledWith('premium');
  });

  it('should initialize fields correctly', () => {
    component['cardType'] = 'standard';
    component.initializeFields();
    expect(component.visaCardObject).toEqual(
      visaCardsObjectsArray.find((card) => card.type === 'STANDARD')!
    );
    expect(component.mastercardObject).toEqual(
      mastercardCardsObjectsArray.find((card) => card.type === 'STANDARD')!
    );
    expect(component.questionsAndAnswersPairs.length).toBe(3);
  });
});
