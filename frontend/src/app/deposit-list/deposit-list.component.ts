import { Component, OnInit } from '@angular/core';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { ConvertService } from '../../services/convert.service';
import { ProductTypesService } from '../../services/product-types.service';
import { Deposit } from '../../types/deposit';
import { depositsObjectArray } from '../../utils/deposits-objects-array';

/**
 * @component DepositListComponent
 * @description This component is responsible for displaying a list of deposits.
 *
 * @selector app-deposit-list
 * @templateUrl ./deposit-list.component.html
 *
 * @class DepositListComponent
 * @implements OnInit
 *
 * @property {string} tabName - The name of the current tab.
 * @property {string} depositType - The type of deposit, default is 'timely'.
 * @property {Deposit[]} depositsObjectArray - An array of deposit objects.
 *
 * @constructor
 * @param {AppInformationStatesService} appInformationStatesService - Service to manage application state information.
 * @param {ProductTypesService} productTypesService - Service to manage product types.
 * @param {ConvertService} convertService - Service to handle data conversion.
 *
 * @method ngOnInit - Lifecycle hook that initializes the component. Subscribes to the currentDepositType and currentTabName observables.
 * @method changeDepositType - Changes the deposit type using the productTypesService.
 * @param {string} depositType - The new deposit type to be set.
 * @method isDepositIdHigherThanTwo - Checks if the deposit ID is higher than two.
 * @param {string} depositId - The ID of the deposit to be checked.
 * @returns {boolean} - Returns true if the deposit ID is higher than two, otherwise false.
 */
@Component({
  selector: 'app-deposit-list',
  templateUrl: './deposit-list.component.html',
})
export class DepositListComponent implements OnInit {
  public tabName: string;
  public depositType: string;
  public depositsObjectArray: Deposit[];

  constructor(
    private appInformationStatesService: AppInformationStatesService,
    private productTypesService: ProductTypesService,
    protected convertService: ConvertService
  ) {
    this.tabName = 'Konta';
    this.depositType = 'timely';
    this.depositsObjectArray = depositsObjectArray;
  }

  public ngOnInit(): void {
    this.productTypesService.currentDepositType.subscribe(
      (depositType: string) => (this.depositType = depositType)
    );
    this.appInformationStatesService.currentTabName.subscribe(
      (tabName: string) => (this.tabName = tabName)
    );
  }

  public changeDepositType(depositType: string): void {
    this.productTypesService.changeDepositType(depositType);
  }

  public isDepositIdHigherThanTwo(depositId: string): boolean {
    return Number(depositId) > Number(2);
  }
}
