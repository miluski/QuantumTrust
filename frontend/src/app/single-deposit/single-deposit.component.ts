import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ConvertService } from '../../services/convert.service';
import { MediaService } from '../../services/media.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Deposit } from '../../types/deposit';
import { Step } from '../../types/step';
import { depositsObjectArray } from '../../utils/deposits-objects-array';
import { BOTTOM_INFORMATION, TOP_INFORMATION } from '../../utils/enums';
import { singleDepositStepsArray } from '../../utils/steps-objects-arrays';

/**
 * @component SingleDepositComponent
 * @description This component is responsible for displaying and managing a single deposit view.
 *
 * @selector app-single-deposit
 * @templateUrl ./single-deposit.component.html
 *
 * @class SingleDepositComponent
 * @implements OnInit
 *
 * @property {Step[]} steps - An array of steps for the single deposit view.
 * @property {number} profit - The calculated profit for the deposit.
 * @property {number} interval - The interval for the deposit.
 * @property {string} depositType - The type of deposit, default is 'timely'.
 * @property {number} initialCapital - The initial capital for the deposit.
 * @property {Deposit} depositObject - The deposit object containing deposit details.
 * @property {string} TOP_INFORMATION - The top information text.
 * @property {string} BOTTOM_INFORMATION - The bottom information text.
 * @property {boolean} isInitialCapitalInValid - Flag indicating if the initial capital is invalid.
 *
 * @constructor
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 * @param {ConvertService} convertService - Service to handle data conversion.
 * @param {MediaService} mediaService - Service to manage media-related operations.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentDepositType observable and initializes fields.
 * @method changeDepositType - Changes the deposit type using the productTypesService.
 * @param {string} depositType - The new deposit type to be set.
 * @method calculateProfit - Calculates the profit for the deposit based on the initial capital and deposit type.
 * @method getIsInitialCapitalInvalid - Checks if the initial capital is invalid.
 * @param {NgModel} initialCapitalInput - The initial capital input model.
 * @returns {boolean} - Returns true if the initial capital is invalid, otherwise false.
 * @method getDepositObject - Gets the deposit object based on the deposit type.
 * @returns {Deposit} - Returns the deposit object.
 */
@Component({
  selector: 'app-single-deposit',
  templateUrl: './single-deposit.component.html',
})
export class SingleDepositComponent implements OnInit {
  @Input() steps: Step[];

  public profit: number;
  public interval: number;
  public depositType: string;
  public initialCapital: number;
  public depositObject!: Deposit;
  public TOP_INFORMATION: string;
  public BOTTOM_INFORMATION: string;
  public isInitialCapitalInValid: boolean;

  constructor(
    private productTypesService: ProductTypesService,
    public convertService: ConvertService,
    public mediaService: MediaService
  ) {
    this.profit = 0;
    this.interval = 1;
    this.initialCapital = 100;
    this.depositType = 'timely';
    this.isInitialCapitalInValid = false;
    this.TOP_INFORMATION = TOP_INFORMATION;
    this.BOTTOM_INFORMATION = BOTTOM_INFORMATION;
    this.steps = singleDepositStepsArray;
  }

  public ngOnInit(): void {
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

  public changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
    this.depositObject = this.getDepositObject();
  }

  public calculateProfit(): void {
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
    this.profit = this.isInitialCapitalInValid
      ? 0
      : Math.round(this.profit * 0.83);
  }

  public getIsInitialCapitalInvalid(initialCapitalInput: NgModel): boolean {
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
