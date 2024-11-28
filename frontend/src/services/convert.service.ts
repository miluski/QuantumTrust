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

/**
 * @class ConvertService
 * @description This service is responsible for handling various data conversion operations, such as converting account types, deposit types, transaction categories, and currency amounts.
 *
 * @providedIn 'root'
 *
 * @method getPolishAccountType - Converts the account type to its Polish equivalent.
 * @param {string} accountType - The account type to be converted.
 * @returns {string} - Returns the Polish equivalent of the account type.
 * @method getPolishDepositType - Converts the deposit type to its Polish equivalent.
 * @param {string} depositType - The deposit type to be converted.
 * @param {string} [usageType] - The usage type for the deposit.
 * @returns {string} - Returns the Polish equivalent of the deposit type.
 * @method getDepositIcon - Gets the icon for the deposit type.
 * @param {string} depositType - The deposit type.
 * @returns {string} - Returns the icon for the deposit type.
 * @method getIconClassFromTransactionCategory - Gets the icon class for the transaction category.
 * @param {string} transactionCategory - The transaction category.
 * @returns {string} - Returns the icon class for the transaction category.
 * @method getNumberWithSpacesBetweenThousands - Formats a number with spaces between thousands.
 * @param {number} [number] - The number to be formatted.
 * @returns {string} - Returns the formatted number.
 * @method getGroupedUserTransactions - Groups user transactions by date.
 * @param {Transaction[]} userTransactions - Array of user transactions.
 * @returns {Transaction[][]} - Returns an array of arrays of transactions grouped by date.
 * @method getDayFromDate - Gets the day of the week from a date string.
 * @param {string} date - The date string.
 * @returns {string} - Returns the day of the week.
 * @method getWeekDayFromNumber - Gets the day of the week from a number.
 * @param {number} day - The number representing the day of the week.
 * @returns {string} - Returns the day of the week.
 * @method getMonths - Gets the number of months for a given interval.
 * @param {number} interval - The interval.
 * @returns {number} - Returns the number of months.
 * @method getMonthForm - Gets the form of the month for a given interval.
 * @param {number} interval - The interval.
 * @returns {string} - Returns the form of the month.
 * @method getAccountOptionString - Gets the account option string for a given account.
 * @param {Account} account - The account.
 * @returns {string} - Returns the account option string.
 * @method getShortenedAccountId - Gets the shortened account ID.
 * @param {string} accountId - The account ID.
 * @returns {string} - Returns the shortened account ID.
 * @method getCalculatedAmount - Gets the calculated amount based on the currency and multiplier.
 * @param {string} accountCurrency - The account currency.
 * @param {number} multiplier - The multiplier.
 * @returns {number} - Returns the calculated amount.
 * @method getConversionRate - Gets the conversion rate between two currencies.
 * @param {string} fromCurrency - The currency to convert from.
 * @param {string} toCurrency - The currency to convert to.
 * @returns {number} - Returns the conversion rate.
 * @method getStep - Gets the step value for the card settings.
 * @param {CardSettings} cardSettings - The card settings.
 * @returns {number} - Returns the step value.
 * @method getFormattedTransactionsLimit - Gets the formatted transactions limit for the card settings.
 * @param {CardSettings} cardSettings - The card settings.
 * @returns {string} - Returns the formatted transactions limit.
 * @method getTransactionsLimit - Gets the transactions limit for the card settings.
 * @param {CardSettings} cardSettings - The card settings.
 * @returns {number} - Returns the transactions limit.
 * @method getCurrentTransactionLimit - Gets the current transaction limit for the card settings.
 * @param {CardSettings} cardSettings - The card settings.
 * @returns {number} - Returns the current transaction limit.
 * @method getMaxLimit - Gets the maximum limit for the card settings.
 * @param {CardSettings} cardSettings - The card settings.
 * @returns {number} - Returns the maximum limit.
 * @method getMinLimit - Gets the minimum limit for the account currency.
 * @param {string} accountCurrency - The account currency.
 * @returns {number} - Returns the minimum limit.
 * @method setInternetTransactionLimit - Sets the internet transaction limit for the card settings.
 * @param {number} upLimit - The upper limit.
 * @param {number} downLimit - The lower limit.
 * @param {CardSettings} cardSettings - The card settings.
 * @method setCashTransactionLimit - Sets the cash transaction limit for the card settings.
 * @param {number} upLimit - The upper limit.
 * @param {number} downLimit - The lower limit.
 * @param {CardSettings} cardSettings - The card settings.
 */
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
    accountCurrency: string,
    multiplier: number
  ): number {
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
    return range / steps;
  }

  public getFormattedTransactionsLimit(cardSettings: CardSettings): string {
    const limit = this.getTransactionsLimit(cardSettings);
    return limit.toLocaleString('pl-PL');
  }

  public getTransactionsLimit(cardSettings: CardSettings): number {
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
        cardSettings.currency,
        cardSettings.transactionType === 'cash'
          ? cardSettings.card.limits[0].cashTransactions[0]
          : cardSettings.card.limits[0].internetTransactions[0]
      );
    } else {
      return 0;
    }
  }

  public getMinLimit(accountCurrency: string): number {
    return this.getCalculatedAmount(accountCurrency, 500);
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
