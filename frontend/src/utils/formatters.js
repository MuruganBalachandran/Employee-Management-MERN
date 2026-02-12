/**
 * Converts a date string from YYYY-MM-DD to DD-MM-YYYY
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} - Date in DD-MM-YYYY format
 */
export const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    return `${day}-${month}-${year}`;
};

/**
 * Converts a date string from DD-MM-YYYY to YYYY-MM-DD (for input fields)
 * @param {string} dateStr - Date in DD-MM-YYYY format
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    if (!day || !month || !year) return dateStr;
    return `${year}-${month}-${day}`;
};
