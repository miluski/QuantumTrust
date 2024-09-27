import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CardIdFormatPipe } from '../../pipes/card-id-format.pipe';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { WindowEventsService } from '../../services/window-events.service';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  imports: [MatIconModule, CommonModule, RouterModule, CardIdFormatPipe],
  standalone: true,
})
export class CardListComponent implements OnInit {
  @Input() tabName = 'Karty';
  protected cardType: string = 'standard';
  protected visaCardsPaginationService: PaginationService = new PaginationService();
  protected masterCardsPaginationService: PaginationService = new PaginationService();
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentCardType.subscribe(
      (cardType: string) => (this.cardType = cardType)
    );
    this.setPaginatedArrays();
    this.handleWidthChange();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.visaCardsPaginationService.onResize(event);
    this.masterCardsPaginationService.onResize(event);
  }
  setPaginatedArrays(): void {
    this.visaCardsPaginationService.setPaginatedArray(visaCardsObjectsArray);
    this.masterCardsPaginationService.setPaginatedArray(
      mastercardCardsObjectsArray
    );
  }
  handleWidthChange(): void {
    this.visaCardsPaginationService.handleWidthChange(window.innerWidth);
    this.masterCardsPaginationService.handleWidthChange(window.innerWidth);
  }
  changeCardType(cardType: string): void {
    this.productTypesService.changeCardType(cardType);
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
