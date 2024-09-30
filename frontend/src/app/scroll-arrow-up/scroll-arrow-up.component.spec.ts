import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationsProvider } from '../../providers/animations.provider';
import { WindowEventsService } from '../../services/window-events.service';
import { ScrollArrowUpComponent } from './scroll-arrow-up.component';

describe('ScrollArrowUpComponent', () => {
  let component: ScrollArrowUpComponent;
  let fixture: ComponentFixture<ScrollArrowUpComponent>;
  let windowEventsService: jasmine.SpyObj<WindowEventsService>;
  beforeEach(async () => {
    const windowEventsServiceSpy = jasmine.createSpyObj('WindowEventsService', [
      'startPulsing',
      'scrollToTop',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatTooltipModule,
        ScrollArrowUpComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: WindowEventsService, useValue: windowEventsServiceSpy },
        AnimationsProvider,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ScrollArrowUpComponent);
    component = fixture.componentInstance;
    windowEventsService = TestBed.inject(
      WindowEventsService
    ) as jasmine.SpyObj<WindowEventsService>;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call startPulsing on WindowEventsService when initialized', () => {
    expect(windowEventsService.startPulsing).toHaveBeenCalled();
  });
  it('should call scrollToTop on WindowEventsService when scrollToTop is called', () => {
    component.scrollToTop();
    expect(windowEventsService.scrollToTop).toHaveBeenCalled();
  });
});
