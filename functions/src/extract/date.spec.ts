import { expect } from 'chai';
import 'mocha';
import { DateExtractor } from './date';

describe('Date extractor', () => {
  const extractor = new DateExtractor();

  it('should be successfully extract the date', () => {
    const date = extractor.extract('', [
      '22.01.201',
      'Datum 22.01.2019'
    ], {});
    expect(date).not.to.be.undefined;
    if (date) {
      expect(date).to.equalDate(new Date(2019, 0, 22));
    }
  });

});
