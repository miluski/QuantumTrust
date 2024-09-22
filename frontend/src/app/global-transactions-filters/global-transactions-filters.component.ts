import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalTransactionsFiltersService } from '../../services/global-transactions-filters.service';

@Component({
  selector: 'app-global-transactions-filters',
  templateUrl: './global-transactions-filters.component.html',
  imports: [CommonModule],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          borderBottomWidth: '2px',
          borderBottomColor: 'white',
        })
      ),
      state(
        'out',
        style({
          borderBottomWidth: '0px',
          borderBottomColor: 'transparent',
        })
      ),
      transition('out => in', [
        style({ borderBottomWidth: '0px', borderBottomColor: 'transparent' }),
        animate(
          '500ms ease-in',
          style({ borderBottomWidth: '2px', borderBottomColor: 'white' })
        ),
      ]),
      transition('in => out', [
        style({ borderBottomWidth: '2px', borderBottomColor: 'white' }),
        animate(
          '500ms ease-out',
          style({ borderBottomWidth: '0px', borderBottomColor: 'transparent' })
        ),
      ]),
    ]),
  ],
  standalone: true,
})
export class GlobalTransactionsFiltersComponent implements OnInit {
  constructor(
    protected globalTransactionsFiltersService: GlobalTransactionsFiltersService
  ) {}
  ngOnInit(): void {
    this.globalTransactionsFiltersService.setAppliedFilter('Wszystkie', '');
  }
}
