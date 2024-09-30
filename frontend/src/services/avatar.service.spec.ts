import { TestBed } from '@angular/core/testing';
import { UserAccount } from '../types/user-account';
import { AvatarService } from './avatar.service';
import { UserService } from './user.service';

describe('AvatarService', () => {
  let service: AvatarService;
  let userServiceStub: Partial<UserService>;
  beforeEach(() => {
    userServiceStub = {
      userAccount: {
        name: 'John',
        surname: 'Doe',
      } as UserAccount,
    };
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: userServiceStub }],
    });
    service = TestBed.inject(AvatarService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set temporary avatar URL', () => {
    const testUrl = 'http://example.com/avatar.jpg';
    service.setTemporaryAvatarUrl(testUrl);
    service.currentTemporaryAvatarUrl.subscribe((url) => {
      expect(url).toBe(testUrl);
    });
  });
  it('should set temporary avatar error', () => {
    service.setTemporaryAvatarError(true);
    service.currentAvatarError.subscribe((error) => {
      expect(error).toBe(true);
    });
  });
  it('should return actual avatar error', () => {
    service.setTemporaryAvatarError(true);
    expect(service.actualAvatarError).toBe(true);
  });
  it('should generate initials from user name and surname', () => {
    expect(service.getInitials()).toBe('JD');
  });
  it('should generate a random color for the avatar', () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];
    expect(colors).toContain(service.avatarColor);
  });
});
