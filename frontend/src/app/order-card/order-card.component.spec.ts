import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ConvertService } from '../../services/convert.service';
import { PaginationService } from '../../services/pagination.service';
import { ShakeStateService } from '../../services/shake-state.service';
import { UserService } from '../../services/user.service';
import { VerificationService } from '../../services/verification.service';
import { Card } from '../../types/card';
import { OrderCardComponent } from './order-card.component';
import { provideHttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageModule } from '../image/image.module';

describe('OrderCardComponent', () => {
  let component: OrderCardComponent;
  let fixture: ComponentFixture<OrderCardComponent>;
  let userService: UserService;
  let verificationService: VerificationService;
  let paginationService: PaginationService;
  let convertService: ConvertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, FormsModule, BrowserAnimationsModule, ImageModule],
      declarations: [OrderCardComponent],
      providers: [
        AnimationsProvider,
        ConvertService,
        PaginationService,
        ShakeStateService,
        UserService,
        VerificationService,
        provideHttpClient()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCardComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    verificationService = TestBed.inject(VerificationService);
    paginationService = TestBed.inject(PaginationService);
    convertService = TestBed.inject(ConvertService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate input value', () => {
    const input = { valid: true } as NgModel;
    spyOn(verificationService, 'validateInput').and.returnValue(false);
    const isValid = component.getIsInputValueValid(input, 'cash');
    expect(isValid).toBe(true);
  });

  it('should set deposit account number', () => {
    const event = { target: { value: '1' } } as unknown as Event;
    spyOn(verificationService, 'validateSelectedAccount').and.returnValue(true);
    component.setDepositAccountNumber(event);
    expect(component.cardFlags.isAccountNumberValid).toBe(true);
    expect(component.cardSettings.assignedAccountNumber).toBe('1');
  });

  it('should rotate card', () => {
    const card = { id: '1', showingCardSite: 'front' } as unknown as Card;
    spyOnProperty(component, 'currentSelectedCard', 'get').and.returnValue(
      card
    );
    component.rotateCard(card);
    expect(card.showingCardSite).toBe('back');
  });

  it('should get card state', () => {
    spyOnProperty(component, 'currentSelectedCard', 'get').and.returnValue({
      id: 1,
    } as Card);
    const state = component.getCardState(1);
    expect(state).toBe('center');
  });

  it('should get card image', () => {
    spyOnProperty(component, 'currentSelectedCard', 'get').and.returnValue({
      id: '1',
      showingCardSite: 'back',
      backImage: 'back.jpg',
    } as unknown as Card);
    const card = { id: '1', image: 'front.jpg' } as unknown as Card;
    const image = component.getCardImage(card);
    expect(image).toBe('back.jpg');
  });

  it('should get card settings object', () => {
    const cardSettings = component.getCardSettingsObject('min', 'internet');
    expect(cardSettings.limitType).toBe('min');
    expect(cardSettings.transactionType).toBe('internet');
  });

  it('should get owner full name', () => {
    spyOnProperty(userService, 'userAccount', 'get').and.returnValue({
      firstName: 'John',
      lastName: 'Doe',
      id: 0,
      emailAddress: '',
      phoneNumber: 0,
      peselNumber: 0,
      documentType: '',
      documentSerie: '',
      avatarUrl: '',
      address: '',
      password: '',
      repeatedPassword: '',
    });
    const fullName = component.ownerFullName;
    expect(fullName).toBe('J.DOE');
  });

  it('should get card type with publisher', () => {
    spyOnProperty(component, 'currentSelectedCard', 'get').and.returnValue({
      publisher: 'visa',
      type: 'credit',
    } as unknown as Card);
    const cardTypeWithPublisher = component.cardTypeWithPublisher;
    expect(cardTypeWithPublisher).toBe('VISA credit');
  });
});
