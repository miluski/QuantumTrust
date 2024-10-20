import { Component, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ProductTypesService } from '../../services/product-types.service';
import { Card } from '../../types/card';
import { Question } from '../../types/question';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';

/**
 * @fileoverview SingleCardComponent is a standalone Angular component that displays details of a single card, including Mastercard and Visa card details, and a list of frequently asked questions and answers. It uses various Angular modules and components, and includes animations.
 *
 * @component
 * @selector app-single-card
 * @templateUrl ./single-card.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class SingleCardComponent
 * @implements OnInit
 *
 * @property {Card} mastercardObject - Object representing the Mastercard details.
 * @protected
 *
 * @property {Card} visaCardObject - Object representing the Visa card details.
 * @protected
 *
 * @property {Question[]} questionsAndAnswersPairs - Array of questions and answers related to the card.
 * @protected
 *
 * @property {string} cardType - Type of the card, default is 'standard'.
 * @private
 *
 * @constructor
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 *
 * @method ngOnInit
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 *
 * @method initializeFields
 * @description Initializes the fields for the component, fetching card details and setting up questions and answers.
 * @protected
 *
 * @method changeStateOfQuestionAnswer
 * @description Toggles the state of a question and answer pair.
 * @param {number} id - The ID of the question and answer pair to toggle.
 * @public
 *
 * @method changeCardType
 * @description Changes the card type and updates the service.
 * @param {string} cardType - The new card type to set.
 * @public
 *
 * @method getVisaCardObject
 * @description Fetches the Visa card object based on the current card type.
 * @private
 * @returns {Card} The Visa card object.
 *
 * @method getMastercardObject
 * @description Fetches the Mastercard object based on the current card type.
 * @private
 * @returns {Card} The Mastercard object.
 */
@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  animations: [AnimationsProvider.animations],
})
export class SingleCardComponent implements OnInit {
  public mastercardObject!: Card;
  public visaCardObject!: Card;
  public questionsAndAnswersPairs!: Question[];
  public cardType: string = 'standard';
  constructor(private productTypesService: ProductTypesService) {}
  ngOnInit(): void {
    this.productTypesService.currentCardType.subscribe((cardType: string) => {
      this.cardType = cardType;
      this.initializeFields();
    });
    this.initializeFields();
  }
  initializeFields(): void {
    this.visaCardObject = this.getVisaCardObject();
    this.mastercardObject = this.getMastercardObject();
    this.questionsAndAnswersPairs = [
      {
        id: 0,
        content: 'Co w przypadku zgubienia karty?',
        answer:
          'W przypadku zgubienia karty należy niezwłocznie skontaktować się z naszym centrum obsługi klienta pod numerem telefonu 123-456-789. Nasz zespół pomoże zablokować zgubioną kartę i wydać nową.',
        isOpened: false,
      },
      {
        id: 1,
        content: 'Jak zmienić limity transakcji?',
        answer:
          'Aby zmienić limity transakcji, zaloguj się do swojego konta online i przejdź do sekcji "Ustawienia karty". Tam znajdziesz opcję zmiany limitów transakcji. Możesz również skontaktować się z naszym centrum obsługi klienta, aby uzyskać pomoc.',
        isOpened: false,
      },
      {
        id: 2,
        content: `Jakie są limity na karcie ${this.cardType.toLowerCase()}?`,
        answer: `<p class='mb-5'> Maksymalne dzienne limity kwotowo-ilościowe: </p>
                <ul class='flex flex-col space-y-5 list-disc'>
                  <li>Limit transakcji internetowych: <b>${this.visaCardObject.limits[0].internetTransactions[0]}</b> PLN na maksymalnie <b>${this.mastercardObject.limits[0].internetTransactions[1]} transakcji</b> dziennie</li>
                  <li>Limit transakcji gotówkowych: <b>${this.visaCardObject.limits[0].cashTransactions[0]}</b> PLN na maksymalnie <b>${this.mastercardObject.limits[0].cashTransactions[1]} transakcji</b> dziennie</li>
                </ul>`,
        isOpened: false,
      },
    ];
  }
  changeStateOfQuestionAnswer(id: number): void {
    this.questionsAndAnswersPairs[id].isOpened =
      !this.questionsAndAnswersPairs[id].isOpened;
  }
  changeCardType(cardType: string): void {
    this.productTypesService.changeCardType(cardType);
  }
  private getVisaCardObject(): Card {
    return visaCardsObjectsArray.find(
      (card: Card) => card.type === this.cardType.toUpperCase()
    ) as Card;
  }
  private getMastercardObject(): Card {
    return mastercardCardsObjectsArray.find(
      (card: Card) => card.type === this.cardType.toUpperCase()
    ) as Card;
  }
}
