import { CardIdFormatPipe } from '../pipes/card-id-format.pipe';

describe('CardIdFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new CardIdFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
