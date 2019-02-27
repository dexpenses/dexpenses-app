import { Extractor } from "./extractor";
import { Receipt } from "./receipt";
import { DependsOn } from "./DependsOn";
import { HeaderExtractor } from "./header";

@DependsOn(HeaderExtractor)
export class PhoneNumberExtractor extends Extractor {

  constructor() {
    super('phone');
  }

  extract(text: string, lines: string[], extracted: Receipt) {
    for (const line of extracted.header) {
      const m = line.match(/(\(?([\d \-\)\–\+\/\(]+){6,}\)?([ .-–\/]?)([\d]+))/);
      if (m) {
        return m[0];
      }
    }
    return null;
  }

}
