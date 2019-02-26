import { HeaderExtractor } from "./header";
import { AddressExtractor } from "./address";
import { DateExtractor } from "./date";
import { TimeExtractor } from "./time";
import { AmountExtractor } from "./amount";
import { PaymentMethodExtractor } from "./paymentMethod";
import { ReceiptResult, Receipt } from "./receipt";
import DateTimePostProcessor from "./postprocess/DateTimePostProcessor";

const extractorPipeline = [
  new HeaderExtractor(),
  new AddressExtractor(),
  new DateExtractor(),
  new TimeExtractor(),
  new AmountExtractor(),
  new PaymentMethodExtractor(),
];

// todo check dependencies of extractors or re-order pipeline (error only on circular)

const postProcessors = [
  new DateTimePostProcessor()
]

export default function (text: string): ReceiptResult {
  if (!text) {
    return {
      state: 'no-text',
    };
  }
  const lines = text.split('\n');
  const extracted: Receipt = {};
  let partial = false;
  let anySuccess = false;
  for (const extractor of extractorPipeline) {
    try {
      const value = extractor.extract(text, lines, extracted);
      extracted[extractor.field] = value;
      if (!value) {
        partial = true;
      } else {
        anySuccess = true;
      }
    } catch (e) {
      extracted[extractor.field] = {
        error: e.message || (typeof e === 'string' && e) || 'unknown'
      };
      partial = true;
    }
  }
  if (!anySuccess) {
    return {
      state: 'unreadable',
      data: extracted, // could contains errors
    };
  }
  for (const postProcessor of postProcessors) {
    postProcessor.touch(extracted);
  }
  return {
    state: partial ? 'partial' : 'ready',
    data: extracted,
  };
}
