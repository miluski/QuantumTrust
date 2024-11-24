import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { PaginationService } from '../../services/pagination.service';
import { ProductTypesService } from '../../services/product-types.service';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';

/**
 * @component CardListComponent
 * @description This component is responsible for displaying a list of cards, including Visa and MasterCard.
 *
 * @selector app-card-list
 * @templateUrl ./card-list.component.html
 * @styleUrl ./card-list.component.css
 *
 * @class CardListComponent
 * @implements OnInit
 *
 * @property {string} tabName - The name of the current tab.
 * @property {string} cardType - The type of card, either 'visa' or 'mastercard'.
 * @property {PaginationService} visaCardsPaginationService - Service to manage pagination for Visa cards.
 * @property {PaginationService} masterCardsPaginationService - Service to manage pagination for MasterCard cards.
 *
 * @constructor
 * @param {Object} platformId - The platform ID for checking if the platform is a browser.
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentCardType and currentTabName observables.
 * @method onResize - Handles the window resize event to adjust pagination.
 * @param {UIEvent} event - The resize event.
 * @method setPaginatedArrays - Sets the paginated arrays for Visa and MasterCard cards.
 * @method handleWidthChange - Handles the width change to adjust pagination.
 * @method changeCardType - Changes the card type using the productTypesService.
 * @param {string} cardType - The new card type to be set.
 */
@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent implements OnInit {
  public tabName: string;
  public cardType: string;
  public visaCardsPaginationService: PaginationService;
  public masterCardsPaginationService: PaginationService;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appInformationStatesService: AppInformationStatesService,
    private productTypesService: ProductTypesService
  ) {
    this.tabName = 'Konta';
    this.cardType = 'standard';
    this.visaCardsPaginationService = new PaginationService();
    this.masterCardsPaginationService = new PaginationService();
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productTypesService.currentCardType.subscribe(
        (cardType: string) => (this.cardType = cardType)
      );
      this.appInformationStatesService.currentTabName.subscribe(
        (tabName: string) => (this.tabName = tabName)
      );
      this.setPaginatedArrays();
      this.handleWidthChange();
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: UIEvent): void {
    this.visaCardsPaginationService.onResize(event);
    this.masterCardsPaginationService.onResize(event);
  }

  public setPaginatedArrays(): void {
    this.visaCardsPaginationService.setPaginatedArray(visaCardsObjectsArray);
    this.masterCardsPaginationService.setPaginatedArray(
      mastercardCardsObjectsArray
    );
  }

  public handleWidthChange(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.visaCardsPaginationService.handleWidthChange(window.innerWidth);
      this.masterCardsPaginationService.handleWidthChange(window.innerWidth);
    }
  }

  public changeCardType(cardType: string): void {
    this.productTypesService.changeCardType(cardType);
  }
}
