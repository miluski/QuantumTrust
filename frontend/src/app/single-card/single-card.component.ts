import { Component, OnInit } from '@angular/core';
import { ProductTypesService } from '../product-types.service';

@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  styleUrl: './single-card.component.css',
})
export class SingleCardComponent implements OnInit {
  private cardType: string = 'standard';
  constructor(private productTypesService: ProductTypesService) {}
  ngOnInit(): void {
    this.productTypesService.currentCardType.subscribe(
      (cardType) => (this.cardType = cardType)
    );
  }
  changeCardType(cardType: string): void {
    this.productTypesService.changeCardType(cardType);
  }
}
