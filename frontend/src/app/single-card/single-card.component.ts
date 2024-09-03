import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { Card } from '../../types/card';
import { Question } from '../../types/question';
import { mastercardCardsObjectsArray } from '../../utils/mastercard-cards-objects-array';
import { visaCardsObjectsArray } from '../../utils/visa-cards-objects-array';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ProductTypesService } from '../product-types.service';
import { WindowEventsService } from '../window-events.service';

@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  styleUrl: './single-card.component.css',
  imports: [
    HeaderComponent,
    FooterComponent,
    MatDividerModule,
    CommonModule,
    RouterModule,
  ],
  standalone: true,
})
export class SingleCardComponent implements OnInit {
  mastercardObject!: Card;
  visaCardObject!: Card;
  questionsAndAnswersPairs!: Question[];
  private cardType: string = 'standard';
  constructor(
    private productTypesService: ProductTypesService,
    private windowEventsService: WindowEventsService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentCardType.subscribe((cardType) => {
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
  onScrollToTop(): void {
    this.windowEventsService.scrollToTop();
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
