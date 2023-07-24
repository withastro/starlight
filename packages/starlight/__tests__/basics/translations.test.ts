import { expect, test } from 'vitest';
import translations from '../../translations';

test('it includes English', () => {
  expect(translations).toHaveProperty('en');
});
