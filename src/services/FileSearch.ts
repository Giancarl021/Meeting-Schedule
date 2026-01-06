import { load } from 'cheerio';
import constants from '../util/constants';
import type Logger from '../interface/Logger';
import getPeriod, { type Period } from '../util/getPeriod';

export interface FileSearchResult {
    midweekUrl: string;
    weekendUrl: string;
}

export default function FileSearch(logger: Logger) {
    async function _getFileUrl(
        searchUrl: string,
        period: Period
    ): Promise<string> {
        const url = searchUrl
            .replaceAll('{lang}', constants.lang)
            .replaceAll('{year}', period.year);

        logger.log(`Parsed search URL as: ${url}`);

        const response = await fetch(url, {
            headers: {
                'User-Agent': constants.userAgent
            }
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch search results: ${response.status} ${response.statusText}`
            );
        }

        logger.log(`Got response with status ${response.status} from ${url}`);

        const data = await response.text();

        logger.log(`Got response page with ${data.length} characters`);

        const $ = load(data);

        let mapUrl: string;

        const results = $('#pubsViewResults .syn-body.publication');

        logger.log(`Got ${results.length} results from query`);

        results.each((_, element) => {
            if (
                $(element)
                    .find('h3')
                    .text()
                    .trim()
                    .toLowerCase()
                    .includes(period.month)
            ) {
                mapUrl = $(element)
                    .find(
                        '.fileLinks [title="Download"][data-preselect="jwpub"]'
                    )
                    .first()
                    .attr('href');

                logger.log(`Got publication download map URL: ${mapUrl}`);
                return false;
            }
        });

        if (!mapUrl) {
            throw new Error(
                `No publication found for ${period.month}/${period.year}`
            );
        }

        const mapResponse = await fetch(mapUrl, {
            headers: {
                'User-Agent': constants.userAgent
            }
        });

        if (!mapResponse.ok) {
            throw new Error(
                `Failed to fetch map file: ${mapResponse.status} ${mapResponse.statusText}`
            );
        }

        const map = await mapResponse.json();

        logger.log(`Got publication map response`);

        const fileMap: Record<string, any> =
            Object.values(map?.files ?? {}).find(file =>
                Object.keys(file).includes('JWPUB')
            ) ?? {};

        const publicationUrl = fileMap.JWPUB?.[0].file?.url;

        if (!publicationUrl) {
            throw new Error(
                `No publication found for ${period.month}/${period.year}`
            );
        }

        return publicationUrl;
    }

    async function search(
        year: number,
        month: number
    ): Promise<FileSearchResult> {
        const [midweekUrl, weekendUrl] = await Promise.all([
            _getFileUrl(
                constants.urls.midweekSearchUrl,
                getPeriod(year, month)
            ),
            _getFileUrl(
                constants.urls.weekendSearchUrl,
                getPeriod(year, month, -2)
            )
        ]);

        return {
            midweekUrl,
            weekendUrl
        };
    }

    return {
        search
    };
}
