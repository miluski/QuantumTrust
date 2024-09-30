import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { Card } from '../../types/card';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';
import { OrderCardComponent } from './order-card.component';

describe('OrderCardComponent', () => {
  let component: OrderCardComponent;
  let fixture: ComponentFixture<OrderCardComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let paginationService: jasmine.SpyObj<PaginationService>;
  let convertService: jasmine.SpyObj<ConvertService>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserAccountsArray',
    ]);
    const paginationServiceSpy = jasmine.createSpyObj(
      'PaginationService',
      ['setPaginatedArray', 'handleWidthChange', 'onResize'],
      {
        paginatedItems: [
          {
            id: '1',
            showingCardSite: 'front',
            image: 'front.jpg',
            backImage: 'back.jpg',
            publisher: 'VISA',
            type: 'Credit',
            fees: {
              release: 10
            }
          },
          {
            id: '2',
            showingCardSite: 'front',
            image: 'front.jpg',
            backImage: 'back.jpg',
            publisher: 'VISA',
            type: 'Credit',
            fees: {
              release: 10
            }
          },
        ],
      }
    );
    const convertServiceSpy = jasmine.createSpyObj('ConvertService', [
      'getCalculatedAmount',
      'getMinLimit',
    ]);
    const verificationServiceSpy = jasmine.createSpyObj('VerificationService', [
      'validateInput',
      'validateSelectedAccount',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        OrderCardComponent,
        VerificationCodeComponent,
      ],
      providers: [
        AnimationsProvider,
        { provide: UserService, useValue: userServiceSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: ConvertService, useValue: convertServiceSpy },
        { provide: VerificationService, useValue: verificationServiceSpy },
        ShakeStateService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(OrderCardComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    paginationService = TestBed.inject(
      PaginationService
    ) as jasmine.SpyObj<PaginationService>;
    convertService = TestBed.inject(
      ConvertService
    ) as jasmine.SpyObj<ConvertService>;
    verificationService = TestBed.inject(
      VerificationService
    ) as jasmine.SpyObj<VerificationService>;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle window resize events', () => {
    const event = new UIEvent('resize');
    component.onResize(event);
    expect(paginationService.onResize).toHaveBeenCalledWith(event, 3, 3);
  });
  it('should validate input values and set corresponding flags', () => {
    const mockNgModel = { value: '1234' } as NgModel;
    verificationService.validateInput.and.returnValue(true);
    const isValid = component.getIsInputValueValid(mockNgModel, 'pinCode');
    expect(verificationService.validateInput).toHaveBeenCalledWith(mockNgModel);
    expect(isValid).toBe(false);
    expect(component.cardFlags.isPinCodeValid).toBe(false);
  });
  it('should set deposit account number based on user input', () => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        currency: 'USD',
        advertismentText: '',
        advertismentContent: '',
        image: '',
        type: '',
        benefits: [],
      },
    ];
    component.userAccounts = mockAccounts;
    verificationService.validateSelectedAccount.and.returnValue(true);
    const event = { target: { value: '1' } } as unknown as Event;
    component.setDepositAccountNumber(event);
    expect(verificationService.validateSelectedAccount).toHaveBeenCalledWith(
      mockAccounts,
      '1'
    );
    expect(component.cardSettings.assignedAccountNumber).toBe('1');
  });

  it('should rotate card to show either front or back side', () => {
    component.rotateCard(paginationService.paginatedItems[0]);
    expect(paginationService.paginatedItems[0].showingCardSite).toBe('front');
  });
  it('should calculate and return the fee based on the type', () => {
    convertService.getCalculatedAmount.and.returnValue(10);
    const fee = component.getFee('monthly');
    expect(convertService.getCalculatedAmount).toHaveBeenCalledWith('PLN', 10);
    expect(fee).toBe('10 PLN');
  });
  it('should get the image of the card based on its current state', () => {
    const mockCard: Card = {
      id: '1',
      showingCardSite: 'front',
      image: 'front.jpg',
      backImage: 'back.jpg',
    } as unknown as Card;
    const image = component.getCardImage(mockCard);
    expect(image).toBe('front.jpg');
  });

  it('should get the full name of the card owner', () => {
    const mockUserAccount = {
      name: 'John',
      surname: 'Doe',
      identifier: 123,
      email: 'john.doe@example.com',
      phoneNumber: 123456789,
      pesel: 12345678901,
      address: '123 Main St',
      city: 'Anytown',
      country: 'Anycountry',
      postalCode: '12345',
      dateOfBirth: new Date('1990-01-01'),
      identityDocumentType: 'Passport',
      identityDocumentSerie: 'AB123456',
      avatarUrl: 'http://example.com/avatar.jpg',
      password: 'password123',
      repeatedPassword: 'password123',
    };
    component['userService'].userAccount = mockUserAccount;
    const fullName = component.ownerFullName;
    expect(fullName).toBe('J.DOE');
  });

  it('should get the card type along with its publisher', () => {
    const cardTypeWithPublisher = component.cardTypeWithPublisher;
    expect(cardTypeWithPublisher).toBe('VISA Credit');
  });
});
