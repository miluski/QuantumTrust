import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Transaction } from '../types/transaction';
import { AppInformationStatesService } from './app-information-states.service';

describe('AppInformationStatesService', () => {
  let service: AppInformationStatesService;
  let routerStub: Partial<Router>;
  let breakpointObserverStub: Partial<BreakpointObserver>;
  let drawerStub: Partial<MatDrawer>;

  beforeEach(() => {
    routerStub = {
      url: '/main-page',
    };
    breakpointObserverStub = {
      observe: jasmine
        .createSpy('observe')
        .and.returnValue(of({ matches: true } as BreakpointState)),
    };
    drawerStub = {
      close: jasmine.createSpy('close'),
      toggle: jasmine.createSpy('toggle'),
      opened: true,
    };

    TestBed.configureTestingModule({
      providers: [
        AppInformationStatesService,
        { provide: Router, useValue: routerStub },
        { provide: BreakpointObserver, useValue: breakpointObserverStub },
      ],
    });
    service = TestBed.inject(AppInformationStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize tabName based on router url', () => {
    expect(service.currentTabName).toBeTruthy();
    service.currentTabName.subscribe((tabName) => {
      expect(tabName).toBe('Finanse');
    });
  });

  it('should observe breakpoints and close drawer if matches', () => {
    service.changeDrawer(drawerStub as MatDrawer);
    service.observeBreakpoints();
    expect(breakpointObserverStub.observe).toHaveBeenCalled();
    expect(drawerStub.close).toHaveBeenCalled();
  });

  it('should change the drawer', () => {
    service.changeDrawer(drawerStub as MatDrawer);
    expect(service['drawer']).toEqual(jasmine.objectContaining(drawerStub));
  });

  it('should change the tab name', () => {
    service.changeTabName('New Tab');
    service.currentTabName.subscribe((tabName) => {
      expect(tabName).toBe('New Tab');
    });
  });

  it('should change the drawer state', () => {
    service.changeIsDrawerOpened(true);
    service.currentIsDrawerOpened.subscribe((isOpened) => {
      expect(isOpened).toBe(true);
    });
  });

  it('should change the transactions array length', () => {
    service.changeTransactionsArrayLength(5);
    service.currentTransactionsArrayLength.subscribe((length) => {
      expect(length).toBe(5);
    });
  });

  it('should toggle the drawer', () => {
    service.changeDrawer(drawerStub as MatDrawer);
    service.toggleDrawer();
    expect(drawerStub.toggle).toHaveBeenCalled();
  });

  it('should return whether the drawer is open', () => {
    service.changeDrawer(drawerStub as MatDrawer);
    expect(service.isDrawerOpen()).toBe(true);
  });

  it('should determine if absolute style can be set', () => {
    const transactionsArray: Transaction[][] = [
      [],
      [
        {
          id: 1,
          amount: 100,
          date: String(new Date()),
          hour: '12:00',
          title: 'Transaction 1',
          assignedAccountNumber: '123',
          category: 'Category 1',
          type: 'incoming',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
          status: 'settled',
        },
      ],
      [
        {
          id: 2,
          amount: 200,
          date: String(new Date()),
          hour: '13:00',
          title: 'Transaction 2',
          assignedAccountNumber: '456',
          category: 'Category 2',
          type: 'outgoing',
          currency: '',
          accountAmountAfter: 0,
          accountCurrency: '',
          status: 'settled',
        },
      ],
    ];
    expect(service.canSetAbsoluteStyle(transactionsArray)).toBe(true);
  });
});
