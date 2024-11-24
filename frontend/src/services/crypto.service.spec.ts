import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt data correctly', () => {
    const data = { test: 'data' };
    const encryptedData = service.encryptData(data);
    expect(encryptedData).toBeTruthy();
    expect(typeof encryptedData).toBe('string');
  });

  it('should decrypt data correctly', () => {
    const data = { test: 'data' };
    const encryptedData = service.encryptData(JSON.stringify(data));
    const decryptedData = service.decryptData(encryptedData);
    expect(decryptedData).toEqual(JSON.stringify(data));
  });

  it('should return empty string for invalid decryption', () => {
    const invalidData = 'invalidData';
    const decryptedData = service.decryptData(invalidData);
    expect(decryptedData).toBe('');
  });
});