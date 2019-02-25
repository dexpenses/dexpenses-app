import { expect } from 'chai';
import 'mocha';
import { AddressExtractor } from './address';

describe('Address extractor', () => {
  const extractor = new AddressExtractor();

  it('should be successfully extract the street', () => {
    const streets = [
      'Beispielstrasse 1',
      'Beispielstrasse  1',
      'Beispielstrasse 1a',
      'Beispielstrasse 12',
      'Beispielstrasse 123',
      'Beispielstrasse 1234',
      'Beispielstrasse 1234a',
      'An dem Wege 1',
    ]
    for (const street of streets) {
      const result = extractor.extract('', [], {
        header: [
          street,
          '38440 Wolfsburg'
        ]
      })
      expect(result).not.to.be.undefined;
      if (result) {
        expect(result.street).to.equal(street);
      }
    }
  });

  it('should be successfully extract the city', () => {
    const cities = [
      '38440 Wolfsburg',
      '38440  Wolfsburg',
      '0511  Hannover',
      '37081 Göttingen'
    ];
    for (const city of cities) {
      const result = extractor.extract('', [], {
        header: [
          'An dem Wege 1',
          city
        ]
      })
      expect(result).not.to.be.undefined;
      if (result) {
        expect(result.city).to.equal(city);
      }
    }
  });

});
