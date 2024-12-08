import { Injectable } from '@angular/core';
import { Account } from '../types/account';
import { CardSettings } from '../types/card-settings';
import { Transaction } from '../types/transaction';
import {
  BOTTOM_INFORMATION,
  ONE_MONTH,
  SIX_MONTHS,
  THREE_MONTHS,
  TWELVE_MONTHS,
} from '../utils/enums';
import { exchangeRates } from '../utils/exchange-rates';
import { Currency } from '../types/currency';

@Injectable({
  providedIn: 'root',
})
export class ConvertService {
  public getPolishAccountType(accountType: string): string {
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

  public getPolishDepositType(depositType: string, usageType?: string): string {
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

  public getDepositIcon(depositType: string): string {
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

  public getIconClassFromTransactionCategory(
    transactionCategory: string
  ): string {
    switch (transactionCategory) {
      case 'Artykuły spożywcze':
        return 'fa-cart-shopping';
      case 'Rachunki':
        return 'fa-money-bill';
      case 'Rozrywka':
        return 'fa-film';
      default:
        return 'fa-question';
    }
  }

  public getNumberWithSpacesBetweenThousands(number?: number): string {
    if (number !== undefined) {
      const formattedNumber = number.toFixed(2);
      const parts = formattedNumber.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts[1] === '00' ? parts[0] : parts.join(',');
    } else {
      return '';
    }
  }

  public getGroupedUserTransactions(
    userTransactions: Transaction[]
  ): Transaction[][] {
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

  public getDayFromDate(date: string): string {
    return this.getWeekDayFromNumber(new Date(date).getDay());
  }

  public getWeekDayFromNumber(day: number): string {
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

  public getMonths(interval: number): number {
    switch (interval) {
      case ONE_MONTH:
      default:
        return interval > 4 ? 12 : 1;
      case THREE_MONTHS:
        return 3;
      case SIX_MONTHS:
        return 6;
      case TWELVE_MONTHS:
        return 12;
    }
  }

  public getMonthForm(interval: number): string {
    switch (interval) {
      case ONE_MONTH:
      default:
        return interval > 4 ? 'miesięcy' : 'miesiąc';
      case THREE_MONTHS:
        return 'miesiące';
      case SIX_MONTHS:
      case TWELVE_MONTHS:
        return 'miesięcy';
    }
  }

  public getAccountOptionString(account: Account): string {
    const polishAccountType: string =
      'Konto ' + this.getPolishAccountType(account.type);
    const shortenedAccountId: string = this.getShortenedAccountId(account.id);
    const avalaibleBalance: string =
      this.getNumberWithSpacesBetweenThousands(account.balance) +
      ' ' +
      account.currency;
    return (
      polishAccountType + ', ' + shortenedAccountId + ', ' + avalaibleBalance
    );
  }

  public getShortenedAccountId(accountId: string): string {
    return (
      accountId.substring(0, 5) +
      ' **** ' +
      accountId.substring(accountId.length - 4, accountId.length)
    );
  }

  public getCalculatedAmount(
    fromCurrency: Currency,
    accountCurrency: Currency,
    multiplier: number
  ): number {
    const conversionRate: number = this.getConversionRate(
      fromCurrency,
      accountCurrency
    );
    const value: number = conversionRate * multiplier;
    const calculatedAmount: number = Number(
      Math.round(value)
    );
    return calculatedAmount;
  }

  public getConversionRate(fromCurrency: string, toCurrency: string): number {
    const fromRate: number = exchangeRates.get(fromCurrency) as number;
    const toRate: number = exchangeRates.get(toCurrency) as number;
    return fromRate / toRate;
  }

  public getStep(cardSettings: CardSettings): number {
    const max: number = this.getMaxLimit(cardSettings);
    const min: number = this.getMinLimit(cardSettings.currency);
    const range: number = max - min;
    const steps: number = Math.ceil(range / 10);
    return Math.round(range / steps);
  }

  public getFormattedTransactionsLimit(cardSettings: CardSettings): string {
    const limit = this.getTransactionsLimit(cardSettings, "PLN");
    return limit.toLocaleString('pl-PL');
  }

  public getTransactionsLimit(cardSettings: CardSettings, fromCurrency: Currency): number {
    if (cardSettings.card.limits) {
      const isOnCardSettings: boolean = cardSettings.site === 'card-settings';
      const internetTransactionLimit: number = isOnCardSettings
        ? cardSettings.card.limits[0].internetTransactions[2]
        : cardSettings.card.limits[0].internetTransactions[0];
      const cashTransactionLimit: number = isOnCardSettings
        ? cardSettings.card.limits[0].cashTransactions[2]
        : cardSettings.card.limits[0].cashTransactions[0];
      const currentLimit: number =
        cardSettings.limitType === 'max'
          ? cardSettings.transactionType === 'internet'
            ? internetTransactionLimit
            : cashTransactionLimit
          : 500;
      const convertedLimit: number = this.getCalculatedAmount(
        fromCurrency,
        cardSettings.currency,
        currentLimit
      );
      return convertedLimit;
    } else {
      return 0;
    }
  }

  public getCurrentTransactionLimit(cardSettings: CardSettings): number {
    const upLimit: number = this.getMaxLimit(cardSettings);
    const downLimit: number = this.getMinLimit(cardSettings.currency);
    cardSettings.transactionType === 'cash'
      ? this.setCashTransactionLimit(upLimit, downLimit, cardSettings)
      : this.setInternetTransactionLimit(upLimit, downLimit, cardSettings);
    return cardSettings.transactionType === 'cash'
      ? cardSettings.limits.cashTransactionsLimit
      : cardSettings.limits.internetTransactionsLimit;
  }

  public getMaxLimit(cardSettings: CardSettings): number {
    if (cardSettings.card.limits) {
      return this.getCalculatedAmount(
        "PLN",
        cardSettings.currency,
        cardSettings.transactionType === 'cash'
          ? cardSettings.card.limits[0].cashTransactions[0]
          : cardSettings.card.limits[0].internetTransactions[0]
      );
    } else {
      return 0;
    }
  }

  public getMinLimit(accountCurrency: Currency): number {
    return this.getCalculatedAmount("PLN", accountCurrency, 500);
  }

  private setInternetTransactionLimit(
    upLimit: number,
    downLimit: number,
    cardSettings: CardSettings
  ): void {
    const isUpperThanLimit: boolean =
      cardSettings.limits.internetTransactionsLimit > upLimit;
    const isDownThanLimit: boolean =
      cardSettings.limits.internetTransactionsLimit < downLimit;
    if (isUpperThanLimit) {
      cardSettings.limits.internetTransactionsLimit = Math.round(upLimit);
    } else if (isDownThanLimit) {
      cardSettings.limits.internetTransactionsLimit = Math.round(downLimit);
    } else {
      cardSettings.limits.internetTransactionsLimit = Math.round(
        cardSettings.limits.internetTransactionsLimit
      );
    }
  }

  private setCashTransactionLimit(
    upLimit: number,
    downLimit: number,
    cardSettings: CardSettings
  ): void {
    const isUpperThanLimit: boolean =
      cardSettings.limits.cashTransactionsLimit > upLimit;
    const isDownThanLimit: boolean =
      cardSettings.limits.cashTransactionsLimit < downLimit;
    if (isUpperThanLimit) {
      cardSettings.limits.cashTransactionsLimit = Math.round(upLimit);
    } else if (isDownThanLimit) {
      cardSettings.limits.cashTransactionsLimit = Math.round(downLimit);
    } else {
      cardSettings.limits.cashTransactionsLimit = Math.round(
        cardSettings.limits.cashTransactionsLimit
      );
    }
  }
}
