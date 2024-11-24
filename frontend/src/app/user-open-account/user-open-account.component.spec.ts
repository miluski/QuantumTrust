import { TestBed } from '@angular/core/testing';
import { AppInformationStatesService } from '../../services/app-information-states.service';
import { VerificationService } from '../../services/verification.service';
import { Account } from '../../types/account';
import { UserAccountFlags } from '../../types/user-account-flags';
import { UserOpenAccountComponent } from './user-open-account.component';
import { UserOpenAccountModule } from './user-open-account.module';

describe('UserOpenAccountComponent', () => {
  let component: UserOpenAccountComponent;
  let appInformationStatesService: AppInformationStatesService;
  let verificationService: VerificationService;

  beforeEach(() => {
    appInformationStatesService = jasmine.createSpyObj(
      'AppInformationStatesService',
      ['changeTabName']
    );
    verificationService = jasmine.createSpyObj('VerificationService', [
      'validateAccountCurrency',
      'validateAccountType',
    ]);

    TestBed.configureTestingModule({
      imports: [UserOpenAccountModule],
      providers: [
        {
          provide: AppInformationStatesService,
          useValue: appInformationStatesService,
        },
        { provide: VerificationService, useValue: verificationService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserOpenAccountComponent);
    component = fixture.componentInstance;
  });

  it('should have initial account and userAccountFlags', () => {
    expect(component.account).toEqual(jasmine.any(Account));
    expect(component.userAccountFlags).toEqual(jasmine.any(UserAccountFlags));
  });

  it('should change tab name', () => {
    const tabName = 'newTab';
    component.changeTabName(tabName);
    expect(appInformationStatesService.changeTabName).toHaveBeenCalledWith(
      tabName
    );
  });

  it('should verify data and set shake state', () => {
    (
      verificationService.validateAccountCurrency as jasmine.Spy
    ).and.returnValue(false);
    (verificationService.validateAccountType as jasmine.Spy).and.returnValue(
      true
    );
    component.verifyData();
    expect(component.userAccountFlags.isAccountCurrencyValid).toBe(false);
    expect(component.userAccountFlags.isAccountTypeValid).toBe(true);
    expect(component.shakeStateService.shakeState).toBe('shake');
  });
});
