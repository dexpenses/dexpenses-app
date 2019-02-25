import { HeaderExtractor } from "./header";
import { AddressExtractor } from "./address";
import { DateExtractor } from "./date";
import { TimeExtractor } from "./time";
import { AmountExtractor } from "./amount";
import { PaymentMethodExtractor } from "./paymentMethod";
import { ReceiptResult, ReceiptResults, Receipt } from "./receipt";

const extractorPipeline = [
  new HeaderExtractor(),
  new AddressExtractor(),
  new DateExtractor(),
  new TimeExtractor(),
  new AmountExtractor(),
  new PaymentMethodExtractor(),
];

export default function (text: string): ReceiptResult {
  if (!text) {
    return ReceiptResults.Unreadable;
  }
  const lines = text.split('\n');
  const extracted: Receipt = {};
  let partial = false;
  for (const extractor of extractorPipeline) {
    try {
      const value = extractor.extract(text, lines, extracted);
      extracted[extractor.field] = value;
      if (!value) {
        partial = true;
      }
    } catch (e) {
      extracted[extractor.field] = {
        error: e.message || (typeof e === 'string' && e) || 'unknown'
      };
      partial = true;
    }
  }
  return {
    state: partial ? 'partial' : 'ready',
    data: extracted,
  };
}
