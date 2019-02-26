import { Extractor } from "./extractor";
import { Receipt } from "./receipt";
import { DependsOn } from "./DependsOn";
import { HeaderExtractor } from "./header";

export interface Address {
  city?: string;
  street?: string;
}

@DependsOn(HeaderExtractor)
export class AddressExtractor extends Extractor {

  constructor() {
    super('address');
  }

  extract(text: string, lines: string[], extracted: Receipt) {
    if (!extracted.header || extracted.header.length === 0) {
      return null;
    }
    const address: Address = {};
    for (const line of extracted.header) {
      if (!address.city) {
        const city = line.match(/\d{4,5}\s+[a-z\u00e0-\u00ff]+/i);
        if (city) {
          address.city = city[0];
        }
      }
      if (!address.street) {
        const street = line.match(/([a-z\u00e0-\u00ff]+\s+)*[a-z\u00e0-\u00ff]+\s+\d{1,4}[a-z]?/i);
        if (street) {
          address.street = street[0];
        }
      }
    }
    return address;
  }

}
