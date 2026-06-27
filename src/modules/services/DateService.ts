import * as moment from "moment";
import * as jmoment from "jalali-moment";
jmoment().locale("fa").format("YYYY/M/D");

export function DateToPersian(created_at: string) {
  const day = Number(jmoment(created_at).locale("fa").format("DD"));
  const month = jmoment(created_at).locale("fa").format("MMMM");
  const year = Number(jmoment(created_at).locale("fa").format("YYYY"));
  const time = jmoment(created_at).locale("fa").format("HH:mm");

  return {
    day,
    month,
    year,
    time,
  };
}

export function DateToInternational(
  input: string,
  format = "YYYY-MM-DD HH:mm:ss"
): string {
  return moment(input).locale("en").format(format);
}
