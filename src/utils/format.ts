/**
 * Formats a 24-hour time string (e.g., "16:00:00" or "16:00") to 12-hour format with AM/PM (e.g., "04:00 PM").
 */
export const formatTime12h = (timeStr?: string | null): string => {
  if (!timeStr) return "";
  
  // Handle if it's already in a combined date/time format
  let timePart = timeStr;
  if (timeStr.includes(" ")) {
    const parts = timeStr.split(" ");
    timePart = parts[parts.length - 1];
  }

  const [hStr, mStr] = timePart.split(":");
  const hours = parseInt(hStr, 10);
  if (isNaN(hours)) return timeStr;

  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  const minutes = mStr || "00";
  
  return `${String(normalizedHours).padStart(2, "0")}:${minutes} ${period}`;
};

/**
 * Formats a combined date and time string to a readable 12-hour format.
 * Input: "15 Mar 2026 16:00:00" or "2026-03-15 16:00:00"
 * Output: "15 Mar 2026 04:00 PM"
 */
export const formatDateTime12h = (dateTimeStr?: string | null): string => {
  if (!dateTimeStr) return "";
  
  // Split into date and time parts
  const parts = dateTimeStr.trim().split(/\s+/);
  if (parts.length < 2) return dateTimeStr;

  const timePart = parts.pop(); // Last part is usually time
  const datePart = parts.join(" ");
  
  const formattedTime = formatTime12h(timePart);
  
  // If formatTime12h returned something useful
  if (formattedTime && formattedTime !== timePart) {
    return `${datePart} ${formattedTime}`;
  }
  
  return dateTimeStr;
};
