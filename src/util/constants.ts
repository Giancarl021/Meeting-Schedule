export default {
    monthMap: (
        process.env.MONTH_MAP ||
        'January,February,March,April,May,June,July,August,September,October,November,December'
    )
        .split(',')
        .filter(Boolean)
        .reduce(
            (acc, month, index) => ({
                ...acc,
                [index + 1]: month.trim().toLowerCase()
            }),
            {}
        ) as Record<number, string>,
    lang: process.env.SEARCH_LANG || 'en',
    userAgent:
        process.env.USER_AGENT ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
    urls: {
        midweekSearchUrl: `https://www.jw.org/en/library/jw-meeting-workbook/?contentLanguageFilter={lang}&pubFilter=mwb&yearFilter={year}`,
        weekendSearchUrl: `https://www.jw.org/en/library/magazines/?contentLanguageFilter={lang}&pubFilter=w&yearFilter={year}`
    }
} as const;
