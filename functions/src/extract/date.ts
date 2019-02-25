import { Extractor } from "./extractor";
import { Receipt } from "./receipt";

export class DateExtractor extends Extractor {

  constructor() {
    super('date');
  }

  extract(text: string, lines: string[], extracted: Receipt) {
    return Extractor.anyLineMatches(lines, line => {
      return line.match(/(\d\d)\.(\d\d)\.(\d{4})/i);
    }).then(([_, day, month, year]: any) => new Date(parseInt(year), parseInt(month) - 1, parseInt(day)))
  }

}
