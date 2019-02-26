import { Extractor } from "./extractor";
import { Receipt } from "./receipt";
import { loadModel, DateExtractionDef } from "./date.model";
import model from './date.model.de';
import * as fecha from 'fecha';

export class DateExtractor extends Extractor {

  private model: DateExtractionDef[];

  constructor() {
    super('date');
    this.model = loadModel(model);
  }

  extract(text: string, lines: string[], extracted: Receipt) {
    for (const def of this.model) {
      const m = text.match(def.regex);
      if (m) {
        return fecha.parse(m[0], def.format);
      }
    }
    return null;
  }

}
