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
  public userAccount: UserAccount = new UserAccount();
  constructor() {
    this.userAccount.name = 'Maksymilian';
    this.userAccount.surname = 'Sowula';
    this.userAccount.address = 'Al.Tysiąclecia 1/1';
    this.userAccount.email = 'example@gmail.com';
    this.userAccount.phoneNumber = 123456789;
    this.userAccount.password = 'Test@12345678';
  }
  register(userAccount: UserAccount, account: Account): boolean {
    return true;
  }
  login(userAccount: UserAccount): boolean {
    return true;
  }
  setLoggedUserAccount(userAccount: UserAccount): void {
    this.userAccount = JSON.parse(JSON.stringify(userAccount));
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
