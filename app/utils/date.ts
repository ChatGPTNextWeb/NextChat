export const formatDateToTime = (date: string): string => {
  try {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return date;
  }
};
