import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Card } from '../../types/card';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';
import { ProductTypesService } from '../product-types.service';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  imports: [MatIconModule, CommonModule, RouterModule],
  standalone: true,
})
export class CardListComponent implements OnInit {
  @Input() tabName = 'Karty';
  cardType: string = 'standard';
  currentMastercardPage: number = 1;
  currentVisaPage: number = 1;
  itemsPerPage: number = 3;
  visaCardsObjectsArray: Card[] = visaCardsObjectsArray;
  mastercardCardsObjectsArray: Card[] = mastercardCardsObjectsArray;
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentCardType.subscribe(
      (cardType) => (this.cardType = cardType)
    );
    this.updateItemsPerPage(window.innerWidth);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateItemsPerPage(event.target.innerWidth);
  }
  updateItemsPerPage(width: number) {
    if (width <= 768) {
      this.itemsPerPage = 1;
    } else {
      this.currentVisaPage = 1;
      this.currentMastercardPage = 1;
      this.itemsPerPage = 3;
    }
  }
  changeCardType(cardType: string): void {
    this.productTypesService.changeCardType(cardType);
  }
  get masterCardPaginatedItems() {
    return this.mastercardCardsObjectsArray.slice(0, this.itemsPerPage);
  }
  previousMastercardPage() {
    if (this.currentMastercardPage > 1) {
      this.currentMastercardPage--;
      const lastItem = this.mastercardCardsObjectsArray.pop();
      this.mastercardCardsObjectsArray.unshift(<Card>lastItem);
    }
  }
  nextMastercardPage() {
    if (this.currentMastercardPage < this.mastercardTotalPages) {
      this.currentMastercardPage++;
      const firstItem = this.mastercardCardsObjectsArray.shift();
      this.mastercardCardsObjectsArray.push(<Card>firstItem);
    }
  }
  get mastercardTotalPages() {
    return Math.ceil(
      this.mastercardCardsObjectsArray.length / this.itemsPerPage
    );
  }
  get visaPaginatedItems() {
    return this.visaCardsObjectsArray.slice(0, this.itemsPerPage);
  }
  previousVisaPage() {
    if (this.currentVisaPage > 1) {
      this.currentVisaPage--;
      const lastItem = this.visaCardsObjectsArray.pop();
      this.visaCardsObjectsArray.unshift(<Card>lastItem);
    }
  }
  nextVisaPage() {
    if (this.currentVisaPage < this.mastercardTotalPages) {
      this.currentVisaPage++;
      const firstItem = this.visaCardsObjectsArray.shift();
      this.visaCardsObjectsArray.push(<Card>firstItem);
    }
  }
  get visaTotalPages() {
    return Math.ceil(this.visaCardsObjectsArray.length / this.itemsPerPage);
  }
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
  }
}
