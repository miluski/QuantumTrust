import { Component, OnInit } from '@angular/core';
import { AnimationsProvider } from '../../providers/animations.provider';
import { ProductTypesService } from '../../services/product-types.service';
import { Card } from '../../types/card';
import { Question } from '../../types/question';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';

/**
 * @component SingleCardComponent
 * @description This component is responsible for displaying and managing a single card view.
 *
 * @selector app-single-card
 * @templateUrl ./single-card.component.html
 * @animations [AnimationsProvider.animations]
 *
 * @class SingleCardComponent
 * @implements OnInit
 *
 * @property {string} cardType - The type of card, default is 'standard'.
 * @property {Card} visaCardObject - The Visa card object containing card details.
 * @property {Card} mastercardObject - The MasterCard object containing card details.
 * @property {Question[]} questionsAndAnswersPairs - An array of questions and answers related to the card.
 *
 * @constructor
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentCardType observable and initializes fields.
 * @method initializeFields - Initializes the card objects and questions and answers pairs.
 * @method changeStateOfQuestionAnswer - Changes the state of a question and answer pair.
 * @param {number} id - The ID of the question and answer pair to be changed.
 * @method changeCardType - Changes the card type using the productTypesService.
 * @param {string} cardType - The new card type to be set.
 * @method getVisaCardObject - Gets the Visa card object based on the card type.
 * @returns {Card} - Returns the Visa card object.
 * @method getMastercardObject - Gets the MasterCard object based on the card type.
 * @returns {Card} - Returns the MasterCard object.
 */
@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  animations: [AnimationsProvider.animations],
})
export class SingleCardComponent implements OnInit {
  public cardType: string;
  public visaCardObject!: Card;
  public mastercardObject!: Card;
  public questionsAndAnswersPairs!: Question[];

  constructor(private productTypesService: ProductTypesService) {
    this.cardType = 'standard';
  }

  public ngOnInit(): void {
    this.productTypesService.currentCardType.subscribe((cardType: string) => {
      this.cardType = cardType;
      this.initializeFields();
    });
    this.initializeFields();
  }

  public initializeFields(): void {
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

  public changeStateOfQuestionAnswer(id: number): void {
    this.questionsAndAnswersPairs[id].isOpened =
      !this.questionsAndAnswersPairs[id].isOpened;
  }

  public changeCardType(cardType: string): void {
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
