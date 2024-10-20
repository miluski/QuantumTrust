import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Deposit } from '../../types/deposit';
import { depositsObjectArray } from '../../utils/deposits-objects-array';

/**
 * @component DepositListComponent
 * @description This component is responsible for displaying a list of deposits.
 * It uses Angular's standalone component feature and imports necessary modules.
 *
 * @selector app-deposit-list
 * @templateUrl ./deposit-list.component.html
 *
 *
 * @property {string} depositType - The type of deposit, default is 'timely'.
 * @property {Deposit[]} depositsObjectArray - An array of deposit objects.
 *
 * @constructor
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 * @param {ConvertService} convertService - Service to handle conversions.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentDepositType observable.
 * @method changeDepositType - Changes the deposit type using the productTypesService.
 * @param {string} depositType - The new deposit type to be set.
 *
 * @method isDepositIdHigherThanTwo - Checks if the deposit ID is higher than two.
 * @param {string} depositId - The ID of the deposit to be checked.
 * @returns {boolean} - Returns true if the deposit ID is higher than two, otherwise false.
 */
@Component({
  selector: 'app-deposit-list',
  templateUrl: './deposit-list.component.html',
})
export class DepositListComponent implements OnInit {
  public tabName: string = 'Konta';
  public depositType: string = 'timely';
  public depositsObjectArray: Deposit[] = depositsObjectArray;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appInformationStatesService: AppInformationStatesService,
    private productTypesService: ProductTypesService,
    protected convertService: ConvertService
  ) {}
  ngOnInit(): void {
    this.productTypesService.currentDepositType.subscribe(
      (depositType: string) => (this.depositType = depositType)
    );
    this.appInformationStatesService.currentTabName.subscribe(
      (tabName: string) => (this.tabName = tabName)
    );
  }
  changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
  }
  isDepositIdHigherThanTwo(depositId: string): boolean {
    return Number(depositId) > Number(2);
  }
}
