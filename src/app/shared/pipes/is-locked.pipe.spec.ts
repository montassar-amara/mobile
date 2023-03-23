import { IsLockedPipe } from './is-locked.pipe';

describe('IsLockedPipe', () => {
  it('create an instance', () => {
    const pipe = new IsLockedPipe();
    expect(pipe).toBeTruthy();
  });
});
