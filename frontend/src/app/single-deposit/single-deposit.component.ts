import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ConvertService } from '../../services/convert.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Deposit } from '../../types/deposit';
import { Step } from '../../types/step';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { BOTTOM_INFORMATION, TOP_INFORMATION } from '../../utils/enums';
import { singleDepositStepsArray } from '../../utils/steps-objects-arrays';
import { MediaService } from '../../services/media-service.service';

/**
 * @fileoverview SingleDepositComponent is a standalone Angular component that handles the logic for a single deposit view.
 * It includes methods for changing the deposit type, calculating profit, and initializing the component state.
 *
 * @component
 * @selector app-single-deposit
 * @templateUrl ./single-deposit.component.html
 * @class SingleDepositComponent
 * @implements OnInit
 *
 * @property {Step[]} steps - Input property that holds an array of steps for the deposit process.
 * @property {Deposit} depositObject - Protected property that holds the current deposit object.
 * @property {string} BOTTOM_INFORMATION - Protected property that holds bottom information text.
 * @property {string} TOP_INFORMATION - Protected property that holds top information text.
 * @property {number} initialCapital - Protected property that holds the initial capital amount.
 * @property {number} interval - Protected property that holds the interval for the deposit.
 * @property {number} profit - Protected property that holds the calculated profit.
 * @property {string} depositType - Protected property that holds the type of the deposit.
 *
 * @constructor
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 * @param {ConvertService} convertService - Service to handle conversion logic.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component state and subscribes to deposit type changes.
 * @method changeDepositType - Changes the deposit type and updates the deposit object.
 * @param {string} depositType - The new deposit type to be set.
 *
 * @method calculateProfit - Calculates the profit based on the deposit type, initial capital, and interval.
 *
 * @method getDepositObject - Retrieves the deposit object based on the current deposit type.
 * @private
 * @returns {Deposit} - The deposit object corresponding to the current deposit type.
 */
@Component({
  selector: 'app-single-deposit',
  templateUrl: './single-deposit.component.html',
})
export class SingleDepositComponent implements OnInit {
  @Input() steps: Step[] = singleDepositStepsArray;
  public depositObject!: Deposit;
  public isInitialCapitalInValid: boolean = false;
  public BOTTOM_INFORMATION: string = BOTTOM_INFORMATION;
  public TOP_INFORMATION: string = TOP_INFORMATION;
  public initialCapital: number = 100;
  public interval: number = 1;
  public profit: number = 0;
  public depositType: string = 'timely';
  constructor(
    private productTypesService: ProductTypesService,
    public convertService: ConvertService,
    public mediaService: MediaService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentDepositType.subscribe(
      (depositType: string) => {
        this.depositType = depositType;
        this.depositObject = this.getDepositObject();
        this.calculateProfit();
      }
    );
    this.depositObject = this.getDepositObject();
    this.calculateProfit();
  }
  changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
    this.depositObject = this.getDepositObject();
  }
  calculateProfit(): void {
    if (this.isInitialCapitalInValid) {
      return;
    }
    const monthsCount: number = this.convertService.getMonths(this.interval);
    if (this.depositObject.type !== 'progressive') {
      this.profit = Math.round(
        ((this.initialCapital * this.depositObject.percent) / 100) *
          (monthsCount / 12)
      );
    } else {
      let rate = this.depositObject.percent;
      let totalProfit = 0;
      for (let i = 1; i <= monthsCount; i++) {
        if (i > 3) {
          rate += 1;
        }
        totalProfit += (this.initialCapital * rate) / 100 / 12;
      }
      this.profit = Math.round(totalProfit);
    }
    this.profit = Math.round(this.profit * 0.83);
  }
  getIsInitialCapitalInvalid(initialCapitalInput: NgModel): boolean {
    this.isInitialCapitalInValid =
      initialCapitalInput.invalid! &&
      (initialCapitalInput.dirty! || initialCapitalInput.touched!);
    return this.isInitialCapitalInValid;
  }
  public getDepositObject(): Deposit {
    return depositsObjectArray.find(
      (deposit: Deposit) => deposit.type === this.depositType
    ) as Deposit;
  }
}
