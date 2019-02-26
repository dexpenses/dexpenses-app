import PostProcessor from "./PostProcessor";
import { Receipt } from "../receipt";

export default class DateTimePostProcessor extends PostProcessor {
  touch(extracted: Receipt) {
    if (extracted.date && extracted.time) {
      const timestamp = new Date(extracted.date.getTime());
      const [hours, minutes, seconds] = extracted.time.split(':').map((v: string) => parseInt(v));
      timestamp.setHours(hours);
      timestamp.setMinutes(minutes);
      timestamp.setSeconds(seconds);
      extracted.timestamp = timestamp;
    }
  }

}
