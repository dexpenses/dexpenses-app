import { expect } from 'chai';
import 'mocha';
import HeaderSanitizer from './HeaderSanitizer';

describe('Header sanitizer', () => {
  const postprocessor = new HeaderSanitizer();

  it('should be wipe address from the header', () => {
    const extracted: any = {
      header: [
        'Echter Shop',
        'Walfahrtstrasse 1',
        '12345 Neustadt'
      ],
      address: {
        street: 'Walfahrtstrasse 1',
        city: '12345 Neustadt'
      }
    }
    postprocessor.touch(extracted);
    expect(extracted.header).to.have.lengthOf(1);
    expect(extracted.header[0]).to.equal('Echter Shop');
  });

});
