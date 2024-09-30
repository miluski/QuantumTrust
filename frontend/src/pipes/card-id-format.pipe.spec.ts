import { CardIdFormatPipe } from '../pipes/card-id-format.pipe';

describe('CardIdFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new CardIdFormatPipe();
    expect(pipe).toBeTruthy();
  });
  it('should format card ID correctly', () => {
    const pipe = new CardIdFormatPipe();
    expect(pipe.transform(1234567890123456)).toBe('1234 5678 9012 3456');
  });
  it('should handle card ID with less than 4 digits', () => {
    const pipe = new CardIdFormatPipe();
    expect(pipe.transform(123)).toBe('123');
  });
  it('should handle card ID with exactly 4 digits', () => {
    const pipe = new CardIdFormatPipe();
    expect(pipe.transform(1234)).toBe('1234');
  });
  it('should handle card ID with more than 4 but less than 8 digits', () => {
    const pipe = new CardIdFormatPipe();
    expect(pipe.transform(12345)).toBe('1234 5');
  });
  it('should handle card ID with non-numeric input gracefully', () => {
    const pipe = new CardIdFormatPipe();
    expect(() => pipe.transform(NaN)).toThrow();
  });
});
