async function collectTimezone() {
    const tzOptions = Intl.DateTimeFormat().resolvedOptions();
    const now = new Date();

    const offset = now.getTimezoneOffset();
    const jan = new Date(2020, 0, 1).getTimezoneOffset();
    const jul = new Date(2020, 6, 1).getTimezoneOffset();

    return {
        datetime: {
            timezone: tzOptions.timeZone || null,
            locale: tzOptions.locale || null,
            calendar: tzOptions.calendar || null,
            numberingSystem: tzOptions.numberingSystem || null,

            offsetMinutes: offset,
            observesDST: jan !== jul,
            offsetJan: jan,
            offsetJul: jul,

            // Raw date strings
            dateString: now.toString(),
            toLocaleString: now.toLocaleString(),
            toLocaleDate: now.toLocaleDateString(),
            toLocaleTime: now.toLocaleTimeString(),

            // Intl formats
            longTzName: Intl.DateTimeFormat("en-US", { timeZoneName: "long" }).format(now),
            weekdayEnGB: Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(now),
        }
    };
}
