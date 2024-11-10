import { TestBed } from '@angular/core/testing';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Transaction } from '../types/transaction';
import { ItemSelectionService } from './item-selection.service';
import { UserService } from './user.service';

describe('ItemSelectionService', () => {
  let service: ItemSelectionService;
  let userServiceMock: any;
  const mockAccounts: Account[] = [
    {
      id: '1',
      advertismentText: 'Ad Text 1',
      advertismentContent: 'Content 1',
      image: 'image1.webp',
      type: 'Checking',
      benefits: [],
      balance: 1000,
      currency: 'USD',
    },
    {
      id: '2',
      advertismentText: 'Ad Text 2',
      advertismentContent: 'Content 2',
      image: 'image2.webp',
      type: 'Savings',
      benefits: [],
      balance: 2000,
      currency: 'EUR',
    },
  ];
  const mockCards: Card[] = [
    {
      id: 1,
      type: 'Credit',
      description: 'Credit Card 1',
      image: 'card1.webp',
      backImage: 'back1.webp',
      benefits: ['Cashback'],
      limits: [],
      fees: { release: 10, monthly: 5 },
      assignedAccountId: '1',
      publisher: 'Visa',
      expirationDate: '2025-01',
      cvcCode: 123,
      status: 'unsuspended',
    },
    {
      id: 2,
      type: 'Debit',
      description: 'Debit Card 2',
      image: 'card2.webp',
      backImage: 'back2.webp',
      benefits: ['No fees'],
      limits: [],
      fees: { release: 5, monthly: 2 },
      assignedAccountId: '2',
      publisher: 'Mastercard',
      expirationDate: '2023-12',
      cvcCode: 456,
      status: 'suspended',
    },
  ];
  const mockTransactions: Transaction[] = [
    {
      id: 1,
      accountNumber: '1',
      date: '2023-08-01',
      hour: '12:00',
      title: 'Payment 1',
      type: 'incoming',
      category: 'Salary',
      amount: 1000,
      currency: 'USD',
      accountAmountAfter: 2000,
      accountCurrency: 'USD',
      status: 'settled',
    },
    {
      id: 2,
      accountNumber: '1',
      date: '2023-08-02',
      hour: '14:00',
      title: 'Payment 2',
      type: 'outgoing',
      category: 'Groceries',
      amount: 50,
      currency: 'USD',
      accountAmountAfter: 1950,
      accountCurrency: 'USD',
      status: 'settled',
    },
    {
      id: 3,
      accountNumber: 1,
      date: '2023-08-02',
      hour: '15:00',
      title: 'Card Purchase',
      type: 'outgoing',
      category: 'Shopping',
      amount: 200,
      currency: 'USD',
      accountAmountAfter: 1800,
      accountCurrency: 'USD',
      status: 'blockade',
    },
  ];
  beforeEach(() => {
    userServiceMock = jasmine.createSpyObj('UserService', [
      'getUserCardsArray',
      'getUserTransactionsArray',
    ]);
    userServiceMock.getUserCardsArray.and.returnValue(
      Promise.resolve(mockCards)
    );
    userServiceMock.getUserTransactionsArray.and.returnValue(
      Promise.resolve(mockTransactions)
    );
    TestBed.configureTestingModule({
      providers: [
        ItemSelectionService,
        { provide: UserService, useValue: userServiceMock },
      ],
    });
    service = TestBed.inject(ItemSelectionService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set selected account', () => {
    const account = mockAccounts[0];
    service.setSelectedAccount(account);
    service.currentAccount.subscribe((selectedAccount) => {
      expect(selectedAccount).toEqual(account);
    });
  });
  it('should set selected card', () => {
    const card = mockCards[0];
    service.setSelectedCard(card);
    service.currentCard.subscribe((selectedCard) => {
      expect(selectedCard).toEqual(card);
    });
  });
  it('should set user cards array from userService', async () => {
    await service['setUserCardsArray']();
    expect(service.userCards).toEqual(mockCards);
  });
  it('should filter transactions by selected account', async () => {
    const account = mockAccounts[0];
    service.setSelectedAccount(account);
    const transactions = await service.getUserTransactions('account');
    expect(transactions.length).toBe(3);
    expect(transactions[0].accountNumber).toBe('1');
    expect(transactions[2].accountNumber).toBe(1);
  });
  it('should filter transactions by selected card', async () => {
    const card = mockCards[0];
    service.setSelectedCard(card);
    const transactions = await service.getUserTransactions('card');
    expect(transactions.length).toBe(1);
    expect(transactions[0].accountNumber).toBe(1);
  });
  it('should return true if transaction account ID matches selected item ID', () => {
    const account = mockAccounts[0];
    service.setSelectedAccount(account);
    const transaction: Transaction = {
      id: 1,
      accountNumber: '1',
      date: '2023-08-01',
      hour: '12:00',
      title: 'Payment 1',
      type: 'incoming',
      category: 'Salary',
      amount: 1000,
      currency: 'USD',
      accountAmountAfter: 2000,
      accountCurrency: 'USD',
      status: 'settled',
    };
    const result = service['isTransactionAccountIdEqualToItemId'](
      'account',
      transaction
    );
    expect(result).toBeTrue();
  });
  it('should return false if transaction account ID does not match selected item ID', () => {
    const account = mockAccounts[0];
    service.setSelectedAccount(account);
    const transaction: Transaction = {
      id: 2,
      accountNumber: '2',
      date: '2023-08-01',
      hour: '12:00',
      title: 'Payment 2',
      type: 'incoming',
      category: 'Salary',
      amount: 1000,
      currency: 'USD',
      accountAmountAfter: 2000,
      accountCurrency: 'USD',
      status: 'settled',
    };
    const result = service['isTransactionAccountIdEqualToItemId'](
      'account',
      transaction
    );
    expect(result).toBeFalse();
  });
  it('should return false if account ID assigned to card does not match selected account ID', () => {
    const account = mockAccounts[1];
    service.setSelectedAccount(account);
    const transaction: Transaction = {
      id: 3,
      accountNumber: 1,
      date: '2023-08-02',
      hour: '15:00',
      title: 'Card Purchase',
      type: 'outgoing',
      category: 'Shopping',
      amount: 200,
      currency: 'USD',
      accountAmountAfter: 1800,
      accountCurrency: 'USD',
      status: 'blockade',
    };
    const result = service['isAccountIdAssignedToCardEqualToItemId'](
      'account',
      transaction
    );
    expect(result).toBeFalse();
  });
});
