// For sending to backend (store as DD-MM-YYYY)
export const formatDateForBackend = (yyyyMMdd = "") => {
  if (!yyyyMMdd) return "";
  const [y, m, d] = yyyyMMdd.split("-");
  return `${d}-${m}-${y}`;
};

// For showing in <input type="date"> (edit)
export const formatDateForInput = (ddMMyyyy = "") => {
  if (!ddMMyyyy) return "";

  // already valid
  if (/^\d{4}-\d{2}-\d{2}$/.test(ddMMyyyy)) return ddMMyyyy;

  const [d, m, y] = ddMMyyyy.split("-");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};
