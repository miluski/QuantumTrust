import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Transaction } from '../types/transaction';
import { ItemSelectionService } from './item-selection.service';
import { UserService } from './user.service';

describe('ItemSelectionService', () => {
  let service: ItemSelectionService;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['userCards'], {
      userCards: new BehaviorSubject<Card[]>([]),
    });
    TestBed.configureTestingModule({
      providers: [
        ItemSelectionService,
        { provide: UserService, useValue: userServiceSpy },
      ],
    });
    service = TestBed.inject(ItemSelectionService);
    userServiceMock = TestBed.inject(
      UserService
    ) as jasmine.SpyObj<UserService>;
    userServiceMock.userCards = new BehaviorSubject<Card[]>([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set selected account', () => {
    const account = new Account();
    account.id = '123';
    service.setSelectedAccount(account);
    service.currentAccount.subscribe((selectedAccount) => {
      expect(selectedAccount.id).toBe('123');
    });
  });

  it('should set selected card', () => {
    const card = new Card();
    card.id = 456;
    service.setSelectedCard(card);
    service.currentCard.subscribe((selectedCard) => {
      expect(selectedCard.id).toBe(456);
    });
  });

  it('should check if transaction account ID is equal to selected account ID', () => {
    const account = new Account();
    account.id = '123';
    service.setSelectedAccount(account);

    const transaction = new Transaction();
    transaction.assignedAccountNumber = '123';

    expect(
      service.isTransactionAccountIdEqualToItemId('account', transaction)
    ).toBeTrue();
  });

  it('should check if transaction account ID is equal to selected card ID', () => {
    const card = new Card();
    card.id = 456;
    service.setSelectedCard(card);

    const transaction = new Transaction();
    transaction.assignedAccountNumber = '456';

    expect(
      service.isTransactionAccountIdEqualToItemId('card', transaction)
    ).toBeTrue();
  });

  it('should check if account ID assigned to card is equal to selected account ID', () => {
    const account = new Account();
    account.id = '123';
    service.setSelectedAccount(account);

    const card = new Card();
    card.id = 456;
    card.assignedAccountNumber = '123';

    const transaction = new Transaction();
    transaction.assignedAccountNumber = '456';

    expect(
      service.isAccountIdAssignedToCardEqualToItemId('account', transaction)
    ).toBeFalse();
  });

  it('should clear selected account', () => {
    const account = new Account();
    account.id = '123';
    service.setSelectedAccount(account);
    service.setSelectedAccount(new Account());
    service.currentAccount.subscribe((selectedAccount) => {
      expect(selectedAccount.id).toBeUndefined();
    });
  });

  it('should clear selected card', () => {
    const card = new Card();
    card.id = 456;
    service.setSelectedCard(card);
    service.setSelectedCard(new Card());
    service.currentCard.subscribe((selectedCard) => {
      expect(selectedCard.id).toBeUndefined();
    });
  });
});
