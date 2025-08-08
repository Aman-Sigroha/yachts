export function parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Handle different date formats
    const formats = [
        // DD.MM.YYYY
        /^(\d{2})\.(\d{2})\.(\d{4})$/,
        // DD.MM.YYYY HH:mm
        /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/,
        // DD.MM.YYYY HH:mm:ss
        /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
    ];

    for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
            const parts = match.slice(1).map(Number);
            if (format === formats[0]) {
                // DD.MM.YYYY
                return new Date(parts[2], parts[1] - 1, parts[0]);
            } else if (format === formats[1]) {
                // DD.MM.YYYY HH:mm
                return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
            } else {
                // DD.MM.YYYY HH:mm:ss
                return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
            }
        }
    }

    // Try standard Date parsing as fallback
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}
