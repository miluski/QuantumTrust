import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that formats a card ID number by inserting spaces every four digits.
 *
 * @example
 * // returns '1234 5678 9012 3456'
 * cardIdFormatPipe.transform(1234567890123456);
 *
 * @param value - The card ID number to format.
 * @returns The formatted card ID string.
 */
@Pipe({
  name: 'cardIdFormat',
})
export class CardIdFormatPipe implements PipeTransform {
  public transform(value: number): string {
    if (isNaN(value)) {
      throw new TypeError('Value is not an number!');
    }
    return value.toString().replace(/(\d{4})(?=\d)/g, '$1 ');
  }
}
