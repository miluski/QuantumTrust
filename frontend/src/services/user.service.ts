import { Injectable } from '@angular/core';
import { Account } from '../types/account';
import { Card } from '../types/card';
import { Deposit } from '../types/deposit';
import { Transaction } from '../types/transaction';
import { UserAccount } from '../types/user-account';
import { userAccounts } from '../utils/example-user-accounts-object';
import { userCards } from '../utils/example-user-cards-object';
import { userDeposits } from '../utils/example-user-deposits-object';
import { userTransactions } from '../utils/example-user-transactions-object';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loggedUserAccount: UserAccount = new UserAccount();
  constructor() {
    this.loggedUserAccount.name = 'Maksymilian';
    this.loggedUserAccount.surname = 'Sowula';
    this.loggedUserAccount.address = 'Al.Tysiąclecia 1/1';
    this.loggedUserAccount.email = 'example@gmail.com';
    this.loggedUserAccount.phoneNumber = 123456789;
    this.loggedUserAccount.password = 'Test@1234';
  }
  register(userAccount: UserAccount, account: Account): boolean {
    return true;
  }
  login(userAccount: UserAccount): boolean {
    return true;
  }
  get userAccount(): UserAccount {
    return this.loggedUserAccount;
  }
  async getUserAccountsArray(): Promise<Account[]> {
    return Promise.resolve(userAccounts);
  }
  async getUserDepositsArray(): Promise<Deposit[]> {
    return Promise.resolve(userDeposits);
  }
  async getUserTransactionsArray(): Promise<Transaction[]> {
    return Promise.resolve(userTransactions);
  }
  async getUserCardsArray(): Promise<Card[]> {
    return Promise.resolve(userCards);
  }
}
