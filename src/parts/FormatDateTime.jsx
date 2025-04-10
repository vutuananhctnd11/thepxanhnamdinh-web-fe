import dayjs from "dayjs";

export function formatDateTime(dateTimeString) {
  const date = dayjs(dateTimeString);

  return {
    date: date.format("DD/MM/YYYY"),
    time: date.format("HH:mm"),
  };
}
