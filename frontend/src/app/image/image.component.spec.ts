import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ImageComponent } from './image.component';
import { ImageModule } from './image.module';

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    component.src = 'test-image.jpg';
    component.alt = 'Test Image';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoaded to false on image error', () => {
    component.onerror();
    expect(component['isLoaded']).toBeFalse();
  });

  it('should return true for canRender when image is loaded', () => {
    component.onload();
    expect(component.canRender).toBeTrue();
  });
});
