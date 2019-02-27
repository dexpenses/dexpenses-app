import { Extractor } from "./extractor";
import { Receipt } from "./receipt";

const irrelevantLines = [
  /^Datum:/i,
  /^Uhrzeit:/i,
  /^Beleg(\-?Nr\.?|nummer)/i,
  /^Trace(\-?Nr\.?|nummer)/i,
  /kundenbeleg/i,
  /h(ae|ä)ndlerbeleg/i,
  /zwischensumme/i,
];

export class HeaderExtractor extends Extractor {

  constructor(protected options = {
    maxHeaderLines: 8
  }) {
    super('header');
  }

  _isIrrelevantLine(line: string): boolean {
    return irrelevantLines.some(r => !!line.match(r));
  }

  _isHeaderDelimiter(line: string): boolean {
    return !line.match(/[\d\w]/);
  }

  extract(text: string, lines: string[], extracted: Receipt) {
    const headerLines: string[] = [];
    // todo possibly jump to first non-empty line?
    for (let i = 0; i < this.options.maxHeaderLines && i < lines.length; i++) {
      const line = lines[i];
      if (this._isIrrelevantLine(line)) {
        continue;
      }
      if (!line.trim() || this._isHeaderDelimiter(line)) {
        return headerLines;
      }
      headerLines.push(line);
    }
    return headerLines;
  }

}
