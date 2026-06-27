import * as jmoment from "jalali-moment";

export function convertDateToPersian(created_at: any) {
  const currentYear = Number(
    jmoment(new Date(Date.now())).locale("fa").format("YYYY")
  );
  const day = Number(jmoment(created_at).locale("fa").format("DD"));
  const month = jmoment(created_at).locale("fa").format("MMMM");
  const year = Number(jmoment(created_at).locale("fa").format("YYYY"));

  return {
    day,
    month,
    year,
  };
}
