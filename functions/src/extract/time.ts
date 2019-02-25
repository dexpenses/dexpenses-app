import { Extractor } from "./extractor";
import { Receipt } from "./receipt";

export class TimeExtractor extends Extractor {

  constructor() {
    super('time');
  }

  extract(text: string, lines: string[], extracted: Receipt) {
    return Extractor.anyLineMatches(lines, line => {
      return line.match(/^.*(\d\d):(\d\d):(\d\d)\s*(?:uhr)?.*$/i);
    }).then(([_, hour, minutes, seconds]: any) => `${hour}:${minutes}:${seconds}`)
  }

}
