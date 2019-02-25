import { Extractor } from "./extractor";
import { Receipt } from "./receipt";

export interface Amount {
  value: number;
  currency: 'EUR' | 'USD' | 'GBP';
}

export class AmountExtractor extends Extractor {

  constructor() {
    super('amount');
  }

  extract(text: string, lines: string[], extracted: Receipt): Amount | null {

    const m = text.match(/(?:betrag|EUR)(?:\s*|$)(\d+,\d\d).*$/im);
    if (m) {
      return {
        value: parseFloat(m[1].replace(',', '.')),
        currency: 'EUR',
      } as Amount;
    }
    return null;
  }

}
