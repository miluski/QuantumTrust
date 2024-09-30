import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CardIdFormatPipe } from '../../pipes/card-id-format.pipe';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';

/**
 * @fileoverview CardListComponent is a standalone Angular component that displays a list of cards.
 * It handles different card types and manages pagination services for Visa and MasterCard cards.
 * 
 * @component
 * @selector app-card-list
 * @templateUrl ./card-list.component.html
 * @styleUrl ./card-list.component.css
 * @imports [MatIconModule, CommonModule, RouterModule, CardIdFormatPipe]
 * 
 * @class
 * @implements OnInit
 * 
 * @property {string} tabName - The name of the tab, default is 'Karty'.
 * @property {string} cardType - The type of card, default is 'standard'.
 * @property {PaginationService} visaCardsPaginationService - Service for handling pagination of Visa cards.
 * @property {PaginationService} masterCardsPaginationService - Service for handling pagination of MasterCard cards.
 * 
 * @constructor
 * @param {ProductTypesService} productTypesService - Service for handling product types.
 * 
 * @method ngOnInit - Lifecycle hook that is called after data-bound properties are initialized.
 * @method onResize - Host listener for window resize events.
 * @param {UIEvent} event - The resize event.
 * @method setPaginatedArrays - Sets the paginated arrays for Visa and MasterCard cards.
 * @method handleWidthChange - Handles changes in window width for pagination services.
 * @method changeCardType - Changes the current card type.
 * @param {string} cardType - The new card type.
 */
@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  imports: [MatIconModule, CommonModule, RouterModule, CardIdFormatPipe],
  standalone: true,
})
export class CardListComponent implements OnInit {
  @Input() tabName = 'Karty';
  public cardType: string = 'standard';
  public visaCardsPaginationService: PaginationService =
    new PaginationService();
  public masterCardsPaginationService: PaginationService =
    new PaginationService();
  constructor(private productTypesService: ProductTypesService) {}
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
}
