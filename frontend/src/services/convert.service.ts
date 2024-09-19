import { Injectable } from '@angular/core';
import { Account } from '../types/account';
import { Transaction } from '../types/transaction';
import {
  BOTTOM_INFORMATION,
  ONE_MONTH,
  SIX_MONTHS,
  THREE_MONTHS,
  TWELVE_MONTHS,
} from '../utils/enums';
import { exchangeRates } from '../utils/exchange-rates';

@Injectable({
  providedIn: 'root',
})
export class ConvertService {
  getPolishAccountType(accountType: string): string {
    switch (accountType) {
      case 'multiCurrency':
        return 'wielowalutowe';
      case 'young':
        return 'dla młodych';
      case 'family':
        return 'rodzinne';
      case 'oldPeople':
        return 'senior';
      default:
        return 'osobiste';
    }
  }
  getPolishDepositType(depositType: string, usageType?: string): string {
    switch (depositType) {
      case 'timely':
      default:
        return usageType === BOTTOM_INFORMATION ? 'terminową' : 'terminowa';
      case 'mobile':
        return usageType === BOTTOM_INFORMATION ? 'mobilną' : 'mobilna';
      case 'family':
        return usageType === BOTTOM_INFORMATION ? 'rodzinną' : 'rodzinna';
      case 'progressive':
        return usageType === BOTTOM_INFORMATION ? 'progresywną' : 'progresywna';
    }
  }
  getDepositIcon(depositType: string): string {
    switch (depositType) {
      case 'timely':
      default:
        return 'calendar_month';
      case 'mobile':
        return 'phone_iphone';
      case 'family':
        return 'savings';
      case 'progressive':
        return 'bar_chart';
    }
  }
  getIconClassFromTransactionCategory(transactionCategory: string): string {
    switch (transactionCategory) {
      case 'Artykuły spożywcze':
        return 'fa-cart-shopping';
      case 'Rachunki':
        return 'fa-money-bill';
      case 'Rozrywka':
        return 'fa-film ';
      default:
        return 'fa-question';
    }
  }
  getNumberWithSpacesBetweenThousands(number?: number): string {
    if (number === undefined) {
      throw new Error('Number is undefined');
    }
    const parts = (number as number).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  }
  getGroupedUserTransactions(userTransactions: Transaction[]): Transaction[][] {
    const dailyTransactionsMap: Map<String, Transaction[]> = new Map<
      String,
      Transaction[]
    >();
    userTransactions.forEach((transaction: Transaction) => {
      const actualTransactionDate = transaction.date;
      dailyTransactionsMap.has(actualTransactionDate)
        ? dailyTransactionsMap.get(actualTransactionDate)?.push(transaction)
        : dailyTransactionsMap.set(actualTransactionDate, [transaction]);
    });
    return Array.from(dailyTransactionsMap.values());
  }
  getWeekDayFromNumber(day: number): string {
    switch (day) {
      case 1:
        return 'Poniedziałek';
      case 2:
        return 'Wtorek';
      case 3:
        return 'Środa';
      case 4:
        return 'Czwartek';
      case 5:
        return 'Piątek';
      case 6:
        return 'Sobota';
      default:
        return 'Niedziela';
    }
  }
  getMonths(interval: number): number {
    switch (interval) {
      case ONE_MONTH:
      default:
        return 1;
      case THREE_MONTHS:
        return 3;
      case SIX_MONTHS:
        return 6;
      case TWELVE_MONTHS:
        return 12;
    }
  }
  getMonthForm(interval: number): string {
    switch (interval) {
      case ONE_MONTH:
      default:
        return 'miesiąc';
      case THREE_MONTHS:
        return 'miesiące';
      case SIX_MONTHS:
      case TWELVE_MONTHS:
        return 'miesięcy';
    }
  }
  getShortenedAccountId(account: Account): string {
    return (
      account.id.substring(0, 5) +
      ' **** ' +
      account.id.substring(account.id.length - 4, account.id.length)
    );
  }
  getAccountOptionString(account: Account): string {
    const polishAccountType: string =
      'Konto ' + this.getPolishAccountType(account.type);
    const shortenedAccountId: string = this.getShortenedAccountId(account);
    const avalaibleBalance: string =
      this.getNumberWithSpacesBetweenThousands(account.balance) +
      ' ' +
      account.currency;
    return (
      polishAccountType + ', ' + shortenedAccountId + ', ' + avalaibleBalance
    );
  }
  getCalculatedAmount(accountCurrency: string, multiplier: number): number {
    const conversionRate: number = this.getConversionRate(
      'PLN',
      accountCurrency
    );
    const value: number = conversionRate * multiplier;
    const calculatedAmount: number = Number(
      parseFloat(value.toString()).toPrecision(2)
    );
    return calculatedAmount;
  }
  getConversionRate(fromCurrency: string, toCurrency: string): number {
    const fromRate: number = exchangeRates.get(fromCurrency) as number;
    const toRate: number = exchangeRates.get(toCurrency) as number;
    return fromRate / toRate;
  }
}
