import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../environments/environment.development';
import { MediaService } from './media.service';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return PHOTO_LOADING_SKELETON when platform is server', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [MediaService, { provide: PLATFORM_ID, useValue: 'server' }],
    });
    service = TestBed.inject(MediaService);
    const photoName = 'test-photo.jpg';

    const result = service.getPhotoUrl(photoName);

    expect(result).toBe('PHOTO_LOADING_SKELETON');
  });
});
