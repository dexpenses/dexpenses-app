import { expect } from 'chai';
import 'mocha';
import { AmountExtractor } from './amount';

describe('Amount extractor', () => {
  const extractor = new AmountExtractor();

  it('should be successfully extract the amount', () => {
    const text = `EUR 11,10`
    const result = extractor.extract(text, text.split['\n'], {});
    expect(result).not.to.be.null;
    if (result) {
      expect(result.value).to.equal(11.1);
    }
  });

  it('should be successfully extract the amount', () => {
    const text = `EUR 11,10`
    const result = extractor.extract(text, text.split('\n'), {});
    expect(result).not.to.be.null;
    if (result) {
      expect(result.value).to.equal(11.1);
    }
  });

  it('should be successfully extract the amount multiline', () => {
    const text = `betrag
    11,10`
    const result = extractor.extract(text, text.split('\n'), {});
    expect(result).not.to.be.null;
    if (result) {
      expect(result.value).to.equal(11.1);
    }
  });


});
