import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardIdFormat',
  standalone: true
})
export class CardIdFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value.toString().replace(/(\d{4})(?=\d)/g, '$1 ');
  }
}
