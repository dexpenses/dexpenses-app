import PostProcessor from "./PostProcessor";
import { Receipt } from "../receipt";

export default class HeaderSanitizer extends PostProcessor {
  touch(extracted: Receipt) {
    extracted.header = (extracted.header as string[])
      .map((line) => {
        let sanitized = line;
        sanitized = this._sanitize(sanitized, (extracted.address || {}).city);
        sanitized = this._sanitize(sanitized, (extracted.address || {}).street);
        // todo date (we need the matched string for that tho)
        return sanitized;
      })
      .filter(line => !!line)
      ;
  }

  _sanitize(line: string, value?: string): string {
    if (!value) {
      return line;
    }
    const i = line.indexOf(value);
    if (i === -1) {
      return line;
    }
    return `${line.substring(0, i)}${line.substring(i + value.length)}`
      .trim()
      .replace(/^[,.]/, '')
      .replace(/[,.]$/, '')
      ;
  }

}
