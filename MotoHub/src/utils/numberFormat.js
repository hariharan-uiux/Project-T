/**
 * Formats a number or numeric string to include comma separators.
 * Example: 10000 -> "10,000"
 */
export const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '';

    // Remove any existing commas first to handle re-formatting
    const stringValue = String(value).replace(/,/g, '');

    // Check if it's a valid number
    if (isNaN(stringValue)) return stringValue;

    // Handle decimals if any
    const parts = stringValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
};

/**
 * Removes commas from a formatted numeric string to get the raw value.
 * Example: "10,000" -> "10000"
 */
export const unformatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '';
    return String(value).replace(/,/g, '');
};
