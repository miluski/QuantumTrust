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
 * @fileoverview ConvertService provides utility methods for converting various types of data related to accounts, deposits, transactions, and card settings.
 * It includes methods to get the Polish equivalent of account types, deposit types, and transaction categories, as well as methods for formatting numbers and dates.
 *
 * @service
 * @providedIn root
 *
 * @class ConvertService
 * @method getPolishAccountType - Converts the given account type to its Polish equivalent.
 * @param {string} accountType - The type of the account in English.
 * @returns {string} - The Polish equivalent of the account type.
 *
 * @method getPolishDepositType - Converts the given deposit type to its Polish equivalent.
 * @param {string} depositType - The type of the deposit in English.
 * @param {string} [usageType] - Optional usage type for grammatical correctness.
 * @returns {string} - The Polish equivalent of the deposit type.
 *
 * @method getDepositIcon - Returns the icon name for the given deposit type.
 * @param {string} depositType - The type of the deposit.
 * @returns {string} - The icon name for the deposit type.
 *
 * @method getIconClassFromTransactionCategory - Returns the icon class for the given transaction category.
 * @param {string} transactionCategory - The category of the transaction.
 * @returns {string} - The icon class for the transaction category.
 *
 * @method getNumberWithSpacesBetweenThousands - Formats a number with spaces between thousands.
 * @param {number} [number] - The number to format.
 * @returns {string} - The formatted number.
 *
 * @method getGroupedUserTransactions - Groups user transactions by date.
 * @param {Transaction[]} userTransactions - The list of user transactions.
 * @returns {Transaction[][]} - The grouped transactions.
 *
 * @method getDayFromDate - Returns the day of the week for a given date.
 * @param {string} date - The date string.
 * @returns {string} - The day of the week in Polish.
 *
 * @method getWeekDayFromNumber - Returns the day of the week for a given day number.
 * @param {number} day - The day number (0-6).
 * @returns {string} - The day of the week in Polish.
 *
 * @method getMonths - Returns the number of months for a given interval.
 * @param {number} interval - The interval in months.
 * @returns {number} - The number of months.
 *
 * @method getMonthForm - Returns the grammatical form of "month" for a given interval.
 * @param {number} interval - The interval in months.
 * @returns {string} - The grammatical form of "month" in Polish.
 *
 * @method getAccountOptionString - Returns a formatted string for account options.
 * @param {Account} account - The account object.
 * @returns {string} - The formatted account option string.
 *
 * @method getShortenedAccountId - Returns a shortened version of the account ID.
 * @param {string} accountId - The account ID.
 * @returns {string} - The shortened account ID.
 *
 * @method getCalculatedAmount - Calculates the amount based on currency conversion.
 * @param {string} accountCurrency - The currency of the account.
 * @param {number} multiplier - The multiplier for the conversion.
 * @returns {number} - The calculated amount.
 *
 * @method getConversionRate - Returns the conversion rate between two currencies.
 * @param {string} fromCurrency - The source currency.
 * @param {string} toCurrency - The target currency.
 * @returns {number} - The conversion rate.
 *
 * @method getStep - Returns the step value for card settings.
 * @param {CardSettings} cardSettings - The card settings object.
 * @returns {number} - The step value.
 *
 * @method getFormattedTransactionsLimit - Returns the formatted transactions limit.
 * @param {CardSettings} cardSettings - The card settings object.
 * @returns {string} - The formatted transactions limit.
 *
 * @method getTransactionsLimit - Returns the transactions limit for card settings.
 * @param {CardSettings} cardSettings - The card settings object.
 * @returns {number} - The transactions limit.
 *
 * @method getCurrentTransactionLimit - Returns the current transaction limit for card settings.
 * @param {CardSettings} cardSettings - The card settings object.
 * @returns {number} - The current transaction limit.
 *
 * @method getMaxLimit - Returns the maximum limit for card settings.
 * @param {CardSettings} cardSettings - The card settings object.
 * @returns {number} - The maximum limit.
 *
 * @method getMinLimit - Returns the minimum limit for a given currency.
 * @param {string} accountCurrency - The currency of the account.
 * @returns {number} - The minimum limit.
 *
 * @method setInternetTransactionLimit - Sets the internet transaction limit for card settings.
 * @param {number} upLimit - The upper limit.
 * @param {number} downLimit - The lower limit.
 * @param {CardSettings} cardSettings - The card settings object.
 *
 * @method setCashTransactionLimit - Sets the cash transaction limit for card settings.
 * @param {number} upLimit - The upper limit.
 * @param {number} downLimit - The lower limit.
 * @param {CardSettings} cardSettings - The card settings object.
 */
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
    if (number !== undefined) {
      const formattedNumber = number.toFixed(2);
      const parts = formattedNumber.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts[1] === '00' ? parts[0] : parts.join(',');
    } else {
      return '';
    }
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
  getDayFromDate(date: string): string {
    return this.getWeekDayFromNumber(new Date(date).getDay());
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
        return interval > 4 ? 12 : 1;
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
        return interval > 4 ? 'miesięcy' : 'miesiąc';
      case THREE_MONTHS:
        return 'miesiące';
      case SIX_MONTHS:
      case TWELVE_MONTHS:
        return 'miesięcy';
    }
  }
  getAccountOptionString(account: Account): string {
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
  getShortenedAccountId(accountId: string): string {
    return (
      accountId.substring(0, 5) +
      ' **** ' +
      accountId.substring(accountId.length - 4, accountId.length)
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
  getStep(cardSettings: CardSettings): number {
    const max: number = this.getMaxLimit(cardSettings);
    const min: number = this.getMinLimit(cardSettings.currency);
    const range: number = max - min;
    const steps: number = Math.ceil(range / 10);
    return range / steps;
  }
  getFormattedTransactionsLimit(cardSettings: CardSettings): string {
    const limit = this.getTransactionsLimit(cardSettings);
    return limit.toLocaleString('pl-PL');
  }
  getTransactionsLimit(cardSettings: CardSettings): number {
    if (cardSettings.card.limits) {
      const currentLimit: number =
        cardSettings.limitType === 'max'
          ? cardSettings.transactionType === 'internet'
            ? cardSettings.card.limits[0].internetTransactions[0]
            : cardSettings.card.limits[0].cashTransactions[0]
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
  getCurrentTransactionLimit(cardSettings: CardSettings): number {
    const upLimit: number = this.getMaxLimit(cardSettings);
    const downLimit: number = this.getMinLimit(cardSettings.currency);
    cardSettings.transactionType === 'cash'
      ? this.setCashTransactionLimit(upLimit, downLimit, cardSettings)
      : this.setInternetTransactionLimit(upLimit, downLimit, cardSettings);
    return cardSettings.transactionType === 'cash'
      ? cardSettings.limits.cashTransactionsLimit
      : cardSettings.limits.internetTransactionsLimit;
  }
  getMaxLimit(cardSettings: CardSettings): number {
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
  getMinLimit(accountCurrency: string): number {
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
