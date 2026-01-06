import { loadPub } from 'meeting-schedules-parser';
import type Logger from '../interface/Logger';
import type { FileSearchResult } from './FileSearch';

export interface ParsedFiles {
    midweek: unknown;
    weekend: unknown;
}

export default function FileParser(logger: Logger) {
    async function parse(searchResult: FileSearchResult): Promise<ParsedFiles> {
        const [midweek, weekend] = await Promise.all([
            loadPub({ url: searchResult.midweekUrl }),
            loadPub({ url: searchResult.weekendUrl })
        ]);

        return { midweek, weekend };
    }

    return {
        parse
    };
}
